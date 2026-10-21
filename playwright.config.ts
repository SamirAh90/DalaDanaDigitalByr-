import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    channel: "msedge",
    headless: true,
    trace: "retain-on-failure",
  },
  projects: [360, 390, 768, 1440].map((width) => ({
    name: `${width}px`,
    use: { viewport: { width, height: 900 } },
  })),
  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false,
    timeout: 30000,
    env: {
      HOST: "127.0.0.1",
      PORT: "3000",
      RESEND_API_KEY: "",
      ENQUIRY_FROM_EMAIL: "",
      ENQUIRY_TO_EMAIL: "",
    },
  },
});
