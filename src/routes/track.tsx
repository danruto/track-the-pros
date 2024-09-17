import { A, cache, createAsync } from "@solidjs/router";
import { For } from "solid-js";

const serverGetUsers = cache(async () => {
    "use server"

    return [{ id: 'faker', display: 'faker seonsoo' }]

}, "getUsers")

export const route = {
    load: () => serverGetUsers(),
}

export default function Track() {
    const users = createAsync(() => serverGetUsers())

    return (
        <main>
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
