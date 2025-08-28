import { bucket } from "./storage";
import { table } from "./storage";

// Create the API
export const api = new sst.aws.ApiGatewayV2("Api", {
  cors: true,
  domain: $app.stage === "live" 
  ? 
    {
      name: "api.su-kunst.net",
      dns: sst.aws.dns({ override: true }),
    } 
  : undefined,
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
api.route("POST /opportunities", "packages/functions/src/opportunity/create.main");
api.route("GET /opportunities", "packages/functions/src/opportunity/list.main");
api.route("GET /opportunities/{id}", "packages/functions/src/opportunity/get.main");
api.route("PUT /opportunities/{id}", "packages/functions/src/opportunity/update.main");
api.route("DELETE /opportunities/{id}", "packages/functions/src/opportunity/delete.main");

// Events
  api.route("POST /events", "packages/functions/src/events/create.main");
  api.route("GET /events", "packages/functions/src/events/list.main");
  api.route("GET /events/{id}", "packages/functions/src/events/get.main");
  api.route("PUT /events/{id}", "packages/functions/src/events/update.main");
  api.route("DELETE /events/{id}", "packages/functions/src/events/delete.main");

// Posts
api.route("POST /posts", "packages/functions/src/post/create.main");
api.route("GET /posts", "packages/functions/src/post/list.main");
api.route("GET /posts/{id}", "packages/functions/src/post/get.main");
api.route("PUT /posts/{id}", "packages/functions/src/post/update.main");
api.route("DELETE /posts/{id}", "packages/functions/src/post/delete.main");

api.route("GET /notifications", "packages/functions/src/post/notification/getNotifications.main");
api.route("PUT /notifications/{id}/read", "packages/functions/src/post/notification/read.main");


//comment
  api.route("POST /comments", "packages/functions/src/post/comment/create.main");
  api.route("GET /comments", "packages/functions/src/post/comment/list.main");
  api.route("PUT /comments/{id}", "packages/functions/src/post/comment/update.main");
  api.route("DELETE /comments/{id}", "packages/functions/src/post/comment/delete.main");

// Like
  api.route("POST /reactions/{postId}/likes", "packages/functions/src/post/like/toggleLike.main");
  api.route("GET /reactions/{postId}/likes", "packages/functions/src/post/like/getLike.main");

// Ads
  api.route("POST /ads", "packages/functions/src/ads/create.main");
  api.route("GET /ads", "packages/functions/src/ads/list.main");
  api.route("GET /ads/{id}", "packages/functions/src/ads/get.main");

  api.route("GET /users/{id}", "packages/functions/src/user/get.main");
  api.route("GET /users", "packages/functions/src/user/list.main");
  api.route("POST /users/{id}", "packages/functions/src/user/update.main");
api.route("POST /users/{targetId}/follow/toggle", "packages/functions/src/user/follow/toggle.main")

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