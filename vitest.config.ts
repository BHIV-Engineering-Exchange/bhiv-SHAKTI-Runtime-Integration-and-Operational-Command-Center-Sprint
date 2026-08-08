import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    exclude: ["**/node_modules/**", "**/dist/**", "src/test/e2e/**", "**/vendor/**"],
    server: {
      deps: {
        inline: true
      }
    }
  },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      { find: "@bhiv/utils", replacement: path.resolve(__dirname, "./vendor/sdk/packages/utils/src/index.ts") },
      { find: "@bhiv/ui", replacement: path.resolve(__dirname, "./vendor/sdk/packages/ui/src/index.ts") },
      { find: "@bhiv/dashboard-sdk", replacement: path.resolve(__dirname, "./vendor/sdk/packages/dashboard-sdk/src/index.ts") },
      { find: "@bhiv/dashboard-layout", replacement: path.resolve(__dirname, "./vendor/sdk/packages/dashboard-layout/src/index.ts") },
      { find: "react-dom", replacement: path.resolve(__dirname, "./node_modules/react-dom") },
      { find: "react", replacement: path.resolve(__dirname, "./node_modules/react") },
    ],
  },
});
