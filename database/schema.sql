-- Run once in your Neon SQL editor. Safe to rerun.
CREATE TABLE IF NOT EXISTS cat_scores (
 run_id uuid PRIMARY KEY, board text NOT NULL CHECK(board IN ('classic','daily')),
 flight_date text NOT NULL, name varchar(20) NOT NULL, score integer NOT NULL CHECK(score>0),
 cat text NOT NULL CHECK(cat IN ('biscuit','mochi','pounce')), created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cat_scores_order ON cat_scores(board,flight_date,score DESC,created_at,run_id);
CREATE TABLE IF NOT EXISTS cat_submissions(run_id uuid PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS cat_limits(client_key text PRIMARY KEY, window_start timestamptz NOT NULL, requests integer NOT NULL);
CREATE OR REPLACE FUNCTION cat_rate_limit(k text) RETURNS boolean LANGUAGE plpgsql AS $$
DECLARE n integer;
BEGIN
 DELETE FROM cat_limits WHERE window_start<now()-interval '1 day';
 INSERT INTO cat_limits VALUES(k,date_trunc('minute',now()),1)
 ON CONFLICT(client_key) DO UPDATE SET
 requests=CASE WHEN cat_limits.window_start=date_trunc('minute',now()) THEN cat_limits.requests+1 ELSE 1 END,
 window_start=date_trunc('minute',now()) RETURNING requests INTO n;
 RETURN n<=20;
END $$;
CREATE OR REPLACE FUNCTION cat_submit_score(r uuid,b text,d text,n text,s integer,c text) RETURNS boolean LANGUAGE plpgsql AS $$
BEGIN
 -- Serialize ranking/pruning, so concurrent submissions cannot leave more than one hundred.
 PERFORM pg_advisory_xact_lock(734191);
 DELETE FROM cat_submissions WHERE created_at<now()-interval '25 hours';
 INSERT INTO cat_submissions(run_id) VALUES(r) ON CONFLICT DO NOTHING;
 IF NOT FOUND THEN RETURN false; END IF;
 INSERT INTO cat_scores(run_id,board,flight_date,name,score,cat) VALUES(r,b,d,n,s,c);
 DELETE FROM cat_scores WHERE board=b AND flight_date=d AND run_id NOT IN
 (SELECT run_id FROM cat_scores WHERE board=b AND flight_date=d ORDER BY score DESC,created_at ASC,run_id ASC LIMIT 100);
 DELETE FROM cat_scores WHERE board='daily' AND flight_date<to_char(now() AT TIME ZONE 'UTC'-interval '30 days','YYYY-MM-DD');
 RETURN true;
END $$;
