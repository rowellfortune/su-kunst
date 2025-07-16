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
  const startDate = data.startDate;
  const endDate   = data.endDate;

  if (isNaN(startDate) || isNaN(endDate) || endDate <= startDate) {
    throw new Error("Invalid startDate/endDate");
  }

  params = {
    TableName: Resource?.SuKunst?.name,
    Item: {
      pk: `AD-${uuid.v1()}`,
      sk: `DETAILS#AD#${data.company}`,
      title: data.title,
      content: data.content,
      company: data.company,
      link: data.link,
      entityType: "AD", // 👈 Required for GSI
      attachment: data.attachment,
      postedBy: event?.requestContext?.authorizer?.iam?.cognitoIdentity?.identityId,
      createdAt: Date.now(),
      status: "published",
      startDate: startDate,          // new: e.g. Date.parse("2025-07-20T00:00:00Z")
      endDate: endDate,              // new: e.g. Date.parse("2025-08-20T23:59:59Z")
    }
  };

  // console.log(params)

  // await dynamoDb.send(new PutCommand(params));
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