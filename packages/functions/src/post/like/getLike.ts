// src/posts/getLikes.ts
import { Resource } from "sst";
import { RestUtil } from "@su-kunst/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = RestUtil.restHandler(async (event) => {
  // ──────────────────────────────────────────────────────────────
  // 1️⃣ Extract path‑ and auth‑info
  // ──────────────────────────────────────────────────────────────
  const postId = event.pathParameters!.postId!;   
  const full  = event?.requestContext?.authorizer?.iam?.cognitoIdentity?.amr[2];
  // 1) Using replace with a regex that eats everything up through the last “:”
  const userId = full.replace(/^.*:/, "");
  // → "949874d8‑f0e1‑7035‑7d5b‑a27443550deb"                                 // e.g. "5e8d93c0‑…"

  // console.log(us)
  // ──────────────────────────────────────────────────────────────
  // 2️⃣ Build keys for DynamoDB
  // ──────────────────────────────────────────────────────────────
  const postPk     = postId;                       // partition key for all reactions on this post
  const reactionSk = `LIKE#${userId}`;                   // sort key for this user’s reaction
  // ──────────────────────────────────────────────────────────────
  // 3️⃣ Query total likes count
  //    - KeyConditionExpression: filters items by pk and sk prefix
  //    - Select: "COUNT" avoids fetching full items, only returns .Count
  // ──────────────────────────────────────────────────────────────
  const countResult = await ddb.send(new QueryCommand({
    TableName:             Resource.SuKunst.name,
    KeyConditionExpression: "pk = :pk AND begins_with(sk, :prefix)",
    ExpressionAttributeValues: {
      ":pk": postPk,
      ":prefix": "LIKE#",
    },
    Select: "COUNT",
  }));

  const count = countResult.Count ?? 0;

  // ──────────────────────────────────────────────────────────────
  // 4️⃣ Check if *this* user has liked already
  //    - A simple GetCommand on pk+sk returns the item if it exists
  // ──────────────────────────────────────────────────────────────
  const getResult = await ddb.send(new GetCommand({
    TableName: Resource.SuKunst.name,
    Key:       { pk: postPk, sk: reactionSk },
  }));

  const liked = Boolean(getResult.Item);

  console.log(liked, count)

  // ──────────────────────────────────────────────────────────────
  // 5️⃣ Return both the like‑flag and the total count
  // ──────────────────────────────────────────────────────────────

  return JSON.stringify({ liked, count });
});
