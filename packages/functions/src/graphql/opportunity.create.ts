// functions/graphql/opportunity.create.ts
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"
import { v4 as uuid } from "uuid"
const client = new DynamoDBClient({});

export async function handler(event: any) {


  const item = {
    pk: { S: `OPP#${event.arguments.input.id || uuid()}` },
    sk: { S: "METADATA" },
    id: { S: event.arguments.id },
    title: { S: event.arguments.input.title },
    description: { S: event.arguments.input.description },
    deadline: { S: event.arguments.input.deadline },
    category: { S: event.arguments.input.category },
    location: { S: event.arguments.input.location ?? "" },
    status: { S: event.arguments.status }, // 👈 Store public | draft
    createdAt: { S: new Date().toISOString() },
  }

  const client = new DynamoDBClient({})
  await client.send(new PutItemCommand({ TableName: process.env.TABLE_NAME, Item: item }))

  return {
    id: item.pk.S.replace("OPP#", ""),
    ...event.arguments.input,
    createdAt: item.createdAt.S,
  }
}
