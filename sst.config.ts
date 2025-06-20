/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "su-kunst",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const storage = await import("./infra/storage");
    const auth = await import("./infra/auth");
    await import("./infra/web");
    await import("./infra/api");

    return {
      Bucket: storage.bucket.name,
      UserPoolId: auth.userPool.id,
      UserPoolClientId: auth.userPoolClient.id,
      IdentityPoolId: auth.identityPool.id,
      // Region: stack.region,

    };
  },
});
