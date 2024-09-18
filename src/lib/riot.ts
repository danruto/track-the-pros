import { eq } from "drizzle-orm"
import { db } from "~/api/db/supa"
import { Accounts, Players, Stats, Teams, Socials } from "~/drizzle/schema-supa"
import type { IPlayerResponse, IStat, ITeam, TRole, TSocialKind } from "~/types"

import { Client } from "shieldbow"

const getRiotClient = async () => {
    if (!process.env.RIOT_API_KEY) throw new Error("A riot api key is required")

    // Worlds 2024 is in EUW, so use that as the default
    const client = new Client(process.env.RIOT_API_KEY)
    await client.initialize({ region: "euw" })

    return client
}

const fetchPlayer = async (limit: number, offset: number) => {
    // Fetch all accounts and mangle the types to something we can use on the frontend
    const players = await db
        .select({
            id: Players.id,
            display: Players.display,
            role: Players.role,
            team: {
                name: Teams.name,
                avatar: Teams.avatar,
            },
            avatar: Players.avatar,
            account: {
                id: Accounts.id,
                username: Accounts.username,
                riotId: Accounts.riot_id,
            },
        })
        .from(Players)
        .limit(limit)
        .offset(offset)
        .leftJoin(Accounts, eq(Players.id, Accounts.player_id))
        .leftJoin(Teams, eq(Teams.id, Players.team_id))

    const ret: IPlayerResponse[] = []

    if (players.length) {
        const client = await getRiotClient()
        for (const player of players) {
            try {
                // Queried valid players, now pull their stats into cache if it has been expired
                // or if it is still valid then just display it

                const now = new Date()
                const cutoffDate = new Date()
                cutoffDate.setHours(now.getHours() - 1)

                if (!player.account) {
                    continue
                }

                let playerStat: IStat | null = null

                const stat = await db.select().from(Stats).where(eq(Stats.account_id, player.account.id))
                if (stat.length) {
                    if (stat[0].updatedAt > cutoffDate) {
                        // Valid, just use the saved data
                        playerStat = {
                            wins: stat[0].wins,
                            losses: stat[0].losses,
                            percentage: stat[0].percentage,
                            tier: stat[0].tier ?? "BRONZE",
                            lp: stat[0].lp ?? 0,
                        }
                    }
                }

                if (!playerStat) {
                    const account = await client.accounts.fetchByNameAndTag(
                        player.account.username,
                        player.account.riotId,
                    )
                    const summoner = await client.summoners.fetchByPlayerId(account.playerId)
                    const leagueEntry = await summoner.fetchLeagueEntries()
                    const soloQ = leagueEntry.get("RANKED_SOLO_5x5")

                    if (soloQ) {
                        const data = {
                            updatedAt: new Date(),
                            wins: soloQ.wins,
                            losses: soloQ.losses,
                            percentage: (soloQ.wins / (soloQ.wins + soloQ.losses)) * 100,
                            lp: soloQ.lp,
                            tier: soloQ.tier,
                            player_id: player.id,
                            account_id: player.account.id,
                        }

                        await db
                            .insert(Stats)
                            .values(data)
                            .onConflictDoUpdate({
                                target: [Stats.player_id, Stats.account_id],
                                set: data,
                            })

                        playerStat = {
                            wins: data.wins,
                            losses: data.losses,
                            percentage: data.percentage,
                            tier: data.tier,
                            lp: data.lp,
                        }
                    }
                }

                const socials = await db.select().from(Socials).where(eq(Socials.player_id, player.id))

                ret.push({
                    ...player,
                    account: player.account!,
                    role: player.role as TRole,
                    avatar: null,
                    team: player.team ? (player.team as ITeam) : null,
                    socials: socials?.map((social) => ({
                        kind: social.kind as TSocialKind,
                        value: social.value,
                    })),
                    stats: playerStat ?? undefined,
                })
            } catch (ex) {
                console.error(ex)
            }
        }

        return ret
    }

    return []
}

export { fetchPlayer }
