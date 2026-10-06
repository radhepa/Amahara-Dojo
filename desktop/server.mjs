import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const mime = {".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".woff2": "font/woff2", ".json": "application/json"};
export async function createDojoServer({bundleRoot, sourceRoot, port = 0, sessionToken = randomBytes(32).toString("hex")}) {
  let live, origin;
  let offlineApi;
  const server = createServer(async (req, res) => {
    const fail = (status, error) => {res.writeHead(status, {"Content-Type": "application/json"}); res.end(JSON.stringify({error}));};
    // The desktop window receives this private cookie from Electron. Unrelated
    // local apps and websites cannot open or modify the player's save.
    if (req.headers.host !== new URL(origin).host) return fail(403, "Invalid local host.");
    if (!(req.headers.cookie ?? "").split(";").some(c => c.trim() === `dojo_session=${sessionToken}`)) return fail(401, "Open Dojo from the desktop app.");
    if (req.headers.origin && req.headers.origin !== origin) return fail(403, "Invalid request origin.");
    const url = new URL(req.url, origin);
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Security-Policy", `default-src 'self'; script-src 'self'${live ? " 'unsafe-inline'" : ""}; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'${live ? ` ws://${url.host}` : ""}; media-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`);
    try {
      if (url.pathname.startsWith("/api/")) {
        if (!["GET", "POST"].includes(req.method)) return fail(405, "Invalid request method.");
        const parts = []; let size = 0;
        for await (const part of req) {
          size += part.length;
          if (size > 128 * 1024) return fail(413, "This local request is too large.");
          parts.push(part);
        }
        const request = new Request(url, {method: req.method, headers: req.headers, ...(req.method === "POST" ? {body: Buffer.concat(parts)} : {})});
        const api = live ? await live.ssrLoadModule(path.join(sourceRoot, "desktop/api.ts")) : offlineApi;
        const response = await api.handle(request);
        res.writeHead(response.status, Object.fromEntries(response.headers));
        return res.end(Buffer.from(await response.arrayBuffer()));
      }
      if (req.method !== "GET") return fail(405, "Invalid request method.");
      if (live) return live.middlewares(req, res, () => fail(404, "Local file not found."));
      const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "") || "index.html";
      const filename = path.resolve(bundleRoot, "renderer", relative);
      const rendererRoot = path.resolve(bundleRoot, "renderer") + path.sep;
      if (!filename.startsWith(rendererRoot) || relative.includes("\0")) return fail(403, "Invalid file path.");
      if (!(await stat(filename)).isFile()) return fail(404, "Local file not found.");
      res.setHeader("Content-Type", mime[path.extname(filename)] ?? "application/octet-stream");
      res.end(await readFile(filename));
    } catch (error) {
      if (error.code === "ENOENT") return fail(404, "Local file not found.");
      console.error("Local Dojo request", error);
      if (!res.headersSent) fail(503, "Dojo could not load this change. Please reload after fixing it.");
      else res.end();
    }
  });
  if (sourceRoot) {
    const {createServer: createVite} = await import(pathToFileURL(path.join(sourceRoot, "node_modules/vite/dist/node/index.js")).href);
    live = await createVite({configFile: path.join(sourceRoot, "desktop/vite.config.ts"), server: {middlewareMode: true, hmr: {server}}, appType: "spa"});
  } else {
    offlineApi = await import(pathToFileURL(path.join(bundleRoot, "api.mjs")).href);
  }
  await new Promise((resolve, reject) => {
    server.once("error", error => {
      if (port && error.code === "EADDRINUSE") server.listen(0, "127.0.0.1", resolve);
      else reject(error);
    });
    server.listen(port, "127.0.0.1", resolve);
  });
  origin = `http://127.0.0.1:${server.address().port}`;
  return {origin, sessionToken, live: !!live, async close() {
    if (live) await live.close();
    await new Promise(resolve => server.close(resolve));
  }};
}
