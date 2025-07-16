import { Resource } from "sst";
import { RestUtil, GraphqlUtil } from "@su-kunst/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = RestUtil.restHandler(async (event) => {
  console.log(event.pathParameters)
  const params = {
    TableName: Resource.SuKunst.name,
    // 'Key' defines the partition key and sort key of
    // the item to be retrieved
    KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
    ExpressionAttributeValues: {
      ":pk": event?.pathParameters?.id,
      ":skPrefix": "DETAILS#AD#",
    },
    Key: {
      pk: event?.pathParameters?.id, // The id of the author
      // sk: 'DETAILS#AD#', // The id of the note from the path
    },
  };

  console.log(params)

  // const result = await dynamoDb.send(new GetCommand(params));
  const result = await dynamoDb.send(new QueryCommand(params));

  console.log(result);

  // if (!result.Items) {
  //   throw new Error("Item not found.");
  // }

  // // Return the retrieved item
  return JSON.stringify(result.Items[0]);
});