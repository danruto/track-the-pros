import { cache, createAsync } from "@solidjs/router"
import clsx from "clsx"
import { For, createSignal } from "solid-js"

import { getOptimisedImageUrl, IconTwitch, IconX, RoleIcon, TierIcon } from "~/components/Icons"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { Progress } from "~/components/ui/progress"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { TextField, TextFieldInput } from "~/components/ui/text-field"
import { fetchPlayer } from "~/lib/riot"
import type { IPlayerResponse } from "~/types"

const serverGetPlayers = cache(async (opts: { limit?: number; offset?: number }): Promise<IPlayerResponse[]> => {
    "use server"

    return await fetchPlayer(opts.limit ?? 100, opts.offset ?? 0)
}, "getPlayers")

export const route = {
    load: () => serverGetPlayers({}),
}

export default function Home() {
    const players = createAsync(() => serverGetPlayers({}), { initialValue: [], deferStream: true })

    const [filter, setFilter] = createSignal("")

    return (
        <main
            class={clsx("container mx-auto px-8 min-h-dvh", {
                // "h-dvh": players().length < 10,
            })}
        >
            <h1 class="text-3xl text-center py-8">Tracking The Pros - Worlds 2024</h1>
            <div>
                <TextField class="py-4">
                    <TextFieldInput
                        type="text"
                        id="filter"
                        placeholder="Filter the players by anything. Try 'G2' or 'Faker'"
                        value={filter()}
                        onInput={(e) => setFilter(e.currentTarget.value)}
                    />
                </TextField>
                <Table>
                    <TableCaption>
                        <p class="py-4">Tracking The Pros - Worlds 2024 | Presented by Pixel Brush</p>
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-[60px]">Team</TableHead>
                            <TableHead class="w-[100px]">Player</TableHead>
                            <TableHead>Account</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Rank</TableHead>
                            <TableHead>W/R</TableHead>
                            <TableHead>Socials</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <For
                            each={players().filter((player) => {
                                if (filter()) {
                                    const isDisplay = player.display.toLocaleLowerCase().includes(filter())
                                    const isTeam = player.team?.name.toLocaleLowerCase().includes(filter())
                                    const isRiotId = player.account.riotId.toLocaleLowerCase().includes(filter())
                                    const isSummoner = player.account.username.toLocaleLowerCase().includes(filter())
                                    const isTier = player.stats?.tier.toLocaleLowerCase().includes(filter())
                                    const isRole = player.role.toLocaleLowerCase().includes(filter())

                                    return isDisplay || isTeam || isRiotId || isSummoner || isTier || isRole
                                }

                                return true
                            })}
                        >
                            {(player) => (
                                <TableRow>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage
                                                src={getOptimisedImageUrl({ url: player.team.avatar, width: 48 })}
                                                title={player.team?.name}
                                                alt={player.team?.name}
                                                class={clsx({
                                                    "filter-none dark:invert": player.team?.avatar.includes("g2.svg"),
                                                    "invert dark:filter-none": player.team?.avatar.includes("tl.svg"),
                                                    "dark:bg-white": ["100t.svg", "png.svg", "psg.svg", "shg.svg"].some(
                                                        (file) => player.team?.avatar.includes(file),
                                                    ),
                                                })}
                                            />
                                            <AvatarFallback>{player.team?.name}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>{player.display}</TableCell>
                                    <TableCell>
                                        <Button
                                            as="a"
                                            href={`https://www.op.gg/summoners/euw/${player.account.username}-${player.account.riotId}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            variant={"link"}
                                        >
                                            {player.account.username}#{player.account.riotId}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <RoleIcon role={player.role} />
                                    </TableCell>
                                    <TableCell>
                                        {player.stats?.tier && <TierIcon tier={player.stats?.tier} />}
                                    </TableCell>
                                    <TableCell>
                                        <Progress
                                            value={player.stats?.percentage ?? 0}
                                            fill={(player.stats?.percentage ?? 0 > 50) ? "bg-green-800" : "bg-danger"}
                                        >
                                            <div class="grid gap-2 py-2">
                                                <Label class="text-slate-400">
                                                    <span>{player.stats?.lp ?? 0}LP</span>
                                                    <span> | </span>
                                                    <span>
                                                        {(player.stats?.wins ?? 0) + (player.stats?.losses ?? 0)}G{" "}
                                                    </span>
                                                    <span class="">{player.stats?.wins ?? 0}W</span>{" "}
                                                    <span class="">{player.stats?.losses ?? 0}L</span>{" "}
                                                </Label>
                                                <Label>
                                                    <span
                                                        class={clsx({
                                                            "text-green-500 dark:text-success":
                                                                player.stats?.percentage ?? 0 > 50,
                                                            "text-danger": player.stats?.percentage ?? 0 <= 50,
                                                        })}
                                                    >
                                                        {player.stats?.percentage.toFixed(2) ?? 0}%
                                                    </span>
                                                </Label>
                                            </div>
                                        </Progress>
                                    </TableCell>
                                    <TableCell>
                                        <div class="grid grid-cols-2">
                                            <For each={player.socials ?? []}>
                                                {(social) => (
                                                    <>
                                                        {social.kind === "X" && (
                                                            <a
                                                                href={`https://x.com/${social.value}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                class="size-4"
                                                                title={social.kind}
                                                                aria-label={social.kind}
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
                                                                title={social.kind}
                                                                aria-label={social.kind}
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
