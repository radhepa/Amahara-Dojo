# Dojo

Created by Radhe Patel. Repository: `https://github.com/radhepa/Amahara-Dojo`.
The canonical local project is `C:\Users\minal\Amahara-Dojo`.

## Start here

Read `docs/project-status.md` first. Read only the relevant implementation files after that. For narrative changes, read `docs/story-authoring.md` and the relevant part of `docs/writer-bible.md`; the latter contains future spoilers. `docs/roadmap.md` describes the planned chapters. Update the status document after meaningful changes so a fresh session can continue without the old conversation.

## Product requirements

- Product name is **Dojo**. The setting is Amahara and Lantern Hall, with five original adult founders: Akari, Ren, Sora, Daichi, and Yuzu.
- Chapter 1 is the eight-week beginner season: 48 main beats, 20 personal conversations, five optional adult relationship invitations, six supporting visits, and a prologue.
- Practice lasts **30–45 minutes**, including rests. Wednesday is full rest with no required check-in. Normal and gentle recovery earn equal rewards. No absence penalties.
- Dojo is a general beginner martial arts program. Do not personalize it around the owner’s other exercise routines. Teach stance, guard, balance, and footwork with standing, supported, and seated preparation options. Revise week one first; later workout revisions wait for the owner’s review.
- Story rewards never certify martial arts ability. This release stays Level 1 Beginner. Later levels need actual curriculum, instruction, and demonstrated competence.
- Reflections are optional and equally rewarded. Private notes are never interpreted by characters.
- Focus on **laptop layouts**. Skip phone layout checks unless requested.
- Emotional performances must change **pose and body language as well as the face**. Match the existing portrait art and preserve designs/outfits. Source images live in `artwork/source`; delivery copies live in `public/story`.

## Engineering

- Preserve Sites authentication, the existing project ID in `.openai/hosting.json`, D1 schema, dependency lockfile, and private hosting access.
- Save state belongs to the authenticated user. Keep compare-and-swap mutations and exactly-once rewards atomic with journal writes.
- Do not rename published scene IDs or reorder saved paragraphs without a migration. Replays keep original choices and flags.
- Never import the writer bible into the client or player roadmap.
- Run `npm run typecheck` and `npm test` for relevant changes; build before publication. `npm run test:api` checks a running local preview and restores its fixtures.
- Keep caches, credentials, local databases, and dependency directories out of Git.
- Commit and push with Radhe Patel's Git identity. Do not add generation credits, bot authors, or coauthor trailers. Preserve required third-party licenses and functional hosting/authentication identifiers.
- Push to GitHub `main`. GitHub pushes do not publish the hosted app; use the existing Sites publishing workflow for requested app changes.

## Local desktop app — primary delivery

- The owner's primary Dojo is now the Windows desktop app. Do not publish to Sites unless the owner explicitly requests a hosted update. Keep the archived hosting configuration, authentication and D1 schema intact.
- The desktop and Start menu **Dojo** shortcuts open `%LOCALAPPDATA%\Programs\Dojo\Dojo.exe`. Live code comes from the canonical project folder above. When working in another worktree, synchronize reviewed changes into that canonical checkout so the installed app receives them; a worktree-only edit or GitHub push cannot update another local checkout.
- `desktop/boot.mjs` loads local source when available; Vite updates the interface and game APIs, and native shell edits restart the app automatically. The packaged copy works independently when source is unavailable or `--offline` is passed. Neither mode needs ChatGPT, a browser, a remote database, or internet at runtime.
- Progress belongs to the current Windows user in `%LOCALAPPDATA%\Dojo\progress.sqlite`. Reader preferences and Chromium state stay in that same local app folder. Hosted progress is separate. Never replace the owner's local save with test fixtures. Use temporary `DOJO_DATA_DIR` directories for desktop QA.
- Reuse the existing game/session/progress routes through the desktop build aliases. Keep SQLite batch transactions equivalent to D1's atomic compare-and-swap, reward and journal writes. Do not introduce a parallel set of reward or story rules.
- For desktop changes run `npm run typecheck`, `npm test`, `npm run desktop:build` and `npm run test:desktop`. Package/installation instructions are in `docs/desktop.md`. Build and install a new fallback package after meaningful changes; source updates appear automatically while the app is open.
