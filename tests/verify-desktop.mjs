import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { request as httpRequest } from "node:http";
import { DatabaseSync } from "node:sqlite";
import { openLocalDatabase } from "../desktop/sqlite.mjs";
import { createDojoServer } from "../desktop/server.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const temp = mkdtempSync(path.join(tmpdir(), "dojo-desktop-test-"));
const filename = path.join(temp, "progress.sqlite");
let save, server;
try {
  save = openLocalDatabase(filename, path.join(root, "drizzle"));
  await assert.rejects(save.db.batch([
    save.db.prepare("INSERT INTO training_profiles(user_id) VALUES(?)").bind("rollback-fixture"),
    save.db.prepare("INSERT INTO missing_table VALUES(1)"),
  ]));
  assert.equal(save.sqlite.prepare("SELECT COUNT(*) AS n FROM training_profiles").get().n, 0, "Failed transaction must roll back every write");
  save.close();
  save = openLocalDatabase(filename, path.join(root, "drizzle"));
  assert.equal(save.sqlite.prepare("SELECT COUNT(*) AS n FROM desktop_migrations").get().n, 3, "Reopening does not reapply migrations");
  for (const live of [false, true]) {
    server = await createDojoServer({bundleRoot: path.join(root, "desktop/bundle"), ...(live ? {sourceRoot: root} : {})});
    const cookie = `dojo_session=${server.sessionToken}`;
    assert.equal((await fetch(server.origin + "/api/game")).status, 401);
    const wrongHost = await new Promise((resolve, reject) => {
      const request = httpRequest(server.origin + "/api/game", {headers: {Cookie: cookie, Host: "attacker.test"}}, response => {response.resume(); resolve(response.statusCode);});
      request.on("error", reject); request.end();
    });
    assert.equal(wrongHost, 403);
    assert.equal((await fetch(server.origin + "/api/game", {headers: {Cookie: cookie, Origin: "https://attacker.test"}})).status, 403);
    assert.equal((await fetch(server.origin + "/api/game", {method: "POST", headers: {Cookie: cookie}, body: "x".repeat(130 * 1024)})).status, 413);
    const html = await (await fetch(server.origin, {headers: {Cookie: cookie}})).text();
    assert(html.includes("Dojo") && !html.includes("signin-with-chatgpt"));
    const asset = await fetch(server.origin + "/story/backgrounds/hall-restored.webp", {headers: {Cookie: cookie}});
    assert.equal(asset.status, 200, "Art is served locally");
    assert((await asset.arrayBuffer()).byteLength > 1000);
    await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, ["tests/verify-game-api.mjs"], {cwd: root, stdio: "inherit", env: {...process.env, DOJO_TEST_ORIGIN: server.origin, DOJO_TEST_DESKTOP_DB: filename, DOJO_TEST_DESKTOP_COOKIE: server.sessionToken}, windowsHide: true});
      child.on("error", reject);
      child.on("exit", code => code === 0 ? resolve() : reject(new Error(`Desktop API checks failed (${code})`)));
    });
    const assessment = {type: "assessment", squat: "half", reach: "toes", comfort: true};
    assert.equal((await fetch(server.origin + "/api/progress", {method: "POST", headers: {Cookie: cookie, "Content-Type": "application/json"}, body: JSON.stringify(assessment)})).status, 200);
    await server.close(); server = undefined;
    save.close(); save = openLocalDatabase(filename, path.join(root, "drizzle"));
    assert.equal(save.sqlite.prepare("SELECT comfort FROM training_profiles WHERE user_id='desktop-local'").get().comfort, 1, "Save persists after the local runtime restarts");
    console.log(`PASS: ${live ? "live source" : "self-contained"} desktop API, local art and persistent progress.`);
  }
  const backupFile = path.join(temp, "backup.sqlite");
  save.backup(backupFile);
  const backup = new DatabaseSync(backupFile, {readOnly: true});
  assert.equal(backup.prepare("SELECT comfort FROM training_profiles WHERE user_id='desktop-local'").get().comfort, 1);
  assert.equal(backup.prepare("PRAGMA integrity_check").get().integrity_check, "ok");
  backup.close();
  console.log("PASS: atomic rollback, repeat migrations, private desktop session, foreign host/origin rejection, request limits, restart persistence and consistent backup.");
} finally {
  await server?.close(); save?.close();
  rmSync(temp, {recursive: true, force: true});
}
