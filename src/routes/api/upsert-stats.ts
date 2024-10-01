import { lt, eq, and, isNotNull, or, isNull } from "drizzle-orm"
import { db } from "~/api/db/supa"
import { Accounts, Stats } from "~/drizzle/schema-supa"
import { getRiotClient, updatePlayerStats } from "~/lib/riot"

const handler = async () => {
    console.log("[upsert-stats] Starting")

    // Get all known accounts where the last update is too old
    const now = new Date()

    const cutoffDate = new Date()
    cutoffDate.setHours(now.getHours() - 1)

    // Riot API limit for our key is ~40.
    // So just set it to that for now
    // and have the cron run multiple times
    // between 0 < n < cutoffDate
    // within the Riot API limits
    const limit = process.env.UPSERT_LIMIT ? Number.parseInt(process.env.UPSERT_LIMIT, 10) : 20
    const offset = 0

    const client = await getRiotClient()
    const accounts = await db
        .select()
        .from(Accounts)
        .leftJoin(Stats, eq(Stats.account_id, Accounts.id))
        .limit(limit)
        .offset(offset)
        .where(
            or(
                isNull(Stats.updatedAt),

                and(isNotNull(Stats.updatedAt), lt(Stats.updatedAt, cutoffDate)),
            ),
        )

    console.log("Found accounts to update", accounts.length)

    // Queue update on them
    try {
        await Promise.all(
            accounts.map((account) => {
                return updatePlayerStats(client, {
                    id: account.accounts.id,
                    puuid: account.accounts.puuid ?? undefined,
                    username: account.accounts.username,
                    riotId: account.accounts.riot_id,
                    playerId: account.accounts.player_id,
                })
            }),
        )
    } catch (ex) {
        console.error(ex)
    }

    console.log("[upsert-stats] Completed")

    return new Response(null)
}

export const config = {
    runtime: "nodejs",
}

export const GET = handler
