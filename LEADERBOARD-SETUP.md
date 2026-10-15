# Connect the global leaderboard

The game remains on Vercel. Neon hosts the PostgreSQL database; no server rental is needed.

1. Sign in to Vercel and open the existing CatAstrophe project.
2. Open Storage and create/connect a Neon PostgreSQL database through the Marketplace. Select the Free plan if offered; check its current limits before confirming. Choose a region near your Vercel functions.
3. Connect the database to this project. Confirm the Production environment has `DATABASE_URL` (use the Neon connection string if the integration chose another variable name). Never put it in browser code or Git.
4. Open the Neon SQL editor for the connected production database and run `database/schema.sql` from this project. It is safe to rerun.
5. Generate a signing secret locally: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Add the value as the server-only Vercel environment variable `LEADERBOARD_SECRET`. Do not commit the value.
6. Commit and push the changes, including `api/`, `server/`, `database/`, `package-lock.json`, and the rebuilt game. Redeploy after adding environment variables. Existing `vercel.json` leaves `/api/leaderboard` available to the Vercel function.
7. On the deployed site, open Global top 100. It should show an empty board. Play a real flight, enter a nickname on the flight report, and submit. Check the result from a second browser.

Production and preview deployments should use separate Neon branches/databases. Do not connect untrusted preview code to production credentials. For local full-stack testing, use Vercel CLI's `vercel dev` with server environment variables; `npm start` serves the offline game only.

## Behavior

- Separate Classic all-time and Daily boards. Daily dates and game seeds use UTC, resetting at midnight UTC.
- Each board retains its top 100 flights; repeat nicknames are allowed, and names are not authenticated identities. Ties favor earlier submissions.
- Daily history is retained for 30 days. Submission IDs are retained for 25 hours to prevent replay even after scores fall out of the top 100. Tickets expire after 24 hours.
- Nicknames are public, limited to 20 characters, and rendered as text. Do not enter personal information.
- Requests to start/submit flights are limited to 20 per minute per hashed IP; raw IP addresses are not stored. SQL ranking/pruning is transactional and serialized.
- Offline, unconfigured, or unavailable leaderboard service never blocks local play or progress. Practice and developer runs cannot submit through the game UI.
- Signed start tickets, elapsed-time checks and score limits reject basic tampering. This is a casual leaderboard, not replay-verified anti-cheat: a modified client can fabricate plausible results. Server replay verification and moderation would be needed for competitive prizes.

## Lives

Flights begin with zero extra rescues. Heart pickups add one, capped at two. An unprotected lethal hit consumes one rescue and grants 1.5 seconds of protection; armor and yarn escapes do not spend rescues. Floor and ceiling now honor protection just like obstacles. The HUD always displays the current rescue count out of two. New flights reset both remaining and used rescues.
