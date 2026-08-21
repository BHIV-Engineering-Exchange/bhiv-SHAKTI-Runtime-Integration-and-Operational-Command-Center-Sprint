import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Local Services Proxies
      "/api/control-plane-8003": {
        target: "http://127.0.0.1:8003",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/control-plane-8003/, ""),
      },
      "/api/control-plane-8009": {
        target: "http://127.0.0.1:8009",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/control-plane-8009/, ""),
      },
      "/api/sanskar": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/sanskar/, ""),
      },
      // Remote Services Proxies (to bypass browser CORS restrictions locally)
      "/api/bucket": {
        target: "https://bhiv-bucket-i1l6.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bucket/, ""),
      },
      "/api/prana": {
        target: "http://163.128.209.18:8103",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/prana/, ""),
      },
      "/api/niyantran": {
        target: "https://niyantran.blackholeinfiverse.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/niyantran/, ""),
      },
      "/api/insightflow": {
        target: "https://bhiv-svacs.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/insightflow/, ""),
      },
      "/api/tantra": {
        target: "https://tantra-gated-bridge-infrastructure.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tantra/, ""),
      },
      "/api/rajya": {
        target: "https://text-risk-scoring-service.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rajya/, ""),
      },
      "/api/karma": {
        target: "http://163.128.209.18:8102",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/karma/, ""),
      },
      "/api/keshav": {
        target: "https://keshav-cia7.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/keshav/, ""),
      },
    },
  },
});