import { eq } from "drizzle-orm"
import { db } from "~/api/db/supa"
import { Accounts, Players, Socials, Stats, Teams } from "~/drizzle/schema-supa"
import type { IPlayer, IPlayerResponse, IStat, ITeam, TRole, TSocialKind } from "~/types"

import { Client } from "shieldbow"

const getRiotClient = async () => {
    if (!process.env.RIOT_API_KEY) throw new Error("A riot api key is required")

    // Worlds 2024 is in EUW, so use that as the default
    const client = new Client(process.env.RIOT_API_KEY)
    await client.initialize({
        region: "euw",
        ratelimiter: {
            retry: {
                retries: 3,
                retryDelay: 5000,
            },
            throw: false,
            strategy: "spread",
        },
    })

    return client
}

const updatePlayerStats = async (
    client: Client,
    options: {
        username: string
        riotId: string
        playerId: number
        accountId: number
    },
) => {
    const account = await client.accounts.fetchByNameAndTag(options.username, options.riotId)
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
            player_id: options.playerId,
            account_id: options.accountId,
        }

        await db
            .insert(Stats)
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            .values(data as unknown as any)
            .onConflictDoUpdate({
                target: [Stats.player_id, Stats.account_id],
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                set: data as unknown as any,
            })

        return data
    }

    return null
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
            let playerStat: IStat | null = null

            try {
                // Queried valid players, now pull their stats into cache if it has been expired
                // or if it is still valid then just display it

                const now = new Date()
                const cutoffDate = new Date()
                // cutoffDate.setHours(now.getHours() - 1)
                cutoffDate.setHours(now.getHours() - 24)

                if (!player.account) {
                    continue
                }

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
                    playerStat = await updatePlayerStats(client, {
                        username: player.account.username,
                        riotId: player.account.riotId,
                        playerId: player.id,
                        accountId: player.account.id,
                    })
                }
            } catch (ex) {
                console.error(ex)

                if (player.account) {
                    // On rate limit errors, just use whatever we had in cache
                    const stat = await db.select().from(Stats).where(eq(Stats.account_id, player.account.id))
                    if (stat.length) {
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
        }

        return ret
    }

    return []
}

export { getRiotClient, fetchPlayer, updatePlayerStats }
