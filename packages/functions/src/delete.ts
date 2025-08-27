import { Resource } from "sst";
import { RestUtil } from "@su-kunst/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  
  const full  = event?.requestContext?.authorizer?.iam?.cognitoIdentity?.amr[2];
  const userId = full.replace(/^.*:/, "");

  const params = {
    TableName: Resource.SuKunst.name,
    Key: {
      pk: userId, // The id of the author
      sk: event?.pathParameters?.id, // The id of the note from the path
    },
  };

  await dynamoDb.send(new DeleteCommand(params));

  return JSON.stringify({ status: true });
});