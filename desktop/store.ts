// A shared symbol keeps the connection stable across live module reloads.
export function database(): D1Database {
  const db = (globalThis as unknown as Record<symbol, D1Database>)[Symbol.for("dojo.desktop.database")];
  if (!db) throw new Error("The local Dojo save is unavailable.");
  return db;
}
