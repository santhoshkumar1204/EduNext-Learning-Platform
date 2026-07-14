import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Node webcam-upload backend
      "/api/uploads": { target: "http://localhost:5000", changeOrigin: true },
      // Flask attention analyzer
      "/api/analyze": { target: "http://localhost:5001", changeOrigin: true },
    },
  },
});
