import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3"

import { Accounts, Players, Teams } from "~/drizzle/schema"

import accountsData from "../seed-accounts.json"
import playersData from "../seed-players.json"
import teamsData from "../seed-teams.json"

export async function seed(db: BetterSQLite3Database) {
    console.log("Seeding...")
    await db.insert(Teams).values(teamsData)
    await db.insert(Players).values(playersData)
    await db.insert(Accounts).values(accountsData)
    console.log("Seeded")
}
