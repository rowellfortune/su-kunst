import { Resource } from "sst";
import { RestUtil } from "@su-kunst/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = RestUtil.restHandler(async (event) => {
  const params = {
    TableName: Resource.SuKunst.name,
    IndexName: "entityTypeIndex", // 👈 Use your new GSI
    KeyConditionExpression: "entityType = :opportunity",
    ExpressionAttributeValues: {
      ":opportunity": "OPPORTUNITY",
    },
  };

  const result = await dynamoDb.send(new QueryCommand(params));

  // console.log(result);


  return JSON.stringify(result.Items);
});
