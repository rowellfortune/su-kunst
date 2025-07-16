import { Resource } from "sst";
import { RestUtil, GraphqlUtil } from "@su-kunst/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = RestUtil.restHandler(async (event) => {
  const data = JSON.parse(event.body || "{}");

  console.log(data);
  console.log(event.pathParameters);

  const params = {
    TableName: Resource.SuKunst.name,
    Key: {
      // The attributes of the item to be created
      pk: event?.pathParameters?.id, // The id of the author
      sk: `DETAILS#${event?.pathParameters?.id}`, // The id of the note from the path
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET content = :content, title = :title, attachment = :attachment",
    ExpressionAttributeValues: {
      ":title": data.title || null,
      ":attachment": data.attachment || null,
      ":content": data.content || null,
    },
  };

  await dynamoDb.send(new UpdateCommand(params));

  return JSON.stringify({ status: true });
});