import accountsData from "./seed/seed-accounts.json"
import playersData from "./seed/seed-players.json"
import socialsData from "./seed/seed-socials.json"
import teamsData from "./seed/seed-teams.json"

import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import {
    Accounts as SQLiteAccounts,
    Players as SQLitePlayers,
    Socials as SQLiteSocials,
    Teams as SQLiteTeams,
} from "~/drizzle/schema-sqlite"
import {
    Accounts as PGAccounts,
    Players as PGPlayers,
    Socials as PGSocials,
    Teams as PGTeams,
} from "~/drizzle/schema-supa"

export async function seed_sqlite(db: BetterSQLite3Database) {
    const accounts = db.select().from(SQLiteAccounts).get()

    if (!accounts) {
        console.log("Seeding...")

        await db.insert(SQLiteTeams).values(teamsData)
        await db.insert(SQLitePlayers).values(playersData)
        await db.insert(SQLiteAccounts).values(accountsData)
        await db.insert(SQLiteSocials).values(socialsData)

        console.log("Seeded")
    }
}

export async function seed_supa(db: PostgresJsDatabase) {
    const accounts = await db.select().from(PGAccounts)

    if (accounts.length === 0) {
        console.log("Seeding...")

        await db.insert(PGTeams).values(teamsData)
        await db.insert(PGPlayers).values(playersData)
        await db.insert(PGAccounts).values(accountsData)
        await db.insert(PGSocials).values(socialsData)

        console.log("Seeded")
    }
}
