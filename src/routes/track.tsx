import { A, cache, createAsync } from "@solidjs/router"
import clsx from "clsx"
import { For } from "solid-js"
import { IconTwitch, IconX, RoleIcon, TierIcon } from "~/components/Icons"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
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
                            <TableHead>Rank</TableHead>
                            <TableHead>W/R</TableHead>
                            <TableHead>Socials</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <For each={players()}>
                            {(user) => (
                                <TableRow>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage
                                                src={user.team?.avatar}
                                                alt={user.team?.name}
                                                class={clsx({
                                                    "filter-none dark:invert": user.team?.avatar.includes("g2.svg"),
                                                    "invert dark:filter-none": user.team?.avatar.includes("tl.svg"),
                                                    "dark:bg-white": user.team?.avatar.includes("100t.svg"),
                                                })}
                                            />
                                            <AvatarFallback>{user.team?.name}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>{user.display}</TableCell>
                                    <TableCell>
                                        <Button
                                            as="a"
                                            href={`https://www.op.gg/summoners/euw/${user.account.username}-${user.account.riotId}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            variant={"link"}
                                        >
                                            {user.account.username}#{user.account.riotId}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <RoleIcon role={user.role} />
                                    </TableCell>
                                    <TableCell>{user.stats?.tier && <TierIcon tier={user.stats?.tier} />}</TableCell>
                                    <TableCell>
                                        <Progress
                                            value={user.stats?.percentage ?? 0}
                                            fill={(user.stats?.percentage ?? 0 > 50) ? "bg-green-500" : "bg-danger"}
                                            getValueLabel={() =>
                                                `${user.stats?.wins ?? 0}W ${user.stats?.losses}L at ${user.stats?.percentage.toFixed(2)}% W/R`
                                            }
                                        >
                                            <ProgressValueLabel />
                                        </Progress>
                                    </TableCell>
                                    <TableCell>
                                        <div class="grid grid-cols-2">
                                            <For each={user.socials ?? []}>
                                                {(social) => (
                                                    <>
                                                        {social.kind === "X" && (
                                                            <a
                                                                href={`https://x.com/${social.value}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                class="size-4"
                                                            >
                                                                <IconX />
                                                            </a>
                                                        )}
                                                        {social.kind === "Twitch" && (
                                                            <a
                                                                href={`https://www.twitch.tv/${social.value}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                class="size-4"
                                                            >
                                                                <IconTwitch />
                                                            </a>
                                                        )}
                                                    </>
                                                )}
                                            </For>
                                        </div>
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
