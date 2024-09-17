import { A, cache, createAsync } from "@solidjs/router"
import { eq } from "drizzle-orm"
import { For } from "solid-js"

import { db } from "~/api/db"
import { Accounts, Players, Teams } from "~/drizzle/schema"
import type { IPlayerResponse } from "~/types"

const serverGetUsers = cache(async (): Promise<IPlayerResponse[]> => {
    "use server"

    // Fetch all accounts and mangle the types to something we can use on the frontend
    const ret = await db
        .select({
            display: Players.display,
            role: Players.role,
            team: Teams.name,
            avatar: Players.avatar,
            accounts: {
                username: Accounts.username,
                riotId: Accounts.riot_id,
            },
        })
        .from(Players)
        .leftJoin(Accounts, eq(Players.id, Accounts.player_id))
        .leftJoin(Teams, eq(Teams.id, Players.id))

    if (ret) {
        console.log("Got ret", { ret })
        return ret as unknown as IPlayerResponse[]
    }

    return []
}, "getUsers")

export const route = {
    load: () => serverGetUsers(),
}

export default function Track() {
    const users = createAsync(() => serverGetUsers())

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
                <For each={users()}>{(user) => <li>{user.display}</li>}</For>
            </div>
        </main>
    )
}
