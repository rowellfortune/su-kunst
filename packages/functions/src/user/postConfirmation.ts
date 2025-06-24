import { CognitoUserPoolTriggerEvent } from "aws-lambda";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function main(event: AWSLambda.PostConfirmationTriggerEvent): Promise<AWSLambda.PostConfirmationTriggerEvent> {
  
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
      email,
      role: groupName, // default role
    },
  };

  await dynamoDb.send(new PutCommand(params));

  return event;
};

// Function to determine user group (replace with your own logic)
// function determineUserGroup(event: AWSLambda.PostConfirmationTriggerEvent): string {
//   // Example: Assign based on user attributes
//   if (event.request.userAttributes["custom:role"] === "admin") return "admin";
//   return "artisan"; // Default group
// }

// Function to determine user group based on custom:userRole attribute in Cognito
function determineUserGroup(event: AWSLambda.PostConfirmationTriggerEvent): string {
  const userRole = event.request.userAttributes["custom:role"]; // Assuming you store role here

  switch (userRole) {
    case "admin":
      return "admin";
    case "artisan":
      return "artisan";
    case "viewer":
      return "viewer";
    default:
      return "viewer"; // fallback/default group
  }
}
