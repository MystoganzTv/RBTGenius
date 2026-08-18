-- Fail closed for Supabase's public Data API (PostgREST).
--
-- Supabase's security advisor flagged `rls_disabled_in_public` on this project
-- (kfmoxsgoigihfvqvdxbu) on 2026-08-17. Every table in the `public` schema is
-- exposed through the project's REST endpoint, so a table without Row-Level
-- Security can be read — and written — by anyone holding the project URL and
-- the anon key.
--
-- This application never uses the Data API: `api/lib/db.js` opens a direct
-- Postgres connection with DATABASE_URL and there is no supabase-js dependency
-- anywhere in the repo (web or mobile). Enabling RLS with **no policies**
-- therefore blocks the Data API completely while leaving the backend
-- untouched, because the role behind DATABASE_URL is the table owner and
-- owners bypass RLS unless FORCE ROW LEVEL SECURITY is set.
--
-- `sessions` (2026-07-27) and `user_daily_activity` (2026-08-12) already did
-- this. This migration applies the same rule to every remaining table and to
-- any table added later, so the advisor stays clean.
--
-- Idempotent: safe to re-run.

DO $$
DECLARE
  t record;
BEGIN
  FOR t IN
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'          -- ordinary tables only
      AND c.relrowsecurity = FALSE -- skip the ones already protected
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.relname);
    RAISE NOTICE 'RLS enabled on public.%', t.relname;
  END LOOP;
END $$;

-- Verification: every row must show rls_enabled = true and policies = 0.
SELECT
  c.relname AS table_name,
  c.relrowsecurity AS rls_enabled,
  (SELECT count(*) FROM pg_policy p WHERE p.polrelid = c.oid) AS policies
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
ORDER BY c.relname;
