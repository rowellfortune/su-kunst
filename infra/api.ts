import { bucket } from "./storage";
import { table } from "./storage";

// Create the API
export const api = new sst.aws.ApiGatewayV2("Api", {
  transform: {
    route: {
      handler: {
        link: [table, bucket],
      },
      args: {
        auth: { iam: true }
      },
    }
  }
});

/// Opportunityies
api.route("POST /notes", "packages/functions/src/opportunity/create.main");
api.route("GET /notes", "packages/functions/src/opportunity/list.main");

// Posts
api.route("GET /notes/{id}", "packages/functions/src/get.main");
api.route("PUT /notes/{id}", "packages/functions/src/update.main");
api.route("DELETE /notes/{id}", "packages/functions/src/delete.main");

// Chat

// export const myApi = new sst.aws.Function("MyApi", {
//   url: true,
//   link: [bucket],
//   handler: "packages/functions/src/api.handler"
// });

// export const api = new sst.aws.AppSync("Api", {
//   schema: "graphql/schema.graphql",
// });

// const lambdaDS = api.addDataSource({
//   name: "lambdaDS",
//   lambda: "../packages/functions/src/graphql/handler.main",
// });

//  // 🎯 Queries
//   api.addResolver("Query getUser",          { dataSource: lambdaDS.name })
//   api.addResolver("Query getOpportunity",   { dataSource: lambdaDS.name })
//   api.addResolver("Query listOpportunities",{ dataSource: lambdaDS.name })
//   api.addResolver("Query listApplicationsByUser", { dataSource: lambdaDS.name })
//   api.addResolver("Query listChatsByUser",  { dataSource: lambdaDS.name })
//   api.addResolver("Query listMessages",     { dataSource: lambdaDS.name })

//   // ✏️ Mutations
//   api.addResolver("Mutation createUser",           { dataSource: lambdaDS.name })
//   api.addResolver("Mutation createOpportunity",    { dataSource: lambdaDS.name })
//   api.addResolver("Mutation applyToOpportunity",   { dataSource: lambdaDS.name })
//   api.addResolver("Mutation sendMessage",          { dataSource: lambdaDS.name })
//   api.addResolver("Mutation createChat",           { dataSource: lambdaDS.name })

