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
      // Control Plane Proxy
      "/api/control-plane": {
        target: "http://163.128.209.18:8120",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/control-plane/, ""),
      },
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
        target: "http://163.128.209.18:8018",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/sanskar/, ""),
      },
      // Remote Services Proxies (to bypass browser CORS & Mixed Content restrictions)
      "/api/bucket": {
        target: "http://163.128.209.18:8012",
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
        target: "http://163.128.209.18:8122",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/insightflow/, ""),
      },
      "/api/tantra": {
        target: "http://163.128.209.18:3009",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tantra/, ""),
      },
      "/api/rajya": {
        target: "http://163.128.209.18:8015",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rajya/, ""),
      },
      "/api/karma": {
        target: "http://163.128.209.18:8102",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/karma/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            if (req.method === "GET") {
              const url = req.url || "";
              if (url.includes("/intelligence/confidence") && !proxyReq.getHeader("content-length")) {
                const bodyData = JSON.stringify({
                  dharma: 0.85,
                  artha: 0.75,
                  kama: 0.65,
                  moksha: 0.95,
                });
                proxyReq.setHeader("Content-Type", "application/json");
                proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
              } else if (url.includes("/intelligence/reasoning") && !proxyReq.getHeader("content-length")) {
                const bodyData = JSON.stringify({
                  purushartha_alignment: {
                    dharma: 0.85,
                    artha: 0.75,
                    kama: 0.65,
                    moksha: 0.95,
                  },
                  recommended_signals: ["STABILITY", "ETHICAL_ALIGNMENT"],
                });
                proxyReq.setHeader("Content-Type", "application/json");
                proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
              }
            }
          });
        },
      },
      "/api/keshav": {
        target: "http://163.128.209.18:5003",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/keshav/, ""),
      },
      "/api/setu": {
        target: "http://163.128.209.18:8014",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/setu/, ""),
      },
    },
  },
});