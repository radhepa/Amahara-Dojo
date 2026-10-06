import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

// Match the D1 surface used by the existing routes. A batch is one SQLite
// transaction, retaining compare-and-swap, journal and reward atomicity.
export function openLocalDatabase(filename, migrationsDirectory) {
  mkdirSync(path.dirname(filename), {recursive: true});
  const sqlite = new DatabaseSync(filename);
  sqlite.exec("PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON;");
  sqlite.exec("CREATE TABLE IF NOT EXISTS desktop_migrations (name TEXT PRIMARY KEY NOT NULL)");
  for (const name of readdirSync(migrationsDirectory).filter(n => n.endsWith(".sql")).sort()) {
    if (sqlite.prepare("SELECT name FROM desktop_migrations WHERE name=?").get(name)) continue;
    sqlite.exec("BEGIN IMMEDIATE");
    try {
      sqlite.exec(readFileSync(path.join(migrationsDirectory, name), "utf8"));
      sqlite.prepare("INSERT INTO desktop_migrations(name) VALUES(?)").run(name);
      sqlite.exec("COMMIT");
    } catch (error) { sqlite.exec("ROLLBACK"); sqlite.close(); throw error; }
  }
  const result = (changes = 0, results = []) => ({success: true, results, meta: {changes: Number(changes)}});
  class Statement {
    constructor(sql, values = []) { this.sql = sql; this.values = values; }
    bind(...values) { return new Statement(this.sql, values); }
    async first(column) {
      const row = sqlite.prepare(this.sql).get(...this.values);
      return column ? (row?.[column] ?? null) : (row ?? null);
    }
    async all() { return result(0, sqlite.prepare(this.sql).all(...this.values)); }
    execute() { return result(sqlite.prepare(this.sql).run(...this.values).changes); }
    async run() { return this.execute(); }
  }
  const db = {
    prepare(sql) { return new Statement(sql); },
    async batch(statements) {
      sqlite.exec("BEGIN IMMEDIATE");
      try {
        const results = statements.map(statement => statement.execute());
        sqlite.exec("COMMIT");
        return results;
      } catch (error) { sqlite.exec("ROLLBACK"); throw error; }
    },
  };
  globalThis[Symbol.for("dojo.desktop.database")] = db;
  return {
    db, sqlite,
    // VACUUM INTO includes committed WAL writes in a consistent single file.
    backup(destination) { sqlite.prepare("VACUUM INTO ?").run(destination); },
    close() {
      if (globalThis[Symbol.for("dojo.desktop.database")] === db) delete globalThis[Symbol.for("dojo.desktop.database")];
      sqlite.close();
    },
  };
}
