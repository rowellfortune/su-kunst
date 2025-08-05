import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from 'vite-plugin-pwa';
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
    VitePWA({
      registerType: 'prompt',           // controllable updates
      includeAssets: ['/*'],
      workbox: {
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: { cacheName: 'images', expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 } }
          },
        ]
      }
     }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
