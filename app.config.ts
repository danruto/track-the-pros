import { defineConfig } from "@solidjs/start/config"
// import tsconfigPaths from "vite-tsconfig-paths"
import { join } from "node:path"

export default defineConfig({
    vite: {
        ssr: { external: ["drizzle-orm"] },
        // plugins: [tsconfigPaths()],
        resolve: {
            alias: {
                // "~/drizzle": join(process.cwd(), "drizzle"),
            },
        },
    },
    server: {
        preset: "vercel",
    },
})
