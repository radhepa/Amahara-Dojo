import { spawn } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const {default: electron} = await import(pathToFileURL(path.join(root, "desktop/node_modules/electron/index.js")).href);
const env = {...process.env}; delete env.ELECTRON_RUN_AS_NODE;
const child = spawn(electron, [path.join(root, "desktop"), ...process.argv.slice(2)], {env, stdio: "inherit", windowsHide: true});
child.on("exit", code => process.exit(code ?? 1));
child.on("error", error => {console.error(error); process.exitCode = 1;});
