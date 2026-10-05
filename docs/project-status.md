# Project status

Updated 5 October 2026. Owner: Radhe Patel.

## Week-one pilot — source ready for review

The new `week-one-v2` campaign contains six visual novel episodes of roughly 2,000–2,100 base words each, aimed at 15–20 minutes of reading. Two openings of roughly 660 words precede practices one and four. **These openings are required**: the author chooses the days with openings, rather than offering the player a skip. Only future filler explicitly marked optional may be skipped. Workout backlog can wait, but the first three episodes must be read to reach the fourth opening before practice four. Wednesday remains full rest.

Fresh saves have no unlocked founders. Solo practice is available after the first opening. Explicit introductions unlock Akari/Ren in episode one, Sora in two, Yuzu in three, and Daichi in four. The hall, roster, training presentation, and job/practice APIs all enforce the locks. Solo earns supplies and an episode unlock without awarding nonexistent companion bond.

`lib/story/pilot.ts` holds the pilot. The reader supports stable passage IDs, embedded expressive choices, immediate authored replies, location changes, scene headings, whole-pose performances, and subtle remembered-choice cues. Episode six recalls Ren's episode-two exchange and the existing floor/welcome repair priority. The end of a saved full workout offers the next unlocked episode or a return to the hall. Saved entry context and original decisions persist through resume and replay.

Legacy accounts retain the 80-scene catalog and original paragraphs. Fresh accounts substitute the pilot prologue and first six main scenes, add two openings, and then return to the existing week-two sequence. Published legacy scene IDs were not renamed or reordered. A legacy account's “Begin the week-one pilot” action atomically clears its entire game, reward ledger, journal, mobility assessment, and beginner checks; repeat requests with the same token are safe and other accounts remain unchanged. **The hosted owner's save has not been reset, and this pilot has not been published.** Review and activation are the next steps.

Pilot validation: type checking, existing 256 legacy branch playthroughs, 60 pilot paths covering every embedded option and remembered-choice combination, all-passage reload checks, existing curriculum/art/dialogue suites, production build, and local API concurrency/reset-isolation checks passed. API fixtures were restored. Laptop browser QA at 1366×768 checked the fresh locked hall, required opening flow, embedded choices, immediate reply and memory cue, saved-place reopening, and solo practice setup. No browser errors were reported. Phone checks were skipped. Reading duration is a writing target, pending owner playthrough feedback.

Source map additions: `lib/story/pilot.ts`, `app/pilot.css`, and `tests/verify-pilot.mjs`. No schema, hosting identity, authentication, dependency version, or lockfile changes.

## Current release

Dojo Chapter 1 is hosted at `https://lee-dojo.radherpatel7.chatgpt.site` with private access. Site project ID: `appgprj_6ac181fe519c8191a7ef71c643c2aa40`. The preceding typography, palette, and dialogue-motion release was deployed from source commit `94e032afa3708e01f8f436e900ed59347d74bc0b` on 4 October 2026 (local time), deployment `appgdep_6ac307e099e8819198c122382d05b716`. The general martial arts first week was published from commit `3952a23ff7cd08fdd47b91aa322ae27af97c496e`, deployment `appgdep_6ac3127dfb1c81918d2ca93ed0bd4794`. This follow-up removes the picture guides at the owner’s request; its publishing result is recorded in the associated chat.

Chapter 1 has an eight-week introductory movement curriculum. Week one is now a general martial arts introduction: **30, 30, 0, 30, 30, 30, 30 minutes** Monday–Sunday, including preparation and rest. Wednesday is full rest. Stance and guard lead into balance, forward/backward steps, side steps, and a slow review. Standing, supported, and seated preparation earn equal rewards. Dojo does not account for any individual's other workouts. Weeks 2–8 retain their existing drill blocks and durations (**30, 30, 0, 45, 40, 30, 30 minutes**) while awaiting the owner's review; their labels and descriptions no longer assume a personal exercise schedule. The chapter introduces foundations and cannot establish broader beginner martial arts competence without an appropriate curriculum, instruction, and observed assessment. See `docs/curriculum-review.md` for the eight-week audit.

Chapter 1 has **80 authored scenes**: prologue 1, main 48, personal 20, relationships 5, supporting visits 6. Eight main branching decisions have callbacks. The scene collection contains about 21,720 authored words. Major future canon is in the writer bible, which is contributor material and must not ship into the player's UI.

The 12 named characters have 58 portraits: five founder neutral designs and 25 mood poses, plus seven supporting neutral designs and 21 mood poses. Six settings and three event illustrations make **67 selected images**. Every mood variant changes body language. Source PNGs and design specifications are checked in; delivery artwork preserves transparent alpha.

## Source map

| Area | Files |
|---|---|
| Main app, training tabs | `app/dojo.tsx`, `lib/training.ts`, `lib/week-one.ts`, `lib/beginner.ts`, `lib/levels.ts` |
| Week-one instructions and timed rounds | `app/drill-instructions.tsx`, `app/training.css`, `lib/week-one.ts` |
| Hall, visits, projects, jobs | `app/dojo-hub.tsx`, `lib/game.ts` |
| Story reader and dialogue timing | `app/story-reader.tsx`, `app/use-dialogue-reveal.ts`, `lib/dialogue.ts`, `app/story.css` |
| HUD, typography, and motion | `app/dojo-hud.tsx`, `app/hud.css`, `app/game-feel.css`, `public/fonts` |
| Narrative and performance cues | `lib/story/episode-*.ts`, `personal.ts`, `quests.ts`, `season-depth.ts`, `index.ts`, `cast.ts` |
| Saved guided practice | `app/guided-practice.tsx`, `lib/session-actions.ts` |
| Account mutations and rewards | `lib/game-actions.ts`, `lib/game-store.ts`, `app/use-dojo-game.ts` |
| API | `app/api/game`, `app/api/sessions`, `app/api/progress` |
| Persistence | `db/schema.ts`, `drizzle/0000…0002*.sql` |
| Art | `artwork/source`, `artwork/specifications.json`, `public/story`, `public/members` |

## Rules worth keeping

- One full saved practice per date awards 20 supplies, 10 chosen-companion bond, and one main beat. Optional reflection gives 2 bond for every offered answer. Partial practice stays in the journal without a story unlock.
- Session day/date/week/plan/companion come from the server and stay locked. Block completion requires elapsed server time plus confirmation. Pauses persist; there is no race deadline.
- D1 compare-and-swap guards account state, reward events, and journal writes in the same transaction. Repeated clicks and two-tab requests must not duplicate rewards.
- Personal arcs open through bonds and story/practice gates. Friendship and optional adult romance are equally valid; no vulnerable-answer bonuses.
- Jobs accrue capped optional supplies, not affection or fighting skill. Facilities do not gate the main story. No absence penalty.
- The red beam scarf stays in earlier hall art; after Episode 6 beat 3, the repaired brace replaces it. Yuzu is absent from the review exchange and returns for the season meal.

## Validation and next work

Week-one workout revision: picture guides, frame selection, playback, and their entry buttons have been removed at the owner’s request. Every assigned drill retains written steps, form checks, and supported/seated alternatives. Each 5-minute block uses 1 minute setup, 3 × (30 seconds practice / 30 seconds rest), and 1 minute review; 10-minute blocks use 8 rounds. Live round prompts derive from the existing saved block timer and pause with it. New `w1-*` IDs keep previously saved session instructions and durations intact. The library shows week-one lessons during week one. Project guidance in this checkout and the canonical checkout now specifies a general martial arts program. One existing story paragraph drops its assumption about other workouts without changing its ID, paragraph order, choices, or flags.

Removal validation: type checking and the complete curriculum/story/art/dialogue test suite passed. Session, reward, and persistence behavior is unchanged.

The eight-week audit found missing striking/defense instruction for a broader martial arts outcome, a mismatch between week-four guard goals and drill dose, and a week-six coordination goal that precedes the combined drill. These are recorded for the next approved revision. Do not redesign weeks 2–8 until the owner has reviewed week one.

Validation for the first-week revision: type checking, the complete curriculum/story/art/dialogue suite, production build, and local API concurrency tests passed. API fixtures were restored. Browser checks for the original first-week revision covered the technique library, the subsequently removed guides, weekly progression, 5- and 10-minute round counts, and practice-preview start/pause. Laptop layouts were the target; phone checks were skipped. Saved plans, elapsed-time checks, account isolation, and exactly-once journal/rewards remain covered by the existing API suite.

The game-feel revision replaces the green interface with midnight ink, vermilion, and ivory. Locally hosted Kalam headings and Bricolage Grotesque interface text have their OFL licenses in `public/fonts`. `app/game-feel.css` loads last and supplies the shared palette, tactile controls, drifting hall dust, light changes, staggered cards, portrait entrances, and reading-stage treatment. Existing character designs and paintings remain unchanged.

Story dialogue now writes by Unicode grapheme with punctuation pauses. Click the text, use Reveal line, or press Space/Enter to reveal without advancing; a subsequent action continues. Three text speeds include instant, and optional quiet dialogue sounds start only when enabled. Choices wait for the line to finish. Hidden text reserves the paragraph layout, screen readers receive complete lines, and reduced-motion preference makes dialogue instant and disables motion. Saved paragraph positions, original replay choices, scene IDs, rewards, and account APIs are unchanged.

This revision passed type checking, the complete story/curriculum/art suite, the new `tests/verify-dialogue.mjs` checks, and the production build. Local laptop browser checks covered progressive text, reveal without advancing, keyboard reveal, all three speeds, sound toggle, contrast and transcript controls, plus the hall, practice, techniques, and journey screens. No browser errors were reported. API persistence code did not change; phone QA was not performed.

The reference-inspired HUD redesign uses the existing hall and founder artwork in a full-width Lantern Hall scene, with parchment navigation and story panels, a live rank/resources bar, calendar, segmented chapter progress, and five companion cards. Shared HUD components live in `app/dojo-hud.tsx`; the material, typography, dialog, and laptop layout styling is in `app/hud.css` (loaded after the existing styles). Training, weekly plans, techniques, companions, journey, projects, and story reading share the new theme. Narrative IDs, saves, authentication, rewards, schema, and dependency versions are unchanged. The hall layout grows with its text; keyboard focus, a skip link, and reduced-motion handling are included.

Windows publishing: the Sites packaging helper uses Bash and GNU tar. Add `C:\Program Files\Git\bin` to the publishing process PATH and set `TAR_OPTIONS=--force-local` for drive-letter archive paths. Keep those settings process-local.

HUD validation: type checking, the complete curriculum/story/art test suite, and production build passed. Local browser checks covered companion selection, all six navigation tabs, drill details, saved-practice opening, and story replay. All visible hall artwork loaded and no browser errors were reported. Laptop layouts were the target; phone QA was not performed.

The release passed type checking, production build, all 256 main branch combinations, practice/reward checks, local API concurrency checks, and a 67-image reference audit. Laptop layouts are the current priority. Local test fixtures were restored before release.

The GitHub project preserves the app and now includes portable checks and local setup. The standalone checkout passed type checking, all story/curriculum/art checks, a production build, fresh local migrations, repeat migration setup, and the API concurrency suite with fixtures restored. Use `npm run typecheck`, `npm test`, and `npm run build`; use `npm run db:local` before the first preview. Run API checks against the local preview when persistence behavior changes.

Future work should follow playthrough feedback: refine story pacing and scene-specific performances, then add later writing, curriculum, recruit arcs, instructor review, and deeper projects. Consult `docs/roadmap.md` and relevant writer-bible sections before extending the campaign. Chapters 2–10 are plans, not completed features.
