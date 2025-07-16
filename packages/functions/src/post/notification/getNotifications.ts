import { Resource } from "sst";
import { RestUtil } from "@su-kunst/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = RestUtil.restHandler(async (event) => {
  const userId = event?.requestContext?.authorizer?.iam?.cognitoIdentity?.identityId;

  if (!userId) {
    return JSON.stringify({ error: "Unauthorized" });
  }

  const params = {
    TableName: Resource.SuKunst.name,
    KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
    ExpressionAttributeValues: {
      ":pk": `USER#${userId}`,
      ":skPrefix": "NOTIFICATION#",
    },
    ScanIndexForward: false, // newest first
  };

  const result = await dynamoDb.send(new QueryCommand(params));

  return JSON.stringify(result.Items || []);
});
