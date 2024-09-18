import { useLocation } from "@solidjs/router"
import { ModeToggle } from "./DarkModeToggle"

export default function Nav() {
    const location = useLocation()
    const active = (path: string) =>
        path === location.pathname ? "border-sky-600" : "border-transparent hover:border-sky-600"
    return (
        <nav class="grid grid-cols-4 gap-4">
            <ul class="col-span-2 grid grid-cols-2 gap-2">
                <li class={`border-b-2 ${active("/")} flex justify-center content-center`}>
                    <a class="m-auto" href="/">
                        Home
                    </a>
                </li>
                <li class={`border-b-2 ${active("/track")} flex justify-center content-center`}>
                    <a class="m-auto" href="/track">
                        Worlds 2024
                    </a>
                </li>
            </ul>

            <div class="col-end-10 col-start-11">
                <ModeToggle />
            </div>
        </nav>
    )
}
