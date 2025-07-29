/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  
  app(input) {
    return {
      name: "su-kunst",
      removal: input?.stage === "live" ? "retain" : "remove",
      protect: ["live"].includes(input?.stage),
      home: "aws",
    };
  },

  async run() {
    const storage = await import("./infra/storage");
    const auth    = await import("./infra/auth");
    const web     = await import("./infra/web");
    const api     = await import("./infra/api");

    return {
      Bucket: storage.bucket.name,
      UserPool: auth.userPool.id,
      Table: storage.table.name,
      Region: aws.getRegionOutput().name,
      IdentityPool: auth.identityPool.id,
      UserPoolClient: auth.userPoolClient.id,
    };
  },
});
 