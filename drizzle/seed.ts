import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3"

import { Accounts, Players, Teams } from "~/drizzle/schema"

import accountsData from "../seed-accounts.json"
import playersData from "../seed-players.json"
import teamsData from "../seed-teams.json"

export function seed(db: BetterSQLite3Database) {
    db.insert(Teams).values(teamsData)
    db.insert(Players).values(playersData)
    db.insert(Accounts).values(accountsData)
}
