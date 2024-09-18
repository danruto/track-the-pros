export type TSocialKind = "X" | "Twitch"
export type TRole = "Top" | "Jungle" | "Mid" | "Bot" | "Support" | "Coach" | "Fill"

export interface ITeam {
    name: string
    avatar: string
}

export interface ISocial {
    kind: TSocialKind
    value: string
}

export interface IStat {
    wins: number
    losses: number
    percentage: number
    tier: string
    lp: number
}

export interface IAccount {
    username: string
    riotId: string
}

export interface IPlayer {
    display: string

    role: TRole
    team: ITeam | null
    avatar: string | null

    account: IAccount

    socials?: ISocial[]
}

export interface IPlayerResponse extends IPlayer {
    stats?: IStat
}
