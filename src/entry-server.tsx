// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server"

// import { db } from "~/api/db/sqlite"

import { db } from "~/api/db/supa"
import { seed_sqlite, seed_supa } from "~/drizzle/seed"
// seed_sqlite(db)
seed_supa(db)

export default createHandler(() => (
    <StartServer
        document={({ assets, children, scripts }) => (
            <html lang="en">
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
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
