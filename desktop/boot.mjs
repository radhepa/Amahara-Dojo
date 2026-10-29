import { app } from "electron";
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
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
  try {await import(pathToFileURL(path.join(sourceRoot, "desktop/main.mjs")).href);}
  catch (error) {
    // A half-saved project file must not keep Dojo from opening: use the packaged copy instead.
    if (globalThis[Symbol.for("dojo.main.started")] || !app.isPackaged) throw error;
    try {
      const saveDirectory = process.env.DOJO_DATA_DIR ?? path.join(process.env.LOCALAPPDATA ?? app.getPath("appData"), "Dojo");
      mkdirSync(saveDirectory, {recursive: true});
      appendFileSync(path.join(saveDirectory, "desktop.log"), `${new Date().toISOString()} Live source failed to load; using the packaged app ${error?.stack ?? error}\n`);
    } catch {}
    delete process.env.DOJO_SOURCE_ROOT; delete process.env.DOJO_BUNDLE_ROOT;
    process.env.DOJO_IGNORE_SOURCE = "1";
    await import("./main.mjs");
  }
} else {
  process.env.DOJO_IGNORE_SOURCE = "1";
  await import("./main.mjs");
}
