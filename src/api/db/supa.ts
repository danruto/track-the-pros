import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const connectionString = process.env.SUPABASE_DB_CONNSTRING

if (!connectionString) throw new Error("Unable to setup supabase database without connection string")

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false })
export const db: PostgresJsDatabase = drizzle(client)
