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

    const limit = 100
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
    await Promise.all(
        accounts.map(async (account) => {
            // console.log("[upsert-stats] Processing", { account })

            try {
                await updatePlayerStats(client, {
                    id: account.accounts.id,
                    puuid: account.accounts.puuid ?? undefined,
                    username: account.accounts.username,
                    riotId: account.accounts.riot_id,
                    playerId: account.accounts.player_id,
                })
            } catch (ex) {
                console.error("Failed to process account", { account, ex })
            }

            // console.log("[upsert-stats] Processed", { account })
        }),
    )

    console.log("[upsert-stats] Completed")

    return new Response(null)
}

export const config = {
    runtime: "nodejs",
}

export const GET = handler
