import type { Config } from "@netlify/functions"
import { lt, eq } from "drizzle-orm"
import { db } from "~/api/db/supa"
import { Accounts, Stats } from "~/drizzle/schema-supa"
import { getRiotClient, updatePlayerStats } from "~/lib/riot"

const handler = async (req: Request) => {
    console.log("req", JSON.stringify(req))

    // Get all known accounts where the last update is too old
    const now = new Date()

    const cutoffDate = new Date()
    cutoffDate.setHours(now.getHours() - 1)

    const client = await getRiotClient()
    const stats = await db
        .select()
        .from(Stats)
        .leftJoin(Accounts, eq(Stats.account_id, Accounts.id))
        .where(lt(Stats.updatedAt, cutoffDate))

    // Queue update on them
    await Promise.all(
        stats.map(async (stat) => {
            if (stat.accounts) {
                console.log("Processing", { stat })
                await updatePlayerStats(client, {
                    username: stat.accounts.username,
                    riotId: stat.accounts.riot_id,
                    playerId: stat.stats.player_id,
                    accountId: stat.stats.account_id,
                })
                console.log("Processed", { stat })
            }
        }),
    )

    return {
        statusCode: 200,
    }
}

export const config: Config = {
    // 0 */2 * * *
    schedule: "@hourly",
}

export default handler
export { handler }
