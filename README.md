# Tracking the Pros - Worlds 2024

Just a simple application in solid-start to showcase how to build an application in it and well have a nicer
interface to track known accounts of the pro players for Worlds 2024

[Click Here for the site](https://worlds2024.pixelbru.sh)

## Developing

Install the dependencies using `pnpm install`, any of the auxiliry cli apps e.g. `biome` can be installed using the included
nix flake and direnv `direnv allow`

## Running

You will need to generate a Riot API key and save that into `.env` as `RIOT_API_KEY`. A `supabase` connection string is also
required under the name `SUPABASE_DB_CONNSTRING`. Once those two things are in place, you can then just run it.
