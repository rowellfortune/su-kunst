import * as uuid from "uuid";
import { Resource } from "sst";
import { RestUtil, GraphqlUtil } from "@su-kunst/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = RestUtil.restHandler(async (event) => {
  let data, params;

  if (event.body != null) {
    data = JSON.parse(event.body);
  }

  const podId = `POST-${uuid.v1()}`

  params = {
    TableName: Resource?.SuKunst?.name,
    Item: {
      pk: podId,
      sk: `DETAILS#${podId}`,
      title: data?.title,
      content: data?.content,
      entityType: "POST", // 👈 Required for GSI
      attachment: data?.attachment,
      author: data?.author,
      postedBy: data.userId,
      createdAt: Date.now(),
      status: "published",
    }
  };

  await dynamoDb.send(new PutCommand(params));
  return createPost(params);
});

export const createPost = async (params: any) => {
  await dynamoDb.send(new PutCommand(params));
  return JSON.stringify(params.Item);
};

export const graphqlResolver = GraphqlUtil.graphqlHandler(async (event) => {
  console.log(event)
  return createPost(event.arguments);
});