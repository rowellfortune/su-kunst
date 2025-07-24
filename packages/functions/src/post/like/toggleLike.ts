import * as uuid from "uuid";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import { RestUtil } from "@su-kunst/core/util";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = RestUtil.restHandler(async (event) => {
  let data, commentParams;
  if (event.body != null) {
    data = JSON.parse(event.body);
  }

  // ─────────────────────────────────────────────────────
  // 1️⃣ Parse input and identify user + post
  // ─────────────────────────────────────────────────────
  // Extract the authenticated user ID from Cognito
 
  // const userId = event.requestContext.authorizer?.iam.cognitoIdentity.identityId!;
  // Extract postId from path parameters
  const postId = event.pathParameters!.postId!;

  const full  = event?.requestContext?.authorizer?.iam?.cognitoIdentity?.amr[2];
  const userId = full.replace(/^.*:/, "");


  // ─────────────────────────────────────────────────────
  // 2️⃣ Build DynamoDB keys
  // ─────────────────────────────────────────────────────
  // Partition key = the post ID
  const pk = postId;
  // Sort key = LIKE#<userId> to uniquely identify this user's like
  const sk = `LIKE#${userId}`;

  // Common params to check existence
  const getParams = {
    TableName: Resource.SuKunst.name,
    Key: { pk, sk },
  };

  // ─────────────────────────────────────────────────────
  // 3️⃣ Check if the like already exists
  // ─────────────────────────────────────────────────────
  const { Item } = await dynamoDb.send(new GetCommand(getParams));

  // ─────────────────────────────────────────────────────
  // 4️⃣ Toggle like: delete if exists, otherwise create
  // ─────────────────────────────────────────────────────
  if (Item) {
    // 👍 Unlike: remove the existing like item
    await dynamoDb.send(
      new DeleteCommand({ TableName: Resource.SuKunst.name, Key: { pk, sk } })
    );
  } else {
    // ❤️ Like: put a new like item
    await dynamoDb.send(
      new PutCommand({
        TableName: Resource.SuKunst.name,
        Item: {
          pk,
          sk,
          entityType: "LIKE",
          userId,
          createdAt: Date.now(),
        },
      })
    );

    // ───────────────────────────────────────────────────
    // 5️⃣ Notification: inform post owner of the new like
    // ───────────────────────────────────────────────────
    // 5a. Fetch post details to find the owner
    const postDetail = await dynamoDb.send(
      new GetCommand({
        TableName: Resource.SuKunst.name,
        Key: { pk: postId, sk: `DETAILS#${postId}` },
      })
    );
    const postOwnerId = postDetail.Item?.postedBy;

    // 5b. Only notify if the liker is not the owner
    if (postOwnerId && postOwnerId !== userId) {
      const notification = {
        pk: `USER#${postOwnerId}`,            // partition by user to list their notifications
        sk: `NOTIFICATION#${uuid.v4()}`,      // unique notification sort key
        entityType: "NOTIFICATION",         // type marker
        message: `${data.user.username} liked your post`, // simple message text
        postId,                               // allow client to link back to post
        read: false,                          // unread by default
        createdAt: Date.now(),                // timestamp
      };
      // Persist the notification
      await dynamoDb.send(
        new PutCommand({ TableName: Resource.SuKunst.name, Item: notification })
      );
    }
  }

  // ─────────────────────────────────────────────────────
  // 6️⃣ Re‑count total likes for this post
  // ─────────────────────────────────────────────────────
  const countResult = await dynamoDb.send(
    new QueryCommand({
      TableName: Resource.SuKunst.name,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :r)",
      ExpressionAttributeValues: {
        ":pk": postId,
        ":r": "LIKE#",
      },
      Select: "COUNT", // only fetch the count, not full items
    })
  );
  const count = countResult.Count ?? 0;

  // ─────────────────────────────────────────────────────
  // 7️⃣ Return the updated like state and count
  // ─────────────────────────────────────────────────────
  return JSON.stringify({       
    liked: !Item,
    count: count 
  });
});
