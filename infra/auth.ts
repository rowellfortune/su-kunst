import { api } from "./api";
import { bucket, table } from "./storage";
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// Get region + account ID
const region = aws.getRegionOutput().name;
const accountId = aws.getCallerIdentityOutput({}).accountId;

export const postConfirmationLambda = new sst.aws.Function("PostConfirmationLambda", {
  handler: "packages/functions/src/user/postConfirmation.main",
  link: [table],
});

// ✅ 1. Cognito User Pool with aliases
export const userPool = new aws.cognito.UserPool("UserPool", {
  aliasAttributes: ["email", "preferred_username"],
  autoVerifiedAttributes: ["email"],
  schemas: [
    { name: "email", required: true, attributeDataType: "String" },
    { name: "preferred_username", required: false, attributeDataType: "String" },
  ],
  lambdaConfig: {
    postConfirmation: postConfirmationLambda.arn,
  },
});

new aws.lambda.Permission("AllowCognitoInvokePostConfirmation", {
  action: "lambda:InvokeFunction",
  function: postConfirmationLambda.arn, // use `.functionName` from sst.aws.Function
  principal: "cognito-idp.amazonaws.com",
  sourceArn: userPool.arn,
});

// ✅ 2. Cognito User Pool Client
export const userPoolClient = new aws.cognito.UserPoolClient("UserPoolClient", {
  userPoolId: userPool.id,
  generateSecret: false,
  explicitAuthFlows: [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
  ],
});

// ✅ 3. Identity Pool via SST
export const identityPool = new sst.aws.CognitoIdentityPool("IdentityPool", {
  userPools: [
    {
      userPool: userPool.id,
      client: userPoolClient.id,
    },
  ],
  permissions: {
    authenticated: [
      {
        actions: ["s3:*"],
        resources: [
          $concat(bucket.arn, "/private/${cognito-identity.amazonaws.com:sub}/*"),
          $concat(bucket.arn, "/public/posts/*")
        ],
      },
      {
        actions: ["execute-api:*"],
        resources: [
          $concat(
            "arn:aws:execute-api:",
            region,
            ":",
            accountId,
            ":",
            api.nodes.api.id,
            "/*/*/*"
          ),
        ],
      },
    ],
  },
});

// ✅ 4. Post-confirmation trigger Lambda

// ✅ 5. (Optional) You can assign this function to the pool via trigger **manually** in the AWS console or via the SDK.
// Pulumi does not directly support attaching triggers to user pools cleanly unless you use raw AWS Lambda ARNs.
// Add Cognito User Pool permissions
new aws.iam.RolePolicy("CognitoUserPoolAccess", {
  // role: 'su-kunst-dev-PostConfirmationLambdaRole-muktrnwz',
  role: 'su-kunst-demo-PostConfirmationLambdaRole-vahutxfa',
  policy: {
    Version: "2012-10-17",
    Statement: [{
      Effect: "Allow",
      Action: ["cognito-idp:AdminAddUserToGroup"],
      Resource: pulumi.interpolate`arn:aws:cognito-idp:${region}:${aws.getCallerIdentityOutput({}).accountId}:userpool/${userPool.id}`,
    }],
  },
});

// Define the groups
const groups = [
  {
    name: "admin",
    description: "Administrators of the application",
    precedence: 1,
  },
  {
    name: "artisan",
    description: "artisan",
    precedence: 2,
  },
  {
    name: "viewer",
    description: "Viewers with read-only access",
    precedence: 3,
  },
];

// Create the groups in the Cognito User Pool
export const userGroups = groups.map((group) =>
  new aws.cognito.UserGroup(group.name, {
    userPoolId: userPool.id,
    name: group.name,
    description: group.description,
    precedence: group.precedence,
  })
);