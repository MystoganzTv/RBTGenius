-- Daily member activity for the admin dashboard.
--
-- Study history can be reconstructed from attempts and mock exams, but an
-- authenticated visit with no answered question used to leave no durable
-- trace. This compact table stores one row per member per Eastern Time day.
-- It contains no session tokens and is only written/read by the backend.

CREATE TABLE IF NOT EXISTS public.user_daily_activity (
  user_id       TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  request_count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, activity_date)
);

CREATE INDEX IF NOT EXISTS idx_user_daily_activity_last_seen
  ON public.user_daily_activity(last_seen_at DESC);

-- Preserve the latest known day for currently retained sessions. This is a
-- conservative one-day backfill, not an invented historical visit series.
INSERT INTO public.user_daily_activity (
  user_id,
  activity_date,
  first_seen_at,
  last_seen_at,
  request_count
)
SELECT
  user_id,
  (last_seen_at AT TIME ZONE 'America/New_York')::date,
  MIN(last_seen_at),
  MAX(last_seen_at),
  1
FROM public.sessions
GROUP BY user_id, (last_seen_at AT TIME ZONE 'America/New_York')::date
ON CONFLICT (user_id, activity_date) DO UPDATE SET
  first_seen_at = LEAST(public.user_daily_activity.first_seen_at, EXCLUDED.first_seen_at),
  last_seen_at = GREATEST(public.user_daily_activity.last_seen_at, EXCLUDED.last_seen_at);

-- The table lives in Supabase's exposed public schema, so fail closed for the
-- Data API. The server connects directly to Postgres and remains able to use it.
ALTER TABLE public.user_daily_activity ENABLE ROW LEVEL SECURITY;

