import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    env: {
      API_URL: "http://localhost:8000",
    },
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});
