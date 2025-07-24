
// Create an S3 bucket
export const bucket = new sst.aws.Bucket("Uploads", {
  access: "public", // or “cloudfront” / remove for private
  cors: {
    // which origins can talk to this bucket
    allowOrigins: [
      "http://localhost:5173",
      "https://d2tfuxwmx5jemo.cloudfront.net",
    ],
    // which HTTP methods are allowed
    allowMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
    // which headers the browser can send
    allowHeaders: ["*"],
    // which response headers the browser can read
    exposeHeaders: ["ETag", "Date"],
    // how long to cache the preflight (you can pass a string or Duration)
    maxAge: `${3000} days`,
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