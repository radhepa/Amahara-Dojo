# Dojo season authoring

## Week-one pilot (5 October 2026)

Fresh saves use `week-one-v2`: six post-practice visual novel episodes and two **required** pre-practice openings, before practice opportunities one and four. The author decides which days have openings; these two are story-bearing and cannot be skipped. Future scenes explicitly marked `optional` may be filler. Complete the welcome and first opening before the first practice. If workouts are banked, read the preceding episodes to reach the fourth opening before starting practice four. Wednesday still requires nothing.

`lib/story/pilot.ts` owns the revised writing. Stable passage IDs, inline decisions, locations, introductions, and authored whole-pose expression cues drive the existing reader. Choosing advances immediately into the chosen reply. Entry flags are frozen; a scene's own saved decisions overlay only their own flags. Replays retain that route. Never change published passage IDs or reorder their meaning without a content revision and migration.

Fresh saves begin with **solo** practice. Consume explicit introductions to unlock Akari and Ren in episode one, Sora in episode two, Yuzu in episode three, and Daichi in episode four. Openings do not unlock companions. Practice and job APIs enforce the same locks as the roster and picker. Solo practice awards supplies and the main unlock; it has no companion bond recipient.

Legacy saves retain the original prologue, week-one paragraphs, scene IDs, and companion availability. The fresh campaign substitutes six pilot episodes and then rejoins the existing week-two story; the `repair` flag keeps its existing callbacks. Required openings have no rewards. The Ren decision in episode two and repair priority in episode five have memory cues and episode-six callbacks.

The authenticated `reset-pilot` action activates the revised campaign for a legacy account and clears that account's entire game, reward ledger, journal, mobility profile, and beginner checks atomically. It accepts a stable retry token and cannot reset an already activated pilot again. Other users are unaffected. Publication and the owner's hosted reset await local pilot review.

Chapter 1 has 48 main scenes in eight episodes, a prologue, 20 founder conversations, five optional adult relationship invitations, and six supporting-cast visits. A full, current-day guided practice opens one main scene. Gentle recovery follows the same 30–45 minute duration and earns the same rewards. Wednesday has no assigned practice. Optional visits and jobs never require daily attendance.

## Content

`lib/story/episode-*.ts` owns the main sequence. Stable IDs use `c1-eN-bN`; do not rename published IDs or reorder published paragraphs without a save migration. `index.ts` adds explicit conditional callbacks, eight longer hinge passages, illustrations, and whole-pose performance cues. `personal.ts` and `quests.ts` hold optional visits. Choices have authored replies and persistent flags. Scene saves snapshot the flags present on first reading, so replays preserve the original context.

Each founder has neutral, amused, concerned, angry, determined, and soft portraits. Supporting characters have neutral, amused, concerned, and determined portraits. `characterPortrait()` maps supporting soft/angry cues to their available performances. Use authored expression cues at the relevant line. Do not choose emotion from keyword sentiment. Every performance changes the body language as well as the face, while preserving character identity and outfit.

Delivery art is under `public/story`. Source PNGs and design specifications are retained in `artwork/source` and `artwork/specifications.json`. WebP conversion only optimizes delivery; it preserves the selected image, dimensions, and alpha. Event illustrations belong to specific scenes, and hall repair images advance with the story. No plot-critical image should be a placeholder.

Future-campaign secrets remain in `docs/writer-bible.md`, which is contributor material. Never import it into the client. Only Chapter 1 reveals and the spoiler-light roadmap ship to the player.

## State and progression

`lib/game.ts` defines availability, bond labels, supplies, projects, jobs, and reward IDs. `game-actions.ts` applies choices and optional management actions. `session-actions.ts` owns durable practice timers and confirmations. `game-store.ts` commits each mutation, reward ledger entry, and journal record in one guarded D1 transaction. All state belongs to the authenticated Sites user ID.

The browser cannot supply elapsed time, practice dates, a week, or reward amounts. A session locks its server-derived day, date, week, plan, and companion. All blocks require elapsed server time and an explicit completion confirmation. Partial sessions remain in the journal and earn no story unlock. Reflection is optional; every offered answer has the same bond reward. Notes are private journal text and never analyzed by characters.

Story progress and game rewards do not certify martial arts skill. Keep curriculum progression in the existing beginner checks. Later levels require authored curriculum, qualified instruction, and demonstrated competence; a completed campaign alone never awards mastery.

## Extending safely

1. Add the chapter's writing and curriculum before exposing its unlock.
2. Specify each decision's later callbacks and each character's practice/story gates.
3. Generate original characters and emotionally matched pose art from the existing design references.
4. Migrate durable state when changing IDs, published paragraph order, or schema.
5. Check all branch combinations, retry idempotence, resumed sessions, Wednesday, and phone/desktop layouts. Keep local QA fixtures out of production.

Build with `node scripts/run-framework.mjs build`; type-check with `node node_modules/typescript/bin/tsc --noEmit`. Follow the existing Sites workflow to synchronize source and deploy the private Site.
