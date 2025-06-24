// Create an S3 bucket
export const bucket = new sst.aws.Bucket("Uploads");

// export const table = new sst.aws.Dynamo("SuKunst", {
//   fields: {
//     pk: "string",
//     sk: "string",
//     status: "string",
//   },
//   primaryIndex: { hashKey: "pk", rangeKey: "sk" },
//   globalIndexes: {
//     statusIndex: {
//       hashKey: "sk", // "METADATA"
//       rangeKey: "status",
//     },
//   },
// });

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

