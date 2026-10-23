# Gameplay reference

## Controls and beginner practice

Player-facing instructions use short, literal actions: flap up, stop to float down, catch fish, and dodge obstacles. Menu and lesson prompts prefer tap/button controls on coarse-pointer devices and Space/↑/X on keyboard devices; both input methods remain supported. Practice is numbered 1–4, with encouraging retry/completion messages. Hearts are described as extra chances rather than starting lives. Keep future essential instructions separate from optional jokes, explain unfamiliar terms when introduced, and avoid blame when a player crashes. These changes improve readability; they have not been formally evaluated with children.

Space, Arrow Up, or pointer/touch on the sky flaps. X or the ability button activates a charged ability. P/Escape/pause button pauses; blur and hidden-tab events also pause. Native input controls retain their keyboard keys. Four safe walkthrough stages teach three flaps, three fish, pot pounce and pigeon evasion. Practice can be skipped/replayed, completion persists, and rewards never enter progression.

## Flight and cats

The logical canvas is 450×720; floor is y=660, cat x=116, collision radius 15. Base gravity is 760, flap impulse -285, maximum fall 390 and flight speed 145, with gradual speed progression. Constants live in `CatCore.C`; gameplay distances/time use logical units/seconds.

| Cat | Unlock | Physics relative to base | Ability |
| --- | --- | --- | --- |
| Luna | Free | Base | Zoomies: 100 charge, .42s dash |
| Coco | 20 fish | .82 gravity, .9 flap, .93 speed | Zoomies |
| Pepe | 45 fish | 1.08 gravity, 1.06 flap | Air Pounce: 65 charge, .28s dash |

Ability cooldown is 1.5s. Dash accelerates horizontal motion and protects briefly; tangle prevents activation. Fish adds 12 charge, successful near misses add 22, pigeon evasion adds 18; charge caps at 100. Catnip fills charge immediately.

## Hazards, worlds and mischief

Hazards cycle through laundry, pigeons, vacuum, toast, fan and yarn. Vacuums pull downward nearby; fans provide updrafts. Yarn tangles instead of killing: three taps escape or a 1.5s timer expires, with slowed movement during tangle. Worlds cycle Neighborhood → Kitchen → Dream every six cleared gates; Dream gravity is lighter. Warnings precede transitions.

The ninth cleared gate starts a ten-second Giant Vacuum encounter with wider gaps; surviving grants 40 score and five fish once. Optional pounce targets begin after the first few gates and are suppressed during the encounter. Normal contact with these targets is safe; dash contact strikes them. Pot grants 12 points/two fish and a delayed bell/pigeon; toast grants eight/three fish without pursuit; bell grants ten/two fish and a pigeon. Evading a warned pigeon grants eight points/one fish. Rewards are once-only and appear in the crime report.

## Hearts and protection

Every fresh flight starts with **zero extra rescues**. Each distinct heart pickup adds one, capped at two. The HUD displays remaining rescues as `♥ n / 2`; this is not the number of total allowed flights.

An unprotected lethal obstacle or boundary hit consumes one rescue, increments usedRescues, repositions/bounces the cat and grants **1.5s protection**. Repeated hits during protection do not consume another rescue. Floor/ceiling clamp and bounce while protected; they remain lethal after protection expires when no rescues remain.

Obstacle recovery priority is existing protection/ignored gate → yarn tangle → cardboard armor → rescue → death. Armor consumes its one-impact protection before a rescue on obstacle hits. Armor is not a boundary-rescue substitute. Yarn escape and armor do not spend rescues. Buffs/rescues do not carry into a restarted run; pause freezes timers.

| Collectible | Effect |
| --- | --- |
| Fish / golden / mystery | 1 / 5 / random 1–4 fish; three score per fish |
| Catnip | 8s double collectible fish, charge filled |
| Magnet | 7s pull for nearby fish/gold/mystery |
| Box | Up to 8s armor, consumed on one obstacle hit |
| Heart | One rescue, maximum two |
| Yarn token | Outfit currency, separate from fish |

## Score and progression

Distance awards one point per 80 distance units. Cleared gates add ten. Near misses add five times the combo, credited only after clearance; combo caps at five and expires after seven seconds. Protected hits do not qualify. World transitions add twenty. Fish, encounter and mischief bonuses are accounted for separately in results.

Completed real flights bank fish/tokens and update local best, totals, missions, achievements and Daily best. Practice/lab never settle. Missions award once. Aviator goggles cost 15 fish; cardboard crown costs three tokens. Purchases/currencies are local to the browser origin/profile, not the leaderboard identity.

## Global scores and Daily

Classic retains the top 100 all-time flights, across all playable cats. Daily retains the top 100 for the current **UTC date**, forces Luna and uses a date-derived seed. Mystery reward collection does not advance course RNG. At midnight UTC the public Daily board changes; a previous day's ticket can no longer submit. Ties favor earlier submission, then run ID. One nickname can appear on multiple flights; names do not establish ownership or identity.

## Flight difficulty

Choose Classic or Relaxed on the home screen. The choice lasts for the current page session; retry preserves it. Daily always starts a Classic-rules flight with Luna. Walkthrough remains safe practice, separate from either score mode.

Classic retains its original physics/generation/speed and competitive eligibility. Relaxed uses the same flap/gravity and cat traits, but travels at 105 rising gradually to 130 logical units/s before cat multipliers, with 390 spacing and gap sizes tapering from 280 to a minimum of 248. Centers vary less, the first three gates are laundry, optional mischief starts later, and the vacuum encounter begins after 18 cleared gates instead of nine. Its encounter gap is 280. First obstacle approach offers more reaction time.

Relaxed starts with two rescues; subsequent heart pickups still cap at two. It is forgiving, not invincible. Protection/death rules are otherwise unchanged. Results save only relaxedBest locally, not fish, tokens, missions, achievements, normal best or Daily scores. No online ticket or submission form is requested. Classic/Daily and tutorial/lab reward rules remain as before. Human playtesting should tune comfort without silently changing competitive rules.
