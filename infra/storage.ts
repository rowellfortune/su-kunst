
// Create an S3 bucket
export const bucket = new sst.aws.Bucket("Uploads", {
  access: "public",
  cors: {
    allowOrigins: [
      "https://su-kunst.com",                       // ✅ Custom domain
      "https://www.su-kunst.com",                   // ✅ Optional
      "https://d1el6r5smmgu9n.cloudfront.net",      // ✅ Default CloudFront
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
    policy:{},
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