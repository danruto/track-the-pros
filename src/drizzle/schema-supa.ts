import { real, timestamp } from "drizzle-orm/pg-core"
import { primaryKey } from "drizzle-orm/pg-core"
import { pgTable, serial, text } from "drizzle-orm/pg-core"

export const Teams = pgTable("teams", {
    id: serial("id").primaryKey().unique().notNull(),
    name: text("name").notNull(),
    avatar: text("avatar"),
})

export const Players = pgTable("players", {
    id: serial("id").primaryKey().unique().notNull(),
    display: text("display").notNull(),
    role: text("role").notNull(),
    avatar: text("avatar"),

    team_id: serial("team_id").references(() => Teams.id),
})

export const Accounts = pgTable("accounts", {
    id: serial("id").primaryKey().unique().notNull(),
    username: text("username").notNull(),
    riot_id: text("riot_id").notNull(),
    puuid: text("puuid"),

    player_id: serial("player_id").references(() => Players.id),
})

export const Socials = pgTable("socials", {
    id: serial("id").primaryKey().unique().notNull(),
    kind: text("kind").notNull(),
    value: text("value").notNull(),

    player_id: serial("player_id").references(() => Players.id),
})

export const Stats = pgTable(
    "stats",
    {
        updatedAt: timestamp("updatedAt").notNull().defaultNow(),

        wins: real("wins").notNull().default(0),
        losses: real("losses").notNull().default(0),
        percentage: real("percentage").notNull().default(0),

        lp: real("lp"),
        tier: text("tier"),

        // Champ stats

        player_id: serial("player_id").references(() => Players.id),
        account_id: serial("account_id").references(() => Accounts.id),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.player_id, table.account_id] }),
        }
    },
)
