import { Resource } from "sst";
import { RestUtil } from "@su-kunst/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient, type QueryCommandInput } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = RestUtil.restHandler(async (event) => {
  const qs = event.queryStringParameters ?? {};
  const limit = Math.min(Number(qs.limit) || 20, 50);

  const params: QueryCommandInput = {
    TableName: Resource.SuKunst.name,
    IndexName: "entityTypeIndex",
    KeyConditionExpression: "entityType = :post",
    ExpressionAttributeValues: {
      ":post": "POST",
    },
    ScanIndexForward: false,
    Limit: limit,
  };

  if (qs.cursor) {
    params.ExclusiveStartKey = JSON.parse(
      Buffer.from(qs.cursor, "base64url").toString()
    );
  }

  const result = await dynamoDb.send(new QueryCommand(params));

  const nextCursor = result.LastEvaluatedKey
    ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString("base64url")
    : null;

  return JSON.stringify({
    items: result.Items,
    nextCursor,
  });
});