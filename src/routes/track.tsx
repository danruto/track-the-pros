import { A, cache, createAsync } from "@solidjs/router"
import { eq } from "drizzle-orm"
import { For } from "solid-js"

import { db } from "~/api/db"
import { Accounts, Players, Teams } from "~/drizzle/schema"
import type { IPlayerResponse } from "~/types"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"

const serverGetPlayers = cache(async (): Promise<IPlayerResponse[]> => {
    "use server"

    // Fetch all accounts and mangle the types to something we can use on the frontend
    const ret = db
        .select({
            display: Players.display,
            role: Players.role,
            team: {
                name: Teams.name,
            },
            avatar: Players.avatar,
            account: {
                username: Accounts.username,
                riotId: Accounts.riot_id,
            },
        })
        .from(Players)
        .leftJoin(Accounts, eq(Players.id, Accounts.player_id))
        .leftJoin(Teams, eq(Teams.id, Players.team_id))
        .all()

    if (ret) {
        // Queried valid players, now pull their stats into cache if it has been expired
        // or if it is still valid then just display it

        return ret as unknown as IPlayerResponse[]
    }

    return []
}, "getPlayers")

export const route = {
    load: () => serverGetPlayers(),
}

export default function Track() {
    const players = createAsync(() => serverGetPlayers())

    return (
        <main class="container mx-auto">
            <h1>Track the pros</h1>
            <p class="my-4">
                <A href="/" class="text-sky-600 hover:underline">
                    Home
                </A>
                {" - "}
                <A href="/about" class="text-sky-600 hover:underline">
                    About Page
                </A>{" "}
                {" - "}
                <span>Track Page</span>
            </p>
            <div>
                <Table>
                    <TableCaption>Worlds 2024</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-[200px]">Team</TableHead>
                            <TableHead class="w-[200px]">Player</TableHead>
                            <TableHead>Account</TableHead>
                            <TableHead>Socials</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <For each={players()}>
                            {(user) => (
                                <TableRow>
                                    <TableCell>{user.team?.name}</TableCell>
                                    <TableCell>{user.display}</TableCell>
                                    <TableCell>
                                        {user.account.username}#{user.account.riotId}
                                    </TableCell>
                                    <TableCell>socials</TableCell>
                                </TableRow>
                            )}
                        </For>
                    </TableBody>
                </Table>
            </div>
        </main>
    )
}
