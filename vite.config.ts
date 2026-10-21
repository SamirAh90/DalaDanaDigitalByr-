import { defineConfig, loadEnv } from "vite";
import netlify from "@netlify/vite-plugin-tanstack-start";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "PUBLIC_");
  const isNetlify = process.env["NETLIFY"] === "true";
  return {
    server: { host: "127.0.0.1", port: 3000 },
    preview: { host: "127.0.0.1", port: 3000 },
    resolve: { dedupe: ["react", "react-dom", "@tanstack/react-router"] },
    // Only this public origin is compiled into the client. Never inject all process.env.
    define: {
      "import.meta.env.PUBLIC_SITE_URL": JSON.stringify(env["PUBLIC_SITE_URL"] ?? ""),
    },
    plugins: [
      tsconfigPaths(),
      tanstackStart({
        server: { entry: "server" },
        // Current Router compiler doesn't escape apostrophes in generated imports.
        // Normal checkouts keep route splitting; this user's existing Windows path works too.
        router: {
          ...(process.cwd().includes("'") ? { codeSplittingOptions: { defaultBehavior: [] } } : {}),
        },
      }),
      ...(isNetlify
        ? netlify()
        : [nitro({ preset: "node-server", compressPublicAssets: { gzip: true, brotli: true } })]),
      react(),
      tailwindcss(),
    ],
  };
});
