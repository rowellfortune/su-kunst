import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  BatchGetCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import { RestUtil } from "@su-kunst/core/util";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

// Adjust if your user profile SK differs
const USER_PROFILE_SK = (userId: string) => `PROFILE#${userId}`;

// Helpers for opaque cursors
function encodeCursor(key?: Record<string, any> | undefined) {
  if (!key) return undefined;
  return Buffer.from(JSON.stringify(key)).toString("base64");
}
function decodeCursor(cursor?: string | null) {
  if (!cursor) return undefined;
  try {
    return JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
  } catch {
    return undefined;
  }
}

export const main = RestUtil.restHandler(async (event: APIGatewayProxyEvent) => {
  // Path param of the user whose followers we want
  const targetId = event.pathParameters?.targetId!;
  if (!targetId) {
    return JSON.stringify({ success: false, error: "Missing targetId" })
  }

  // Pagination inputs
  const qs = event.queryStringParameters ?? {};
  const limit = Math.max(1, Math.min(100, Number(qs.limit ?? 20)));
  const cursor = decodeCursor(qs.cursor ?? undefined);

  // 1) Query follower edges for this target user
  const edgeRes = await ddb.send(
    new QueryCommand({
      TableName: Resource.SuKunst.name,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :pref)",
      ExpressionAttributeValues: {
        ":pk": `USER#${targetId}`,
        ":pref": "FOLLOWER#",
      },
      Limit: limit,
      ExclusiveStartKey: cursor,
      ProjectionExpression: "sk, followerId, createdAt", // followerId is written on edge; sk fallback if needed
    })
  );

  const edges = edgeRes.Items ?? [];

  // Extract followerIds (fallback to parse from sk if followerId field not present)
  const followerIds: string[] = edges.map((e: any) => {
    if (e.followerId) return e.followerId as string;
    const sk: string = e.sk as string; // "FOLLOWER#<id>"
    return sk.substring("FOLLOWER#".length);
  });

  // 2) (Optional) Hydrate profiles in a single BatchGet
  let profilesById: Record<string, any> = {};
  if (followerIds.length) {
    const keys = followerIds.map((id) => ({ pk: `USER#${id}`, sk: USER_PROFILE_SK(id) }));
    const batch = await ddb.send(
      new BatchGetCommand({
        RequestItems: {
          [Resource.SuKunst.name]: {
            Keys: keys,
            ProjectionExpression:
              "pk, sk, username, displayName, avatarFile, avatarUrl, bio", // adjust to your profile fields
          },
        },
      })
    );
    const found = batch.Responses?.[Resource.SuKunst.name] ?? [];
    for (const p of found) {
      const id = String((p as any).pk).replace(/^USER#/, "");
      profilesById[id] = p;
    }
  }

  // 3) Shape response items
  const items = edges.map((e: any) => {
    const id = e.followerId ?? String(e.sk).substring("FOLLOWER#".length);
    return {
      userId: id,
      followedAt: e.createdAt ?? undefined,
      profile: profilesById[id] ?? null, // may be null if not found / minimal projection
    };
  });

  // 4) Return with nextCursor
  return JSON.stringify({
    items,
    nextCursor: encodeCursor(edgeRes.LastEvaluatedKey),
  });
});
