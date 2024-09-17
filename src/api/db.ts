import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import { seed } from "~/drizzle/seed"

const sqlite = new Database("./drizzle/db.sqlite")

export const db: BetterSQLite3Database = drizzle(sqlite)

seed(db)
