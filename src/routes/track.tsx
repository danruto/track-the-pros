import { A, cache, createAsync } from "@solidjs/router"
import { For } from "solid-js"
import { Progress, ProgressValueLabel } from "~/components/ui/progress"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { fetchPlayer } from "~/lib/riot"
import type { IPlayerResponse } from "~/types"

const serverGetPlayers = cache(async (opts: { limit?: number; offset?: number }): Promise<IPlayerResponse[]> => {
    "use server"

    return await fetchPlayer(opts.limit ?? 100, opts.offset ?? 0)
}, "getPlayers")

export const route = {
    load: () => serverGetPlayers({}),
}

export default function Track() {
    const players = createAsync(() => serverGetPlayers({}), { initialValue: [], deferStream: true })

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
                            <TableHead>Role</TableHead>
                            <TableHead>Stats</TableHead>
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
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <Progress
                                            value={user.stats?.percentage ?? 0}
                                            fill={(user.stats?.percentage ?? 0 > 50) ? "bg-green-500" : "bg-danger"}
                                            getValueLabel={() =>
                                                `${user.stats?.wins ?? 0}W ${user.stats?.losses}L at ${user.stats?.percentage.toFixed(2)}% W/R in ${user.stats?.lp}LP ${user.stats?.tier}`
                                            }
                                        >
                                            <ProgressValueLabel />
                                        </Progress>
                                    </TableCell>
                                    <TableCell>
                                        <For each={user.socials ?? []}>
                                            {(social) => (
                                                <>
                                                    <p>{social.kind}</p>
                                                    <p>{social.value}</p>
                                                </>
                                            )}
                                        </For>
                                    </TableCell>
                                </TableRow>
                            )}
                        </For>
                    </TableBody>
                </Table>
            </div>
        </main>
    )
}
