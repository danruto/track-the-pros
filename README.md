# Tracking the Pros - Worlds 2024

Just a simple application in solid-start to showcase how to build an application in it and well have a nicer
interface to track known accounts of the pro players for Worlds 2024

[Click Here for the site](https://worlds2024.pixelbru.sh)

[Click Here for my portfolio](https://pixelbru.sh)

## Developing

Install the dependencies using `pnpm install`, any of the auxiliry cli apps e.g. `biome` can be installed using the included
nix flake and direnv `direnv allow`

## Database
To run the database migration, simply run the commands 
If there are no migrations in the folder then run `pnpm db:gen` first
Otherwise, you can run `pnpm db:migrate`

On the first run of the app, it will seed the database.
You can choose to also seed it yourself with a simple node wrapper calling the function `seed_supa` from `src/drizzle/seed`

## Running

You will need to generate a Riot API key and save that into `.env` as `RIOT_API_KEY`. 

A `supabase` connection string is also required under the name `SUPABASE_DB_CONNSTRING`. 
Alternatively you can instead provide `SUPABASE_DB_HOST`, `SUPABASE_DB_PORT`, `SUPABASE_DB_PW` and `SUPABASE_PROJECT_ID`
which will generate the connection string. If all are provided, `SUPABASE_DB_CONNSTRING` takes priority.

Once those two things are in place, you can then just run it.

> **NOTE**
> I use `Nix` and `Direnv` so I do not need to use any `dotenv` type loaders. If you don't then you'll need to setup one of those yourself
