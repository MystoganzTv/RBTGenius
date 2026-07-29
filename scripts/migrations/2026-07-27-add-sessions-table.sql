-- Multiple concurrent sessions per user.
--
-- Until now `users` held a single `token` column, so one account could only
-- have one live session anywhere. Signing in on the iPhone silently killed the
-- web session and vice versa, which read to users as "it logs me out every few
-- days". Signing out on one device signed you out everywhere too.
--
-- This table stores one row per device session. `users.token` is deliberately
-- left in place: the backfill below copies existing sessions across so nobody
-- is signed out by the deploy, and the lookup falls back to `users.token` for
-- any session issued before this migration ran.
--
-- Deployment order:
--   1. Run this file once against the production database.
--   2. Deploy the API code that reads and writes this table.
--   3. Release the next mobile build.
-- The migration is additive and does not change authentication behavior until
-- the new API code is deployed.

CREATE TABLE IF NOT EXISTS public.sessions (
  token        TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  issued_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at   TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  platform     TEXT
);

CREATE INDEX IF NOT EXISTS idx_sessions_user
  ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires
  ON public.sessions(expires_at);

-- Backfill: carry every currently valid session into the new table so the
-- deploy is invisible to signed-in users.
INSERT INTO public.sessions (token, user_id, issued_at, expires_at, last_seen_at, platform)
SELECT
  u.token,
  u.id,
  COALESCE(u.token_issued_at, NOW()),
  COALESCE(u.token_expires_at, NOW() + INTERVAL '365 days'),
  NOW(),
  'migrated'
FROM public.users u
WHERE u.token IS NOT NULL
  AND (u.token_expires_at IS NULL OR u.token_expires_at > NOW())
ON CONFLICT (token) DO NOTHING;

-- Session tokens must never be readable through Supabase's public Data API.
-- The backend connects directly to Postgres and remains able to manage them.
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
