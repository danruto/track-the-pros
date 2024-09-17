import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core"

export const Teams = sqliteTable("teams", {
    id: integer("id").primaryKey().unique().notNull(),
    name: text("name").notNull(),
    avatar: text("avatar"),
})

export const Players = sqliteTable("players", {
    id: integer("id").primaryKey().unique().notNull(),
    display: text("display").notNull(),
    role: text("role").notNull(),
    avatar: text("avatar"),

    team_id: integer("team_id").references(() => Teams.id),
})

export const Accounts = sqliteTable("accounts", {
    id: integer("id").primaryKey().unique().notNull(),
    username: text("username").notNull(),
    riot_id: text("riot_id").notNull(),

    player_id: integer("player_id").references(() => Players.id),
})
