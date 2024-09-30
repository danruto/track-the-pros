import { desc, eq, isNotNull } from "drizzle-orm"
import { db } from "~/api/db/supa"
import { Accounts, Players, Socials, Stats, Teams } from "~/drizzle/schema-supa"
import type { IAccount, IPlayerResponse, ISocial, IStat, ITeam, TRole } from "~/types"

import { Client } from "shieldbow"

const getRiotClient = async () => {
    if (!process.env.RIOT_API_KEY) throw new Error("A riot api key is required")

    // Worlds 2024 is in EUW, so use that as the default
    const client = new Client(process.env.RIOT_API_KEY)
    await client.initialize({
        // logger: { level: "TRACE" },
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

const updatePlayerStats = async (client: Client, account: IAccount) => {
    console.log(`[updatePlayerStats] for ${account.username}`)

    let fetchedAccount = null
    let puuid = account.puuid
    // let puuid = null
    if (!puuid) {
        fetchedAccount = await client.accounts.fetchByNameAndTag(account.username, account.riotId)
        puuid = fetchedAccount.playerId
    }
    const summoner = await client.summoners.fetchByPlayerId(puuid)
    if (!fetchedAccount) fetchedAccount = await summoner.fetchAccount()

    console.log(`[updatePlayerStats] Fetched account data from riot for ${account.username}`)

    // If the account name and riot id has changed, then save it
    if (account.username !== fetchedAccount.username || account.riotId !== fetchedAccount.userTag || !account.puuid) {
        console.log("[updatePlayerStats] Account name has changed", { account, fetchedAccount })
        const data = {
            id: account.id,
            username: fetchedAccount.username,
            riot_id: fetchedAccount.userTag,
            puuid: fetchedAccount.playerId,
            player_id: account.playerId,
        }

        await db
            .insert(Accounts)
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            .values(data as unknown as any)
            .onConflictDoUpdate({
                target: [Accounts.id],
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                set: data as unknown as any,
            })
    }

    try {
        const leagueEntry = await summoner.fetchLeagueEntries({
            ignoreCache: true,
            ignoreStorage: true,
        })
        const soloQ = leagueEntry.get("RANKED_SOLO_5x5")

        if (soloQ) {
            const data = {
                updatedAt: new Date(),
                wins: soloQ.wins,
                losses: soloQ.losses,
                percentage: (soloQ.wins / (soloQ.wins + soloQ.losses)) * 100,
                lp: soloQ.lp,
                tier: soloQ.tier,
                player_id: account.playerId,
                account_id: account.id,
            }

            console.log(`[updatePlayerStats] Updating stats entry in db for ${account.username}`, { data })

            await db
                .insert(Stats)
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                .values(data as unknown as any)
                .onConflictDoUpdate({
                    target: [Stats.player_id, Stats.account_id],
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    set: data as unknown as any,
                })

            console.log(`[updatePlayerStats] Updated for ${account.username}`)

            return data
        }
    } catch (ex) {
        // Failing to fetch a league entry means they haven't played placements, so reset stats to an 'unranked' type state
        console.error(`Failed to fetch league entries for ${account.username}`, { ex })

        const data = {
            updatedAt: new Date(),
            wins: 0,
            losses: 0,
            percentage: 0,
            lp: 0,
            tier: "UNRANKED",
            player_id: account.playerId,
            account_id: account.id,
        }

        console.log(`[updatePlayerStats] Resetting stats entry in db for ${account.username}`, { data })

        await db
            .insert(Stats)
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            .values(data as unknown as any)
            .onConflictDoUpdate({
                target: [Stats.player_id, Stats.account_id],
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                set: data as unknown as any,
            })

        console.log(`[updatePlayerStats] Reset for ${account.username}`)

        return ex
    }

    return null
}

const fetchPlayer = async (limit: number, offset: number) => {
    // Fetch all the player accounts that we can use.
    // The data itself, will be updated via a cron job or manually by making a GET request to
    // `/api/upsert-stats`
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
                playerId: Accounts.player_id,
                username: Accounts.username,
                riotId: Accounts.riot_id,
                puuid: Accounts.puuid,
            },
            stats: {
                wins: Stats.wins,
                losses: Stats.losses,
                percentage: Stats.percentage,
                lp: Stats.lp,
                tier: Stats.tier,
            },
        })
        .from(Players)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(Stats.lp))
        .leftJoin(Accounts, eq(Players.id, Accounts.player_id))
        .leftJoin(Teams, eq(Teams.id, Players.team_id))
        .leftJoin(Stats, eq(Stats.account_id, Accounts.id))

    // .where(isNotNull(Stats.lp))

    const ret: IPlayerResponse[] = []

    // Convert from the db select statement into a IPlayerResponse
    if (players.length) {
        for (const player of players) {
            const socials = await db.select().from(Socials).where(eq(Socials.player_id, player.id))

            ret.push({
                ...player,
                account: {
                    ...player.account!,
                    puuid: player.account?.puuid ?? undefined,
                },
                role: player.role as TRole,
                avatar: null,
                team: player.team! as ITeam,
                socials: socials as ISocial[],
                stats: player.stats ? (player.stats as IStat) : undefined,
            })
        }

        return ret
    }

    return []
}

export { getRiotClient, fetchPlayer, updatePlayerStats }
