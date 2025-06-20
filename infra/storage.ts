export const bucket = new sst.aws.Bucket("Bucket");

export const table = new sst.aws.Dynamo("SuKunst", {
  fields: {
    pk: "string",
    sk: "string",
    status: "string",
  },
  primaryIndex: { hashKey: "pk", rangeKey: "sk" },
  globalIndexes: {
    statusIndex: {
      hashKey: "sk", // "METADATA"
      rangeKey: "status",
    },
  },
});