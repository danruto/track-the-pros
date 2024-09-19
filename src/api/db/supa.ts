import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"

// Use connstring if it exists, otherwise generate a string
// expect one or the other

const hasRequiredEnvVars =
    process.env.SUPABASE_DB_CONNSTRING ||
    (process.env.SUPABASE_PROJECT_ID &&
        process.env.SUPABASE_DB_PW &&
        process.env.SUPABASE_DB_HOST &&
        process.env.SUPABASE_DB_PORT)

if (!hasRequiredEnvVars)
    throw new Error(
        "Either include SUPABASE_DB_CONNSTRING or have all of SUPABASE_PROJECT_ID, SUPABASE_DB_PW, SUPABASE_DB_HOST, SUPABASE_DB_PORT",
    )

let connectionString = process.env.SUPABASE_DB_CONNSTRING
if (!connectionString) {
    connectionString = `postgresql://postgres.${process.env.SUPABASE_PROJECT_ID}:${encodeURIComponent(process.env.SUPABASE_DB_PW!)}@${process.env.SUPABASE_DB_HOST}:${process.env.SUPABASE_DB_PORT}/postgres?connection_limit=1`
}

console.log("Using connection string", { connectionString })

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, {
    prepare: false,
    ssl: {
        rejectUnauthorized: false,
    },
})
export const db: PostgresJsDatabase = drizzle(client)
