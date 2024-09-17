import type { APIEvent } from "@solidjs/start/server"
import type { IUser } from "~/types"
import { getCookie } from "vinxi/http"

const DATA: IUser[] = [
    {
        username: "TheShackledOne",
        riotId: "003",
        display: "Caps",
        role: "Mid",
        team: {
            name: "G2",
            avatar: "",
        },
        avatar: null,
        socials: [
            {
                kind: "Twitch",
                value: "https://www.twitch.tv/caps",
            },
        ],
    },
]

function update() {
    // Only update if the cache has expired
}

function getLatest() {
    //
    return DATA
}

export async function GET({ params }: APIEvent) {
    update()

    // TODO: pagination

    return getLatest()
}
