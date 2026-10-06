import { app, BrowserWindow, Menu, dialog, session, shell, nativeImage, screen } from "electron";
import { mkdirSync, readFileSync, appendFileSync, existsSync, writeFileSync, unlinkSync, watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDojoServer } from "./server.mjs";
import { openLocalDatabase } from "./sqlite.mjs";

app.setName("Dojo");
app.setAppUserModelId("com.radhepatel.dojo");
app.commandLine.appendSwitch("disable-background-networking");
app.commandLine.appendSwitch("disable-component-update");
const saveDirectory = process.env.DOJO_DATA_DIR ?? path.join(process.env.LOCALAPPDATA ?? app.getPath("appData"), "Dojo");
mkdirSync(saveDirectory, {recursive: true});
app.setPath("userData", saveDirectory);
const logFile = path.join(saveDirectory, "desktop.log");
const log = (...values) => appendFileSync(logFile, `${new Date().toISOString()} ${values.map(v => v?.stack ?? String(v)).join(" ")}\n`);
const here = path.dirname(fileURLToPath(import.meta.url));
const bundleRoot = process.env.DOJO_BUNDLE_ROOT ?? path.join(here, "bundle");
let backend, save, window, sourceWatcher, reloadTimer, quitting = false;
let port = 0;
try {const remembered = Number(readFileSync(path.join(saveDirectory, "runtime-port"), "utf8")); if (Number.isInteger(remembered) && remembered > 1024 && remembered < 65536) port = remembered;} catch {}

if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on("second-instance", () => {if (window) {if (window.isMinimized()) window.restore(); window.focus();}});
  app.on("window-all-closed", () => app.quit());
  app.on("before-quit", event => {
    if (quitting || !backend) return;
    event.preventDefault(); quitting = true;
    sourceWatcher?.close(); clearTimeout(reloadTimer);
    void backend.close().finally(() => {save?.close(); app.quit();});
  });
  // Electron waits for ESM evaluation before becoming ready. Keep readiness
  // asynchronous here so a top-level await cannot deadlock startup.
  void app.whenReady().then(async () => {
  try {
    let sourceRoot = process.env.DOJO_SOURCE_ROOT;
    if (!sourceRoot && !app.isPackaged) sourceRoot = path.resolve(here, "..");
    if (!sourceRoot && existsSync(path.join(process.resourcesPath, "source.json"))) sourceRoot = JSON.parse(readFileSync(path.join(process.resourcesPath, "source.json"), "utf8")).sourceRoot;
    if (process.env.DOJO_IGNORE_SOURCE || process.argv.includes("--offline") || (sourceRoot && !existsSync(path.join(sourceRoot, "desktop/vite.config.ts")))) sourceRoot = undefined;
    save = openLocalDatabase(path.join(saveDirectory, "progress.sqlite"), sourceRoot ? path.join(sourceRoot, "drizzle") : path.join(here, "migrations"));
    try {backend = await createDojoServer({bundleRoot, sourceRoot, port});}
    catch (error) {
      if (!sourceRoot) throw error;
      log("Live source unavailable; loading bundled app", error);
      sourceRoot = undefined;
      backend = await createDojoServer({bundleRoot, port});
    }
    // A stable loopback origin also preserves the reader's local preferences.
    writeFileSync(path.join(saveDirectory, "runtime-port"), new URL(backend.origin).port);
    const localSession = session.defaultSession;
    localSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
    localSession.setPermissionCheckHandler(() => false);
    localSession.webRequest.onBeforeRequest((details, callback) => {
      const url = new URL(details.url);
      const allowed = url.origin === backend.origin || (backend.live && url.protocol === "ws:" && url.host === new URL(backend.origin).host) || ["devtools:", "data:", "blob:"].includes(url.protocol);
      callback({cancel: !allowed});
    });
    await localSession.cookies.set({url: backend.origin, name: "dojo_session", value: backend.sessionToken, httpOnly: true, sameSite: "strict"});
    const iconPath = path.join(here, "icon.png");
    const workArea = screen.getPrimaryDisplay().workArea;
    window = new BrowserWindow({width: Math.min(1366, workArea.width), height: Math.min(820, workArea.height), minWidth: Math.min(1060, workArea.width), minHeight: Math.min(680, workArea.height), title: "Dojo", backgroundColor: "#121117", show: false, ...(existsSync(iconPath) ? {icon: nativeImage.createFromPath(iconPath)} : {}), webPreferences: {nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true, zoomFactor: Math.min(1, workArea.width / 1200)}});
    window.webContents.setWindowOpenHandler(() => ({action: "deny"}));
    window.webContents.on("will-navigate", (event, url) => {if (new URL(url).origin !== backend.origin) event.preventDefault();});
    window.webContents.on("console-message", event => {if (event.level === "error") log("Renderer", event.message);});
    window.webContents.on("render-process-gone", (_event, details) => log("Renderer stopped", JSON.stringify(details)));
    window.once("ready-to-show", () => window.show());
    async function backupSave() {
      const destination = await dialog.showSaveDialog(window, {title: "Back up your local Dojo save", defaultPath: `Dojo-save-${new Date().toISOString().slice(0, 10)}.sqlite`, filters: [{name: "Dojo save", extensions: ["sqlite"]}]});
      if (destination.canceled || !destination.filePath) return;
      if (path.resolve(destination.filePath).toLowerCase() === path.join(saveDirectory, "progress.sqlite").toLowerCase()) {
        dialog.showErrorBox("Choose a different backup file", "This is your active save. Choose a separate file for your backup."); return;
      }
      const temporary = destination.filePath + ".dojo-backup";
      try {
        if (existsSync(temporary)) unlinkSync(temporary);
        save.backup(temporary);
        writeFileSync(destination.filePath, readFileSync(temporary));
        unlinkSync(temporary);
        await dialog.showMessageBox(window, {type: "info", message: "Your Dojo save has been backed up."});
      } catch (error) {log(error); dialog.showErrorBox("Backup failed", "Your original save is still available. Choose another backup location.");}
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      {label: "Dojo", submenu: [{label: "Back up local save…", click: backupSave}, {label: "Open save folder", click: () => shell.openPath(saveDirectory)}, {type: "separator"}, {role: "quit"}]},
      {label: "Edit", submenu: [{role: "undo"}, {role: "redo"}, {type: "separator"}, {role: "cut"}, {role: "copy"}, {role: "paste"}, {role: "selectAll"}]},
      {label: "View", submenu: [{role: "reload"}, {role: "resetZoom"}, {role: "zoomIn"}, {role: "zoomOut"}, {role: "togglefullscreen"}, ...(backend.live ? [{role: "toggleDevTools"}] : [])]},
      {label: "Help", submenu: [...(sourceRoot ? [{label: "Open project folder", click: () => shell.openPath(sourceRoot)}] : []), {label: "About Dojo", click: () => dialog.showMessageBox(window, {title: "Dojo", message: "Dojo", detail: `Created by Radhe Patel.\n\nEverything runs on this computer. No ChatGPT sign-in or internet connection is required.\n\n${backend.live ? "Local project changes update this window automatically." : "Running the self-contained desktop copy."}\n\nSave: ${path.join(saveDirectory, "progress.sqlite")}`})}]},
    ]));
    await window.loadURL(backend.origin);
    window.show();
    log(`Ready: ${backend.live ? "live source" : "bundled"}; source=${sourceRoot ?? "none"}`);
    if (sourceRoot && backend.live) {
      const nativeFiles = new Set(["boot.mjs", "main.mjs", "server.mjs", "sqlite.mjs", "vite.config.ts"]);
      sourceWatcher = watch(path.join(sourceRoot, "desktop"), (_event, filename) => {
        if (!nativeFiles.has(String(filename))) return;
        clearTimeout(reloadTimer);
        reloadTimer = setTimeout(() => {app.relaunch(); app.quit();}, 1000);
      });
    }
    if (process.env.DOJO_SMOKE_FILE) writeFileSync(process.env.DOJO_SMOKE_FILE, JSON.stringify({origin: backend.origin, sessionToken: backend.sessionToken, live: backend.live}));
  } catch (error) {log(error); dialog.showErrorBox("Dojo could not start", `Your save is kept in ${saveDirectory}.\n\n${error.message}`); app.quit();}
  });
}
