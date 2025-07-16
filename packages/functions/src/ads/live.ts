import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { RestUtil } from "@su-kunst/core/util";
import { Resource } from "sst";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = RestUtil.restHandler(async (event) => {
  const now = Date.now();

  const params = {
    TableName: Resource.SuKunst.name,
    IndexName: "entityTypeIndex",
    KeyConditionExpression: "entityType = :ad",
    FilterExpression: "startDate <= :now AND endDate >= :now",
    ExpressionAttributeValues: {
      ":ad": "AD",
      ":now": now
    },
    ScanIndexForward: false, // newest first
  };

  const result = await dynamoDb.send(new QueryCommand(params));
  return JSON.stringify(result.Items);
});
