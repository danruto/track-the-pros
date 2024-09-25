import { ModeToggle } from "./DarkModeToggle"
import { Button } from "./ui/button"
import { IconGithub } from "./Icons"

export default function Nav() {
    return (
        <nav class="grid grid-cols-4 gap-4 container mx-auto p-8 pb-0">
            <Button
                as="a"
                href="https://pixelbru.sh"
                rel="noreferrer"
                target="_blank"
                variant="link"
                class="justify-start lg:text-2xl text-sm font-extrabold font-pixelify [text-wrap:balance] bg-clip-text text-transparent bg-gradient-to-r from-indigo-200/60 to-70% to-indigo-400/80 break-words"
            >
                PIXEL BRUSH
            </Button>

            <div class="col-end-8 col-start-8 gap-4 flex justify-center content-center">
                <Button
                    as="a"
                    href="https://www.github.com/danruto/track-the-pros"
                    type="button"
                    variant="ghost"
                    size="sm"
                    target="_blank"
                    rel="noreferrer"
                >
                    <IconGithub class="size-6" />
                </Button>
                <ModeToggle />
            </div>
        </nav>
    )
}
