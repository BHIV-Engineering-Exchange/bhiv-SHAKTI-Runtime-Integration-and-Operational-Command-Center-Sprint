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
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@bhiv/utils": path.resolve(__dirname, "./vendor/sdk/packages/utils/src/index.ts"),
      "@bhiv/ui": path.resolve(__dirname, "./vendor/sdk/packages/ui/src/index.ts"),
      "@bhiv/dashboard-sdk": path.resolve(__dirname, "./vendor/sdk/packages/dashboard-sdk/src/index.ts"),
      "@bhiv/dashboard-layout": path.resolve(__dirname, "./vendor/sdk/packages/dashboard-layout/src/index.ts"),
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
  },
});