import { CognitoUserPoolTriggerEvent } from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";

const cognito = new CognitoIdentityServiceProvider();
const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function main(event: AWSLambda.PostConfirmationTriggerEvent): Promise<AWSLambda.PostConfirmationTriggerEvent> {
  let data;
  
  if (event?.body != null) {
    data = JSON.parse(event?.body);
  }
  
  const userId = event.request.userAttributes.sub;
  const email = event.request.userAttributes.email;
  const username = event.userName;
  const groupName = determineUserGroup(event);

  const params = {
    TableName: Resource?.SuKunst?.name,
    Item: {
      pk: `USER#${userId}`,
      sk: "PROFILE",
      entityType: "USER",
      createdAt: Date.now(),
      username,
      email,
      profile: {
        username,
        email,
        bio:      `More about ${username}`,
      },
      role: groupName, // default role
    },
  };

  await dynamoDb.send(new PutCommand(params));

  try {
    await cognito
      .adminAddUserToGroup({
        GroupName: groupName,
        UserPoolId: event.userPoolId,
        Username: username,
      })
      .promise();

    console.log(`User ${username} added to group ${groupName}`);
  } catch (error) {
    console.error(`Error adding user ${username} to group ${groupName}:`, error);
  }

  return event;
};

// Function to determine user group (replace with your own logic)
function determineUserGroup(event: AWSLambda.PostConfirmationTriggerEvent): string {
  // Example: Assign based on user attributes
  if (event.request.userAttributes["custom:role"] === "admin") return "admin";
  if (event.request.userAttributes["custom:role"] === "viewer") return "viewer";
  if (event.request.userAttributes["custom:role"] === "artisan") return "artisan";
  return "artisan"; // Default group
}
