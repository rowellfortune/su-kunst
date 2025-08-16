// services/functions/notifications.markRead.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import { RestUtil } from "@su-kunst/core/util"; // your existing wrapper

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

/**
 * Route: PUT /notifications/{sk}/read
 * Security: per-user by partition key (pk = USER#{identityId})
 * Behavior: Idempotently sets read=true and updates updatedAt
 */
export const main = RestUtil.restHandler(async (event: any) => {
  // 1) Auth: extract the caller's identity (works with your IAM/Cognito setup)
  const full  = event?.requestContext?.authorizer?.iam?.cognitoIdentity?.amr[2];
  const userId = full.replace(/^.*:/, "");

  // 2) Inputs
  const sk = `NOTIFICATION#${event?.pathParameters?.id}`;


  const pk = `USER#${userId}`;

  console.log(pk, sk);
  const now = Date.now();

  // 3) Update (idempotent). We also assert the item exists and looks like a notification.
  //    Using begins_with on SK is optional, but it’s a nice safety if your SKs are prefixed.
  try {
    const res = await ddb.send(
      new UpdateCommand({
        TableName: Resource.SuKunst.name, // ← your table from SST
        Key: { pk, sk },
        UpdateExpression: "SET #read = :true, #updatedAt = :now",
        ExpressionAttributeNames: {
          "#read": "read",
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":true": true,
          ":now": now,
          ":notifPrefix": "NOTIFICATION#", // adjust to your SK convention
        },
        // Prevents creating a new item if the key doesn't exist,
        // and (optionally) ensures we're touching a NOTIF item.
        ConditionExpression:
          "attribute_exists(pk) AND attribute_exists(sk) AND begins_with(sk, :notifPrefix)",
        ReturnValues: "ALL_NEW",
      })
    );

    console.log(res)


   return JSON.stringify({ success: true, data: res});
   
  } catch (err: any) {
   
  }


});
