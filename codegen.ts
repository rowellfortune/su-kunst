// codegen.ts
import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  schema: "./graphql/schema.graphql", // ✅ your file
  documents: ["./packages/frontend/src/**/*.{ts,tsx}"], // adjust if needed
  generates: {
    "./graphql/": {
      preset: "client",
      plugins: [],
    },
  },
}
export default config
