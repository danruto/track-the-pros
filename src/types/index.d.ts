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
    win: number
    loss: number
    percentage: number
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

    accounts: IAccount[]

    socials?: ISocial[]
}

export interface IPlayerResponse extends IPlayer {
    stats?: IStat
}
