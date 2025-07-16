import { APIGatewayProxyEvent, Context } from "aws-lambda";
import {
  DynamoDBClient
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import { GraphqlUtil, RestUtil } from "@su-kunst/core/util";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = RestUtil.restHandler(async (event) => {
  let data, params;
  if (event.body != null) {
    data = JSON.parse(event.body);
  }

  const userId = event.requestContext.authorizer?.iam.cognitoIdentity.identityId!;
  const postId = event.pathParameters!.postId!;
  const pk = postId;
  const sk = `LIKE#${userId}`;
  
  params = {
    TableName: Resource.SuKunst.name,
    Key: { pk, sk}
  }

  // 1️⃣ See if reaction exists
  const { Item } = await dynamoDb.send(new GetCommand(params));

  // 2️⃣ Either delete or put
  if (Item) {
    // unlike
    await dynamoDb.send(new DeleteCommand({ TableName: Resource.SuKunst.name, Key: { pk, sk } }));
  } else {
    // like
    await dynamoDb.send(new PutCommand({
      TableName: Resource.SuKunst.name,
      Item: { pk, sk, entityType: "LIKE", userId, createdAt: Date.now() }
    }));
  }
  
  // 3️⃣ Re‑count likes for this post
  const { Count = 0 } = await dynamoDb.send(new QueryCommand({
    TableName: Resource.SuKunst.name,
    KeyConditionExpression: "pk = :pk AND begins_with(sk, :r)",
    ExpressionAttributeValues: {
      ":pk": pk,
      ":r": "LIKE#"
    }
  }));

  return JSON.stringify({       
    liked: !Item,
    count: Count 
  });

});

// service.ts
export const createOpenCall = async (params: any) => {

  console.log(params);
  // Dynamo put logic here
  await dynamoDb.send(new PutCommand(params));

  return JSON.stringify({ liked: true });
};

// Future GraphQL resolver
export const graphqlResolver = GraphqlUtil.graphqlHandler(async (event) => {
  // console.log(event)
  return createOpenCall(event.arguments);
});
