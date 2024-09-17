
export type TSocialKind = 'X' | 'Twitch'
export type TRole = 'Top' | 'Jungle' | 'Mid' | 'Bot' | 'Support' | 'Coach' | 'Fill'

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

export interface IUser {
    username: string
    riotId: string

    display: string

    role: TRole
    team: ITeam | null
    avatar: string | null

    socials: ISocial[]
}

export interface IUserResponse extends IUser {
    stats: IStat
}

