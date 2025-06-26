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

  console.log(data)

  params = {
    TableName: Resource?.SuKunst?.name,
    Item: {
      pk: `COMMENT#${uuid.v1()}`,
      sk: `DETAILS#${data.postId}`,
      content: data.content,
      entityType: "COMMENT", // 👈 Required for GSI
      user: data.user,
      // postedBy: event?.requestContext?.authorizer?.iam?.cognitoIdentity?.identityId,
      createdAt: Date.now(),
      // status: "published",
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