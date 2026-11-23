import { defineConfig } from "vitest/config";

// Node environment only: the suite covers the shared contact rules and the
// serverless handler, not the React components.
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.js"],
  },
});
