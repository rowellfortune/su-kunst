import * as uuid from "uuid";
import { Resource } from "sst";
import { RestUtil, GraphqlUtil } from "@su-kunst/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = RestUtil.restHandler(async (event) => {
  let data, commentParams;

  if (event.body != null) {
    data = JSON.parse(event.body);
  }

  const commentId = uuid.v1();

  commentParams = {
    TableName: Resource?.SuKunst?.name,
    Item: {
      pk: `COMMENT#${commentId}`,
      sk: `DETAILS#${data.postId}`,
      content: data.content,
      entityType: "COMMENT",
      user: data.user,
      createdAt: Date.now(),
    },
  };

  await dynamoDb.send(new PutCommand(commentParams));

  // Fetch the post to find the owner
  const post = await dynamoDb.send(
    new GetCommand({
      TableName: Resource?.SuKunst?.name,
      Key: {
        pk: data.postId,
        sk: `DETAILS#${data.postId}`,
      },
    })
  );

  const postOwnerId = post.Item?.postedBy;
  const commentAuthorId = data.user;

  if (postOwnerId && postOwnerId !== commentAuthorId) {

    const notification = {
      pk: `USER#${postOwnerId}`,
      sk: `NOTIFICATION#${uuid.v4()}`,
      entityType: "NOTIFICATION",
      message: `${commentAuthorId} commented on your post`,
      postId: data.postId,
      read: false,
      createdAt: Date.now(),
    };

    console.log(notification)

    await dynamoDb.send(new PutCommand({
      TableName: Resource?.SuKunst?.name,
      Item: notification,
    }));
  }

  return createComment(commentParams);
});

export const createComment = async (params: any) => {
  await dynamoDb.send(new PutCommand(params));
  return JSON.stringify(params.Item);
};

export const graphqlResolver = GraphqlUtil.graphqlHandler(async (event) => {
  return createComment(event.arguments);
});