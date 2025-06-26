// Create an S3 bucket
import * as awsSdk from "@pulumi/aws";

export const bucket = new sst.aws.Bucket("Uploads", {
  transform: {
    publicAccessBlock: {
      blockPublicPolicy: false,
      restrictPublicBuckets: false,
    },
  },
});

// export const bucketPolicy = new awsSdk.s3.BucketPolicy("UploadsPolicy", {
//   bucket: bucket.name,
//   policy: bucket.name.apply(name =>
//     JSON.stringify({
//       Version: "2012-10-17",
//       Statement: [
//         {
//           Sid: "AllowPublicReadForPublicFolder",
//           Effect: "Allow",
//           Principal: "*",
//           Action: ["s3:GetObject"],
//           Resource: `arn:aws:s3:::${name}/public/*`,
//         },
//       ],
//     })
//   ),
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

