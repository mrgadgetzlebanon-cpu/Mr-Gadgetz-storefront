import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  // 1. Tell Vite the "Root" of your app is the 'client' folder
  root: path.resolve(__dirname, "client"),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },

  build: {
    // 2. Tell Vite to step OUT of 'client' and put the final build in 'dist' at the project root
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,

    // 3. NEW: Aggressive Code Splitting (SEO Performance Fix)
    chunkSizeWarningLimit: 800, // Raises the warning limit slightly
    rollupOptions: {
      output: {
        manualChunks: {
          // Chunk 1: Core React & Routing (Rarely changes, highly cacheable)
          "vendor-react": ["react", "react-dom", "wouter"],

          // Chunk 2: Heavy UI Libraries (Isolates the carousel math from the main thread)
          "vendor-carousel": [
            "embla-carousel-react",
            "embla-carousel-autoplay",
            "embla-carousel",
          ],

          // Chunk 3: Icons (Lucide contains hundreds of SVGs, keep them separate)
          "vendor-icons": ["lucide-react"],

          // Chunk 4: Styling Utilities (Tailwind/shadcn helpers)
          "vendor-utils": ["clsx", "tailwind-merge"],
        },
      },
    },
  },

  server: {
    host: true,
    port: 5173,
  },
});
