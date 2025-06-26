import * as uuid from "uuid";
import { Resource } from "sst";
import { RestUtil, GraphqlUtil } from "@su-kunst/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { PiKanban } from "react-icons/pi";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = RestUtil.restHandler(async (event) => {
  let data, params;
  if (event.body != null) {
    data = JSON.parse(event.body);
  }

  params = {
    TableName: Resource?.SuKunst?.name,
    Item: {
      pk: `OPPORTUNITY#${uuid.v1()}`,
      sk: "DETAILS",
      title: data.title,
      description: data.description,
      entityType: "OPPORTUNITY", // 👈 Required for GSI
      type: data.type,
      attachment: data.attachment,
      postedBy: event?.requestContext?.authorizer?.iam?.cognitoIdentity?.identityId,
      createdAt: Date.now(),
      status: "active",
    },
  };

  console.log(params)

  await dynamoDb.send(new PutCommand(params));

  return createOpenCall(params);

});

// service.ts
export const createOpenCall = async (params: any) => {
  console.log(params)
  // Dynamo put logic here
   await dynamoDb.send(new PutCommand(params));

   return JSON.stringify(params.Item);
};


// Future GraphQL resolver
export const graphqlResolver = GraphqlUtil.graphqlHandler(async (event) => {
  console.log(event)
  return createOpenCall(event.arguments);
});
