import * as uuid from "uuid";
import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import { RestUtil } from "@su-kunst/core/util";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

// Change this if your profile SK differs (e.g. "PROFILE" or "DETAILS#<id>")
const USER_PROFILE_SK = (userId: string) => `PROFILE`;

export const main = RestUtil.restHandler(async (event) => {
  let data, commentParams;
  if (event.body != null) {
    data = JSON.parse(event.body);
  }

  // targetId is the user being followed/unfollowed
  console.log(data)
  const targetId = event.pathParameters!.id!;
  // followerId is the authenticated user (the actor)
  const full  = event?.requestContext?.authorizer?.iam?.cognitoIdentity?.amr[2];
  const  followerId = full.replace(/^.*:/, "");

  console.log(followerId)
  console.log(targetId)

//   if (!targetId || !followerId) {
//     return JSON.stringify({ success: false, error: "Missing targetId or userId" })
//   }

//   if (targetId === followerId) {
//     return JSON.stringify({ success: false, error: "Cannot follow yourself." })
//   }

//   // Keys
//   const followEdgeKey = { pk: `USER#${targetId}`, sk: `FOLLOWER#${followerId}` };
//   const targetProfileKey = { pk: `USER#${targetId}`, sk: USER_PROFILE_SK(targetId) };
//   const followerProfileKey = { pk: `USER#${followerId}`, sk: USER_PROFILE_SK(followerId) };

//   // Check if relationship exists
//   const existing = await ddb.send(
//     new GetCommand({
//       TableName: Resource.SuKunst.name,
//       Key: followEdgeKey,
//       ProjectionExpression: "pk",
//     })
//   );
//   const isFollowing = !!existing.Item;

//   if (!isFollowing) {
//     // FOLLOW: create edge + increment counters (target.followerCount, follower.followingCount) atomically
//     const now = Date.now();
//     const bodyData = event.body ? JSON.parse(event.body) : undefined;

//     const writes = [
//       {
//         Put: {
//           TableName: Resource.SuKunst.name,
//           Item: {
//             ...followEdgeKey,
//             entityType: "FOLLOW",
//             followerId,
//             targetId,
//             createdAt: now,
//             // Optional GSI to list "who I follow"
//             GSI2PK: `USER#${followerId}`,
//             GSI2SK: `FOLLOWING#${targetId}`,
//           },
//           ConditionExpression: "attribute_not_exists(pk)",
//         },
//       },
//       {
//         Update: {
//           TableName: Resource.SuKunst.name,
//           Key: targetProfileKey,
//           UpdateExpression:
//             "SET followerCount = if_not_exists(followerCount, :z) + :one",
//           ExpressionAttributeValues: { ":z": 0, ":one": 1 },
//         },
//       },
//       {
//         Update: {
//           TableName: Resource.SuKunst.name,
//           Key: followerProfileKey,
//           UpdateExpression:
//             "SET followingCount = if_not_exists(followingCount, :z) + :one",
//           ExpressionAttributeValues: { ":z": 0, ":one": 1 },
//         },
//       },
//     ] as any[];

//     // Optional: notification to target user
//     writes.push({
//       Put: {
//         TableName: Resource.SuKunst.name,
//         Item: {
//           pk: `USER#${targetId}`,
//           sk: `NOTIFICATION#${uuid.v4()}`,
//           entityType: "NOTIFICATION",
//           type: "FOLLOW",
//           actorId: followerId,
//           message: bodyData?.user?.username
//             ? `${bodyData.user.username} started following you`
//             : "You have a new follower",
//           read: false,
//           createdAt: now,
//         },
//       },
//     });

//     await ddb.send(new TransactWriteCommand({ TransactItems: writes }));

//     // Return current state (optionally fetch fresh counts for UI)
//     const [targetCount, followerCount] = await Promise.all([
//       ddb.send(
//         new GetCommand({
//           TableName: Resource.SuKunst.name,
//           Key: targetProfileKey,
//           ProjectionExpression: "followerCount",
//         })
//       ),
//       ddb.send(
//         new GetCommand({
//           TableName: Resource.SuKunst.name,
//           Key: followerProfileKey,
//           ProjectionExpression: "followingCount",
//         })
//       ),
//     ]);

//     return JSON.stringify({
//       following: true,
//       followerCount: targetCount.Item?.followerCount ?? 1,
//       followingCount: followerCount.Item?.followingCount ?? 1,
//     });
//   } else {
//     // UNFOLLOW: delete edge + decrement counters atomically
//     await ddb.send(
//       new TransactWriteCommand({
//         TransactItems: [
//           {
//             Delete: {
//               TableName: Resource.SuKunst.name,
//               Key: followEdgeKey,
//               ConditionExpression: "attribute_exists(pk)",
//             },
//           },
//           {
//             Update: {
//               TableName: Resource.SuKunst.name,
//               Key: targetProfileKey,
//               UpdateExpression:
//                 "SET followerCount = if_not_exists(followerCount, :z) + :neg",
//               ExpressionAttributeValues: { ":z": 0, ":neg": -1 },
//             },
//           },
//           {
//             Update: {
//               TableName: Resource.SuKunst.name,
//               Key: followerProfileKey,
//               UpdateExpression:
//                 "SET followingCount = if_not_exists(followingCount, :z) + :neg",
//               ExpressionAttributeValues: { ":z": 0, ":neg": -1 },
//             },
//           },
//         ],
//       })
//     );

//     // Fetch healed counts to avoid negatives in UI
//     const [targetCount, followerCount] = await Promise.all([
//       ddb.send(
//         new GetCommand({
//           TableName: Resource.SuKunst.name,
//           Key: targetProfileKey,
//           ProjectionExpression: "followerCount",
//         })
//       ),
//       ddb.send(
//         new GetCommand({
//           TableName: Resource.SuKunst.name,
//           Key: followerProfileKey,
//           ProjectionExpression: "followingCount",
//         })
//       ),
//     ]);

//     // Guard in UI (optional server-side heal can be added similarly to likes)
//     return JSON.stringify({
//       following: false,
//       followerCount: Math.max(0, Number(targetCount.Item?.followerCount ?? 0)),
//       followingCount: Math.max(0, Number(followerCount.Item?.followingCount ?? 0)),
//     });
//   }

return JSON.stringify({event})

});
