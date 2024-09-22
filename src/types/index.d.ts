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
    id: number
    puuid?: string
    username: string
    riotId: string
    playerId: number
}

export interface IPlayer {
    id: number
    display: string

    role: TRole
    team: ITeam
    avatar: string | null

    account: IAccount

    socials?: ISocial[]
}

export interface IPlayerResponse extends IPlayer {
    stats?: IStat
}
