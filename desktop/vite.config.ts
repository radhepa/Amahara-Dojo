import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = fileURLToPath(new URL("../", import.meta.url));
export default defineConfig({
  root: path.join(sourceRoot, "desktop/renderer"),
  publicDir: path.join(sourceRoot, "public"),
  plugins: [
    {name: "dojo-local-store", enforce: "pre", resolveId(id, importer) {
      if (id === "./store" && importer?.replaceAll("\\", "/").endsWith("/lib/game-store.ts")) return path.join(sourceRoot, "desktop/store.ts");
    }},
    react(),
  ],
  resolve: {alias: {
    "@/app/chatgpt-auth": path.join(sourceRoot, "desktop/auth.ts"),
    "@/lib/store": path.join(sourceRoot, "desktop/store.ts"),
    "@": sourceRoot,
  }},
  server: {host: "127.0.0.1", fs: {allow: [sourceRoot]}, watch: {ignored: ["**/desktop/release/**", "**/desktop/bundle/**"]}},
  build: {outDir: path.join(sourceRoot, "desktop/bundle/renderer"), emptyOutDir: true, license: true},
});
