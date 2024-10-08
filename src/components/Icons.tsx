import { type ComponentProps, splitProps } from "solid-js"

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

export function IconChevronDown(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M6 9 12 15 18 9" />
        </Icon>
    )
}

export function IconChevronUp(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M18 15 12 9 6 15" />
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

export function IconGithub(props: IconProps) {
    return (
        <Icon {...props}>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
        </Icon>
    )
}

export function RoleIcon(props: { role: TRole }) {
    const src = getOptimisedImageUrl({ url: `/positions/${props.role.toLocaleLowerCase()}.png` })
    const alt = props.role.toLocaleLowerCase()

    return <img src={src} title={alt} alt={alt} class="w-[24px] invert dark:filter-none" />
}

export function TierIcon(props: { tier: string }) {
    const src = getOptimisedImageUrl({ url: `/emblems/${props.tier.toLocaleLowerCase()}.png` })
    const alt = props.tier.toLocaleLowerCase()

    return <img src={src} title={alt} alt={alt} class="w-[24px]" />
}

export function getOptimisedImageUrl({
    url,
    width = 24,
    quality = 75,
}: { url: string; width?: number; quality?: number }): string {
    return process.env.VERCEL_ENV === "production"
        ? `_vercel/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`
        : url
}
