// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server"

// import { db } from "~/api/db/sqlite"

import { db } from "~/api/db/supa"
import { seed_sqlite, seed_supa } from "~/drizzle/seed"

if (process.env.RUN_SEED) {
    // seed_sqlite(db)
    seed_supa(db)
}

export default createHandler(() => (
    <StartServer
        document={({ assets, children, scripts }) => (
            <html lang="en">
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>Tracking The Pros - Worlds 2024 | By Pixel Brush</title>
                    <meta
                        property="og:title"
                        content="League of Legends Worlds 2024 Pro Player bootcamp accounts tracking"
                    />
                    <meta name="keywords" content="League of Legends, LoL, Worlds 2024, Faker, Bootcamp" />
                    <meta
                        name="description"
                        content="League of Legends Worlds 2024 Pro Player bootcamp accounts tracking"
                    />
                    <meta
                        property="og:description"
                        content="League of Legends Worlds 2024 Pro Player bootcamp accounts tracking"
                    />
                    <meta property="og:site_name" content="Tracking The Pros - Worlds 2024 | By Pixel Brush" />
                    <meta property="og:type" content="website" />
                    <link rel="icon" href="/favicon.ico" />
                    {assets}
                </head>
                <body>
                    <div id="app">{children}</div>
                    {scripts}
                </body>
            </html>
        )}
    />
))
