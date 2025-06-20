import { api } from "./api";
import { bucket } from "./storage";

const region = aws.getRegionOutput().name;

export const userPool = new sst.aws.CognitoUserPool("UserPool", {
  usernames: ["email"],
});

export const userPoolClient = userPool.addClient("UserPoolClient");

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
        ],
      },
      {
        actions: [
          "execute-api:*",
        ],
        resources: [
          $concat(
            "arn:aws:execute-api:",
            region,
            ":",
            aws.getCallerIdentityOutput({}).accountId,
            ":",
            api.nodes.api.id,
            "/*/*/*"
          ),
        ],
      },
    ],
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