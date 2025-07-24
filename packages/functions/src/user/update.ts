// src/functions/updateUserProfile.ts
import { RestUtil } from "@su-kunst/core/util";
import { Resource } from "sst";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  UpdateCommand,
  UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = RestUtil.restHandler(async (event) => {
  if (!event.body) throw new Error("Missing request body");
  const { userId, updates } = JSON.parse(event.body);

  if (!userId || typeof userId !== "string")
    throw new Error("`userId` must be a string");
  if (!updates || typeof updates !== "object")
    throw new Error("`updates` must be an object");

  // 1️⃣ define which keys live under `profile`
  const profileKeys = new Set<string>([
    "bio",
    "picture",
    "avatarFileattachment",
    "coverFileattachment",
    // add any other nested profile‑only keys here
  ]);

  // 2️⃣ build your SET clauses
  const setClauses: string[] = [];
  const names: Record<string, string> = {};
  const values: Record<string, any> = {};
  let idx = 0;

  for (const [field, val] of Object.entries(updates)) {
    const nameKey = `#n${idx}`;
    const valueKey = `:v${idx}`;
    names[nameKey] = field;
    values[valueKey] = val;

    if (profileKeys.has(field)) {
      // nested into the `profile` map
      setClauses.push(`profile.${nameKey} = ${valueKey}`);
    } else {
      // top‑level attribute
      setClauses.push(`${nameKey} = ${valueKey}`);
    }

    idx++;
  }

  // 3️⃣ always bump your updatedAt timestamp
  names["#updatedAt"] = "updatedAt";
  values[":updatedAt"] = Date.now();
  setClauses.push(`#updatedAt = :updatedAt`);

  const params: UpdateCommandInput = {
    TableName: Resource.SuKunst.name,
    Key: {
      pk: `USER#${userId}`,
      sk: "PROFILE",
    },
    UpdateExpression: "SET " + setClauses.join(", "),
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    ReturnValues: "ALL_NEW",
  };

  const { Attributes } = await ddb.send(new UpdateCommand(params));

  return JSON.stringify({ message: "Updated", updated: Attributes });
});
