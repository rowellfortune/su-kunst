import { Context, APIGatewayProxyEvent, AppSyncResolverEvent } from "aws-lambda";

export module RestUtil {
  export function restHandler(
    lambda: (event: APIGatewayProxyEvent, context: Context) => Promise<string>
  ) {
    return async function(event: APIGatewayProxyEvent, context: Context) {
      let body: string, statusCode: number;

      try {
        // Run the Lambda
        body = await lambda(event, context);
        statusCode = 200;
      } catch (error) {
        statusCode = 500;
        body = JSON.stringify({
          error: error instanceof Error ? error.message : String(error),
        });
      }

      // Return HTTP response
      return {
        body,
        statusCode,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Credentials": true,
        },
      };
    };
  }
}

export module GraphqlUtil {
  export function graphqlHandler<T>(
    lambda: (event: AppSyncResolverEvent<T>, context: Context) => Promise<any>
  ) {
    return async function (event: AppSyncResolverEvent<T>, context: Context) {
      try {
        const result = await lambda(event, context);

        return {
          __typename: "MutationResult", // Optional: match your GraphQL schema type
          success: true,
          data: result,
        };
      } catch (error) {
        console.error("GraphQL Resolver Error:", error);

        return {
          __typename: "MutationError", // Optional: to match GraphQL error types
          success: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    };
  }
}
