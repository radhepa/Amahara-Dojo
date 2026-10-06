import { build as viteBuild } from "vite";
import { build as bundle } from "esbuild";
import { cpSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const desktop = path.join(root, "desktop");
await viteBuild({configFile: path.join(desktop, "vite.config.ts")});
await bundle({entryPoints: [path.join(desktop, "api.ts")], bundle: true, platform: "node", format: "esm", target: "node24", outfile: path.join(desktop, "bundle/api.mjs"), alias: {
  "@/app/chatgpt-auth": path.join(desktop, "auth.ts"),
  "@/lib/store": path.join(desktop, "store.ts"),
  "@": root,
}, plugins: [{name: "dojo-local-store", setup(build) {
  build.onResolve({filter: /^\.\/store$/}, args => args.importer.replaceAll("\\", "/").endsWith("/lib/game-store.ts") ? {path: path.join(desktop, "store.ts")} : undefined);
}}]});
mkdirSync(path.join(desktop, "migrations"), {recursive: true});
cpSync(path.join(root, "drizzle"), path.join(desktop, "migrations"), {recursive: true, filter: name => !name.includes(`${path.sep}meta`)});
cpSync(path.join(root, "vendor"), path.join(desktop, "bundle/vendor"), {recursive: true});
// Original local icon: a lantern and vermilion hall beam, no remote assets.
const icon = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" rx="54" fill="#181622"/><path d="M48 68h160M72 68v130M184 68v130M58 198h140" fill="none" stroke="#b54136" stroke-width="15" stroke-linecap="round"/><path d="M128 68v20" stroke="#e9c8a1" stroke-width="6"/><rect x="101" y="91" width="54" height="67" rx="17" fill="#f0c077"/><path d="M112 94v61M144 94v61M104 115h48M104 136h48" fill="none" stroke="#b54136" stroke-width="4"/><path d="M119 165h18" stroke="#e9c8a1" stroke-width="6" stroke-linecap="round"/></svg>');
await sharp(icon).png().toFile(path.join(desktop, "icon.png"));
// PNG-compressed ICO entries are supported by modern Windows at every size.
const iconSizes = [16, 32, 48, 256];
const iconFrames = await Promise.all(iconSizes.map(size => sharp(icon).resize(size, size).png().toBuffer()));
const iconHeader = Buffer.alloc(6 + iconFrames.length * 16);
iconHeader.writeUInt16LE(1, 2); iconHeader.writeUInt16LE(iconFrames.length, 4);
let offset = iconHeader.length;
iconFrames.forEach((frame, i) => {
  const entry = 6 + i * 16, size = iconSizes[i];
  iconHeader[entry] = iconHeader[entry + 1] = size === 256 ? 0 : size;
  iconHeader.writeUInt16LE(1, entry + 4); iconHeader.writeUInt16LE(32, entry + 6);
  iconHeader.writeUInt32LE(frame.length, entry + 8); iconHeader.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
});
const {writeFileSync} = await import("node:fs");
writeFileSync(path.join(desktop, "icon.ico"), Buffer.concat([iconHeader, ...iconFrames]));
console.log("Dojo desktop built. All runtime code, art and fonts are local.");
