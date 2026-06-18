---
name: DB schema push is a required bootstrap step
description: The api-server's on-startup seed assumes tables already exist; drizzle-kit push must be run separately first.
---

The api-server runs `seedIfEmpty()` on startup, but it does NOT create tables — it only INSERTs/queries rows. If the database has no schema yet, startup logs `Seed failed ... relation "topics" does not exist` and every course/topics/overview route returns 500, even though `/api/healthz` still returns ok.

**Fix / bootstrap order:** run `pnpm --filter @workspace/db run push` (drizzle-kit push, config at `lib/db/drizzle.config.ts`) to create/sync the schema, THEN restart the api-server workflow so the seed can populate content.

**Why:** schema creation and content seeding are separate concerns here — there is no auto-migrate-on-boot. A fresh DB (or a newly-provisioned platform DB) starts empty, so a green healthz + a bumped SEED_CONTENT_VERSION is not proof the app works; you must confirm the seed actually completed (`Seed complete topics:N`) or hit a content route.

**How to apply:** any time the DB looks empty, was reprovisioned, or seed fails with `relation ... does not exist`, push the schema first, then restart to reseed.
