

export async function main(event: any) {
  console.log(event)
  switch (`${event.info.parentTypeName}.${event.info.fieldName}`) {
    case "Query.getopportunity":
      return await import("./graphql/opportunity.get").then(m => m.handler(event));
    case "Mutation.createOpportunity":
      return await import("./graphql/opportunity.create").then(m => m.handler(event));
    default:
      throw new Error("Resolver not implemented");
  }
}
