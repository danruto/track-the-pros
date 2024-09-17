export default {
    dialect: "sqlite",
    schema: "./src/drizzle/schema.ts",
    out: "./src/drizzle/migrations/",
    // driver: "better-sqlite",
    dbCredentials: {
        url: "./src/drizzle/db.sqlite",
    },
}
