import * as uuid from "uuid";
import { Resource } from "sst";
import { RestUtil, GraphqlUtil } from "@su-kunst/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { PiKanban } from "react-icons/pi";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = RestUtil.restHandler(async (event) => {
  
  let data, params;
  if (event.body != null) {
    data = JSON.parse(event.body);
  }
  // const { postId, userId } = JSON.parse(event.body);
  const PK = `POST#${data.postId}`;
  const SK = `LIKE#${data.userId}`;

  // Check if already liked
  const existing = await dynamoDb.send(
    new GetCommand({
      TableName: Resource?.SuKunst?.name,
      Key: { PK, SK },
    })
  );

  if (existing.Item) {
    // Unlike (remove like)
    await dynamoDb.send(
      new DeleteCommand({
        TableName: process.env.TABLE_NAME,
        Key: { PK, SK },
      })
    );
    
    return JSON.stringify({ liked: false });
  } else {

    params = {
      TableName: Resource?.SuKunst?.name,
      Item: {
        PK,
        SK,
        entityType: "LIKE",
        userId: data.userId,
        postId: data.postId,
        createdAt: Date.now(),
      },
    };

    // await dynamoDb.send(new PutCommand(params));

    return createOpenCall(params);
  }
});

// service.ts
export const createOpenCall = async (params: any) => {
  // Dynamo put logic here
  await dynamoDb.send(new PutCommand(params));

  return JSON.stringify({ liked: true });
};


// Future GraphQL resolver
export const graphqlResolver = GraphqlUtil.graphqlHandler(async (event) => {
  console.log(event)
  return createOpenCall(event.arguments);
});
