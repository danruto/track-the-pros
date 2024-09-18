const sqlite = {
    dialect: "sqlite",
    schema: "./src/drizzle/schema-sqlite.ts",
    out: "./src/drizzle/migrations-sqlite/",
    // driver: "better-sqlite",
    dbCredentials: {
        url: "./src/drizzle/db.sqlite",
    },
}

const supa = {
    dialect: "postgresql",
    schema: "./src/drizzle/schema-supa.ts",
    out: "./src/drizzle/migrations-supa/",
    dbCredentials: {
        url: process.env.SUPABASE_DB_CONNSTRING,
    },
}

// export default sqlite
export default supa
