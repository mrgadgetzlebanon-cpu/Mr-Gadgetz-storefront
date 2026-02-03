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
  },

  server: {
    host: true,
    port: 5173,
  },
});
