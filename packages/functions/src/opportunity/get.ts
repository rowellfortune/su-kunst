import { Resource } from "sst";
import { RestUtil, GraphqlUtil } from "@su-kunst/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = RestUtil.restHandler(async (event) => {

  const params = {
    TableName: Resource.SuKunst.name,
    // 'Key' defines the partition key and sort key of
    // the item to be retrieved
    Key: {
      pk: `OPPORTUNITY-${event.pathParameters!.id!}`, // The id of the author
      sk: 'DETAILS#OPPORTUNITY', // The id of the note from the path
    },
  };

  const result = await dynamoDb.send(new GetCommand(params));
  if (!result.Item) {
    throw new Error("Item not found.");
  }

  // Return the retrieved item
  return JSON.stringify(result.Item);
});