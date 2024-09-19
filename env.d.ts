/// <reference types="vinxi/types/client" />

interface ImportMetaEnv {
    RIOT_API_KEY: string
    SUPABASE_DB_CONNSTRING: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
