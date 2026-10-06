import { app } from "electron";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
let sourceRoot = process.env.DOJO_SOURCE_ROOT;
if (!app.isPackaged) sourceRoot ??= path.resolve(here, "..");
const config = path.join(process.resourcesPath, "source.json");
if (!sourceRoot && existsSync(config)) sourceRoot = JSON.parse(readFileSync(config, "utf8")).sourceRoot;
if (process.argv.includes("--offline")) sourceRoot = undefined;
if (sourceRoot && existsSync(path.join(sourceRoot, "desktop/main.mjs")) && existsSync(path.join(sourceRoot, "node_modules/vite/dist/node/index.js"))) {
  process.env.DOJO_SOURCE_ROOT = sourceRoot;
  if (app.isPackaged) process.env.DOJO_BUNDLE_ROOT = path.join(here, "bundle");
  await import(pathToFileURL(path.join(sourceRoot, "desktop/main.mjs")).href);
} else {
  process.env.DOJO_IGNORE_SOURCE = "1";
  await import("./main.mjs");
}
