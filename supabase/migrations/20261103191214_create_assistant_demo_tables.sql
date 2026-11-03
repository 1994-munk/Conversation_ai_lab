/*
# Create assistant demo tables

1. New Tables
- `assistant_messages`: one row per chat message in the live assistant demo.
  - `id` (uuid, primary key)
  - `session_id` (uuid, groups messages into one conversation)
  - `role` ('user' or 'assistant')
  - `content` (text, max 2000 characters)
  - `intent` (text, the detected intent for assistant replies)
  - `sources` (jsonb, retrieved knowledge base documents used for a reply)
  - `guardrails` (jsonb, guardrail checks that fired for the message)
  - `latency_ms` (integer, time taken to produce the reply)
  - `created_at` (timestamptz)
- `eval_runs`: results of automated retrieval evaluations run from the demo.
  - `id` (uuid, primary key)
  - `score` (numeric, 0 to 1)
  - `passed` (integer), `total` (integer)
  - `details` (jsonb, per-case results)
  - `created_at` (timestamptz)

2. Security
- Row level security is enabled on both tables.
- The demo has no sign-in, so the public anon key and signed-in users are granted the verbs the demo uses.
- Data is intentionally public portfolio demo data. Content length is capped to limit abuse.

3. Notes
- Both statements are idempotent and safe to re-run.
*/

CREATE TABLE IF NOT EXISTS assistant_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  intent text,
  sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  guardrails jsonb NOT NULL DEFAULT '[]'::jsonb,
  latency_ms integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS assistant_messages_session_idx
  ON assistant_messages (session_id, created_at);

ALTER TABLE assistant_messages ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON assistant_messages TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_assistant_messages" ON assistant_messages;
CREATE POLICY "anon_select_assistant_messages" ON assistant_messages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_assistant_messages" ON assistant_messages;
CREATE POLICY "anon_insert_assistant_messages" ON assistant_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_assistant_messages" ON assistant_messages;
CREATE POLICY "anon_delete_assistant_messages" ON assistant_messages FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS eval_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  score numeric NOT NULL CHECK (score >= 0 AND score <= 1),
  passed integer NOT NULL CHECK (passed >= 0),
  total integer NOT NULL CHECK (total > 0),
  details jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE eval_runs ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON eval_runs TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_eval_runs" ON eval_runs;
CREATE POLICY "anon_select_eval_runs" ON eval_runs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_eval_runs" ON eval_runs;
CREATE POLICY "anon_insert_eval_runs" ON eval_runs FOR INSERT
  TO anon, authenticated WITH CHECK (true);
