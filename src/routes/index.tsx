import { cache, createAsync } from "@solidjs/router"
import { For, Show, createSignal } from "solid-js"

import { IconTwitch, IconX, RoleIcon, TierIcon, getOptimisedImageUrl } from "~/components/Icons"
import { TableHeadWithSort } from "~/components/TableHeadWithSort"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { Progress } from "~/components/ui/progress"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { TextField, TextFieldInput } from "~/components/ui/text-field"

import { fetchPlayer } from "~/lib/riot"
import { cn } from "~/lib/utils"
import type { IPlayerResponse, TTiers as TTier } from "~/types"

const serverGetPlayers = cache(async (opts: { limit?: number; offset?: number }): Promise<IPlayerResponse[]> => {
    "use server"

    return await fetchPlayer(opts.limit ?? 120, opts.offset ?? 0)
}, "getPlayers")

export const route = {
    load: () => serverGetPlayers({}),
}

const Tiers: Record<TTier, number> = {
    CHALLENGER: 10,
    GRANDMASTER: 9,
    MASTER: 8,
    DIAMOND: 7,
    EMERALD: 6,
    PLATINUM: 5,
    GOLD: 4,
    SILVER: 3,
    BRONZE: 2,
    IRON: 1,
    UNRANKED: 0,
} as const

const compareTiers = (a: TTier, b: TTier): number => {
    if (a === b) return 0

    return Tiers[a] > Tiers[b] ? 1 : -1
}

export default function Home() {
    const players = createAsync(() => serverGetPlayers({}), { initialValue: [], deferStream: true })

    const [filter, setFilter] = createSignal("")

    const [sortBy, setSortBy] = createSignal<"Default" | "LP" | "WR" | "Team" | "Role">("Default")
    const [sortDirection, setSortDirection] = createSignal<"DESC" | "ASC">("ASC")

    return (
        <main
            class={cn("container mx-auto px-8 min-h-dvh", {
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
                <Show when={sortBy() !== "Default"}>
                    <Button
                        class="mt-0 mb-4"
                        variant={"outline"}
                        onClick={() => {
                            setSortBy("Default")
                            setSortDirection("ASC")
                        }}
                    >
                        Reset Sort
                    </Button>
                </Show>
                <Table>
                    <TableCaption>
                        <p class="py-4">Tracking The Pros - Worlds 2024 | Presented by Pixel Brush</p>
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHeadWithSort
                                class="w-[60px]"
                                text="Team"
                                onClick={() => {
                                    setSortBy("Team")
                                    setSortDirection(sortDirection() === "DESC" ? "ASC" : "DESC")
                                }}
                                selected={sortBy() === "Team"}
                                direction={sortDirection()}
                            />
                            <TableHead class="w-[100px]">Player</TableHead>
                            <TableHead>Account</TableHead>
                            <TableHeadWithSort
                                text="Role"
                                onClick={() => {
                                    setSortBy("Role")
                                    setSortDirection(sortDirection() === "DESC" ? "ASC" : "DESC")
                                }}
                                selected={sortBy() === "Role"}
                                direction={sortDirection()}
                            />
                            <TableHeadWithSort
                                text="Rank"
                                onClick={() => {
                                    setSortBy("LP")
                                    setSortDirection(sortDirection() === "DESC" ? "ASC" : "DESC")
                                }}
                                selected={sortBy() === "LP"}
                                direction={sortDirection()}
                            />
                            <TableHeadWithSort
                                text="W/R"
                                onClick={() => {
                                    setSortBy("WR")
                                    setSortDirection(sortDirection() === "DESC" ? "ASC" : "DESC")
                                }}
                                selected={sortBy() === "WR"}
                                direction={sortDirection()}
                            />
                            <TableHead>Socials</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <For
                            each={players()
                                .filter((player) => {
                                    if (filter()) {
                                        const isDisplay = player.display.toLocaleLowerCase().includes(filter())
                                        const isTeam = player.team?.name.toLocaleLowerCase().includes(filter())
                                        const isRiotId = player.account.riotId.toLocaleLowerCase().includes(filter())
                                        const isSummoner = player.account.username
                                            .toLocaleLowerCase()
                                            .includes(filter())
                                        const isTier = player.stats?.tier.toLocaleLowerCase().includes(filter())
                                        const isRole = player.role.toLocaleLowerCase().includes(filter())

                                        return isDisplay || isTeam || isRiotId || isSummoner || isTier || isRole
                                    }

                                    return true
                                })
                                .sort(
                                    sortBy() !== "Default"
                                        ? (a, b) => {
                                              if (sortBy() === "Team") {
                                                  return sortDirection() === "DESC"
                                                      ? a.team.name.localeCompare(b.team.name)
                                                      : b.team.name.localeCompare(a.team.name)
                                              }
                                              if (sortBy() === "Role") {
                                                  return sortDirection() === "DESC"
                                                      ? a.role.localeCompare(b.role)
                                                      : b.role.localeCompare(a.role)
                                              }
                                              if (sortBy() === "LP" && a.stats && b.stats) {
                                                  // If tiers are the same, then sort by LP only
                                                  if (a.stats.tier === b.stats.tier) {
                                                      return sortDirection() === "DESC"
                                                          ? a.stats?.lp > b.stats?.lp
                                                              ? -1
                                                              : 1
                                                          : b.stats?.lp > a.stats?.lp
                                                            ? -1
                                                            : 1
                                                  }

                                                  const result = compareTiers(
                                                      a.stats.tier as TTier,
                                                      b.stats.tier as TTier,
                                                  )
                                                  return sortDirection() === "DESC" ? result : -result
                                              }
                                              if (sortBy() === "WR" && a.stats && b.stats) {
                                                  return sortDirection() === "DESC"
                                                      ? a.stats?.percentage > b.stats?.percentage
                                                          ? -1
                                                          : 1
                                                      : b.stats?.percentage > a.stats?.percentage
                                                        ? -1
                                                        : 1
                                              }

                                              return 0
                                          }
                                        : undefined,
                                )}
                        >
                            {(player) => (
                                <TableRow>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage
                                                src={getOptimisedImageUrl({ url: player.team.avatar, width: 48 })}
                                                title={player.team?.name}
                                                alt={player.team?.name}
                                                class={cn({
                                                    "filter-none dark:invert": ["g2.svg", "dk.svg"].some((file) =>
                                                        player.team?.avatar.includes(file),
                                                    ),
                                                    "invert dark:filter-none": player.team?.avatar.includes("tl.svg"),
                                                    "dark:bg-white": [
                                                        "100t.svg",
                                                        "png.svg",
                                                        "psg.svg",
                                                        "shg.svg",
                                                        "hle.svg",
                                                    ].some((file) => player.team?.avatar.includes(file)),
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
                                                        class={cn({
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
