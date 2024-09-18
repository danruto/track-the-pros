import { A } from "@solidjs/router"
import { Button } from "~/components/ui/button"

export default function Home() {
    return (
        <main class="text-center mx-auto text-gray-700 p-4 h-dvh">
            <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Tracking The Pros - Worlds 2024</h1>
            <p class="text-white">This is just a nice sample application using solid-start</p>
            <p class="text-white">If the source code is not of interest to you, just click the button below</p>

            <div class="my-4">
                <Button as={A} href="/track" variant={"default"}>
                    Track the pros!
                </Button>
            </div>
        </main>
    )
}
