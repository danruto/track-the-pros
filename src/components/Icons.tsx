import { splitProps, type ComponentProps } from "solid-js"

import { cn } from "~/lib/utils"
import type { TRole } from "~/types"

type IconProps = ComponentProps<"svg">

const Icon = (props: IconProps) => {
    const [, rest] = splitProps(props, ["class"])
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class={cn("size-4", props.class)}
            {...rest}
        />
    )
}

export function IconLaptop(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M3 19l18 0" />
            <path d="M5 6m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" />
        </Icon>
    )
}

export function IconSun(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
            <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
        </Icon>
    )
}

export function IconMoon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
        </Icon>
    )
}

export function IconTwitch(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7" />
        </Icon>
    )
}

export function IconX(props: IconProps) {
    return (
        <Icon {...props}>
            <polygon class="st0" points="21.3,21.1 9.9,2.9 2.7,2.9 14.1,21.1 " />
            <line class="st0" x1="2.7" y1="21.1" x2="9.9" y2="14.5" />
            <line class="st0" x1="14.1" y1="9.5" x2="21.3" y2="2.9" />
        </Icon>
    )
}

export function RoleIcon(props: { role: TRole }) {
    const src = `/positions/${props.role.toLocaleLowerCase()}.png`
    const alt = props.role.toLocaleLowerCase()

    return <img src={src} alt={alt} class="w-[24px] invert dark:filter-none" />
}

export function TierIcon(props: { tier: string }) {
    const src = `/emblems/${props.tier.toLocaleLowerCase()}.png`
    const alt = props.tier.toLocaleLowerCase()

    return <img src={src} alt={alt} class="w-[24px]" />
}
