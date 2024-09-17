import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3"

import { Accounts, Players, Socials, Teams } from "~/drizzle/schema"

import accountsData from "./seed/seed-accounts.json"
import playersData from "./seed/seed-players.json"
import teamsData from "./seed/seed-teams.json"
import socialsData from "./seed/seed-socials.json"

export async function seed(db: BetterSQLite3Database) {
    const accounts = db.select().from(Accounts).get()

    if (!accounts) {
        console.log("Seeding...")

        await db.insert(Teams).values(teamsData)
        await db.insert(Players).values(playersData)
        await db.insert(Accounts).values(accountsData)
        await db.insert(Socials).values(socialsData)

        console.log("Seeded")
    }
}
