// Create an S3 bucket
export const bucket = new sst.aws.Bucket("Uploads", {
  access: "public",
  cors: {
    allowOrigins: ["*"],         // optional, good for browser uploads/downloads
  },
  transform: {
    publicAccessBlock: {
      blockPublicPolicy: false,
      restrictPublicBuckets: false,
    },
  },
});

export const table = new sst.aws.Dynamo("SuKunst", {
  fields: {
    pk: "string",
    sk: "string",
    entityType: "string",
    createdAt: "number",     // 👈 ADD THIS
    status: "string",
  },
  primaryIndex: { hashKey: "pk", rangeKey: "sk" },
  globalIndexes: {
    entityTypeIndex: { 
      hashKey: "entityType",
      rangeKey: "createdAt", // Now valid
    },
    statusIndex: { 
      hashKey: "sk",
      rangeKey: "status",
    },
  },
});