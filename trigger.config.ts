import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "proj_aigkijfawjvmkyittuek",
  runtime: "node",
  dirs: ["./src/trigger"],
  maxDuration: 300, // 5 minutes max per run
});
