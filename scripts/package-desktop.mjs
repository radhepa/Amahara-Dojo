import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { writeFileSync, mkdirSync } from "node:fs";

const root = fileURLToPath(new URL("../", import.meta.url));
const desktop = path.join(root, "desktop");
const {packager} = await import(pathToFileURL(path.join(desktop, "node_modules/@electron/packager/dist/index.js")).href);
const [output] = await packager({dir: desktop, name: "Dojo", icon: path.join(desktop, "icon.ico"), platform: "win32", arch: "x64", electronVersion: "44.5.1", out: path.join(desktop, "release"), overwrite: true, asar: true, prune: false, ignore: [/^\/node_modules(?:\/|$)/, /^\/release(?:\/|$)/, /^\/renderer(?:\/|$)/, /^\/.*\.ts$/, /^\/package-lock\.json$/, /^\/vite\.config\.ts$/], win32metadata: {CompanyName: "Radhe Patel", FileDescription: "Dojo", ProductName: "Dojo", InternalName: "Dojo", OriginalFilename: "Dojo.exe"}});
mkdirSync(path.join(output, "resources"), {recursive: true});
writeFileSync(path.join(output, "resources/source.json"), JSON.stringify({sourceRoot: process.env.DOJO_SOURCE_ROOT ?? root}, null, 2));
console.log(`Desktop app: ${path.join(output, "Dojo.exe")}`);
