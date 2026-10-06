# Dojo season authoring

## Private full-saga development (6 October 2026)

The owner authorized the complete ten-chapter saga with broad creative discretion and requested no spoilers in chat. The private authoring package is `docs/saga/README.md`; it specifies future world canon, chapter treatments, character trajectories, ending, decisions, and callbacks. Read it with the writer bible before scripting later chapters. Keep every future plot detail in contributor material and out of the player roadmap, client modules, public assets, and owner-facing responses.

The package is a narrative blueprint. Current playable chapters and curriculum gates remain as released. A chapter becomes playable only after final scripts, required curriculum and assessment, original performance art, save compatibility, and relevant checks exist. Follow the desktop workflow in `AGENTS.md` and `docs/desktop.md` for implementation; the archived hosted app is updated only when explicitly requested.

## First-month campaign (5 October 2026)

Fresh saves use the compatible `week-one-v2` revision with **24 post-practice episodes through week four** and eight required pre-practice openings. Openings precede practice opportunities 1, 4, 7, 10, 13, 16, 19 and 22. The author chooses those days; the player cannot skip these story-bearing scenes. Future filler may explicitly be optional. Complete the welcome and first opening before practice. Read preceding episodes to reach later openings when workouts are banked. Wednesday requires nothing.

The unchanged `lib/story/pilot.ts` owns week one. `month-week-2.ts`, `month-week-3.ts`, `month-week-4.ts` and `month-interludes.ts` expand weeks 2–4. `month-authoring.ts` creates separate stable IDs (c1-month-wN-bN); `month.ts` uses a clone of the legacy spine and adds fresh-only continuity changes. Published originals and week-one pilot paragraph order remain intact. Do not insert/reorder passages after publication without a revision and migration.

Choices can change a line, a mundane action, a prop or later conversation. Use an immediate reply for every option. A remembered-choice cue must describe an actual consequence. The first month retains the season's repair/access/consult/mistake decisions and adds small callbacks. Forty-four main decisions do not require forty-four dramatic crises. Replays use frozen entry flags and original inline choices; selecting an option saves directly into its stable reply passage.

Fresh saves begin solo. Consume explicit introductions to unlock Akari/Ren in week-one episode one, Sora in two, Yuzu in three and Daichi in four. Openings don't unlock companions. The roster and practice/job APIs enforce the locks. Required openings award nothing. Solo awards supplies and an episode unlock without a companion bond recipient.

Legacy campaigns retain the original 80-scene catalog. Existing pilot saves retain the revision ID; any already-started original short week 2–4 stays on that week's original scenes, then rejoins expanded unstarted weeks. Fresh campaigns use the full expanded month and return to the original week five. Do not reset an active pilot just to get later writing. The existing authenticated reset action activates the first-month campaign only for a legacy account, atomically clearing that account's history with an idempotent token. Hosted publication and the owner's reset await local review.

The dialogue panel always shows the speaking named character's portrait, even over an event illustration. Use explicit whole-pose mood direction (new-script syntax: `speaker~expression|speech`), never sentiment inference. A speaker's own pose overrides narrative performance cues. Narration can retain an explicitly directed performer; the player has no invented portrait. Reading estimates are scene-specific and are never enforced waits. Week one targets 15–20 minutes; quieter expanded scenes generally estimate 8–15 minutes, with the week-four finale longer.

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
5. Check relevant branch combinations, interacting flags, retry idempotence, resumed sessions, Wednesday, and laptop layouts. Skip phone checks unless requested. Keep local QA fixtures out of production. For the full saga, use the coverage strategy in `docs/saga/choices-and-continuity.md`; all 2^27 combinations are not necessary to establish the specified invariants.

Type-check with `npm run typecheck` and run `npm test` for relevant writing changes. Desktop integration also requires `npm run desktop:build` and `npm run test:desktop`, synchronization into the canonical checkout, and an updated fallback package after meaningful runtime changes. Build the hosted app and follow the existing Sites workflow only for an explicitly requested archived Site update.
