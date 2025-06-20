import { bucket } from "./storage";

// export const myApi = new sst.aws.Function("MyApi", {
//   url: true,
//   link: [bucket],
//   handler: "packages/functions/src/api.handler"
// });

export const api = new sst.aws.AppSync("Api", {
  schema: "graphql/schema.graphql",
});

const lambdaDS = api.addDataSource({
  name: "lambdaDS",
  lambda: "../packages/functions/src/graphql/opportunity.create.handler",
});

 // 🎯 Queries
  api.addResolver("Query getUser",          { dataSource: lambdaDS.name })
  api.addResolver("Query getOpportunity",   { dataSource: lambdaDS.name })
  api.addResolver("Query listOpportunities",{ dataSource: lambdaDS.name })
  api.addResolver("Query listApplicationsByUser", { dataSource: lambdaDS.name })
  api.addResolver("Query listChatsByUser",  { dataSource: lambdaDS.name })
  api.addResolver("Query listMessages",     { dataSource: lambdaDS.name })

  // ✏️ Mutations
  api.addResolver("Mutation createUser",           { dataSource: lambdaDS.name })
  api.addResolver("Mutation createOpportunity",    { dataSource: lambdaDS.name })
  api.addResolver("Mutation applyToOpportunity",   { dataSource: lambdaDS.name })
  api.addResolver("Mutation sendMessage",          { dataSource: lambdaDS.name })
  api.addResolver("Mutation createChat",           { dataSource: lambdaDS.name })