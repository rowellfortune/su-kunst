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

    const body = JSON.parse(event.body || "{}");
    const id = uuid.v4();

    params = {
        TableName: Resource?.SuKunst?.name,
        Item: {
            pk: `event-${id}`,
            sk: `DETAILS#event-${id}`,
            imageSrc: body.imageSrc,
            datetime: body.datetime,
            title: body.title,
            location: body.location,
            entityType: "EVENT", // 👈 Required for GSI
            date: body.date,
            month: body.month,
            attendees: body.attendees || [],
            extraCount: body.extraCount,
            createdAt: new Date().toISOString(),
        }
    }

    await dynamoDb.send(new PutCommand(params));

    return createEvent(params);
});

// service.ts
export const createEvent = async (params: any) => {
    console.log(params)
    
    // Dynamo put logic here
    await dynamoDb.send(new PutCommand(params));

    return JSON.stringify(params.Item);
};

// Future GraphQL resolver
export const graphqlResolver = GraphqlUtil.graphqlHandler(async (event) => {
  console.log(event)
  return createEvent(event.arguments);
});