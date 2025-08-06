import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    // exclude a package from pre-bundling (it will be loaded as-is)
    exclude: ['zod'],
    // or force-include something that Vite might otherwise skip
    include: ['@hookform/resolvers/zod']
  },

  plugins: [
    react(), 
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
