# Dojo art direction

The released source set contains **67 PNG images**: 58 portraits, six settings, and three event illustrations. The five original founder designs remain the identity and style references.

- `source/characters/{akari,ren,sora,daichi,yuzu}-neutral.png`: the original founders.
- Each founder also has amused, concerned, angry, determined, and soft performances.
- Haru, Mika, Emi, Riku, Natsume, Toma, and Shigure each have neutral, amused, concerned, and determined performances.
- `source/backgrounds`: worn/improved/restored Lantern Hall, courtyard, town by day/evening, first meal, review exchange, and season meal.
- `specifications.json`: identities, outfits, composition, poses, and scene requirements.

Match the existing crisp anime linework, cel shading, proportions, and character palette. Preserve age, skin tone, hairstyle, outfit, and accessories. An expression change also changes hands, arms, shoulders, and stance; do not merely replace the face. Toma is a fully clothed fourteen-year-old courier and has no romance path.

Portraits use genuine transparent alpha with no scenery. Some image viewers show RGB colors hidden beneath alpha zero; judge compositing against the app as well as the alpha channel. Settings and event illustrations are opaque landscape images.

Earlier hall scenes retain the red beam scarf. The later hall has a sound wooden brace and no tied scarf. The first meal includes all five founders, the review includes Akari/Ren with Daichi/Sora observing and excludes Yuzu, and the season meal brings all five together. Keep important faces away from edges and above the dialogue overlay.

`npm run art:prepare` makes WebP delivery copies at the original dimensions and preserves alpha. Original neutral founder PNGs remain under `public/members`; other delivery images are under `public/story`. Source PNGs are retained unchanged. Run `npm test` after changing artwork references.

Chapter 2 production sources are staged separately in `source/chapter-02` until story integration. Their complete prompt and reference records remain in contributor material and `specifications.json`. The approved, spoiler-free preview is `gallery/index.html`; it has neutral labels and a strict image allowlist. Do not run a directory-wide copy of unreleased sources into `public`.

Chapter 3 production sources are likewise staged in `source/chapter-03`: 21 PNG images comprising twelve transparent portraits, three settings and six event illustrations including both authored choice variants. Character study K now has all six moods matching her redesigned neutral portrait. `docs/saga/chapter-03-art-plan.json` records the private production prompts; `specifications.json` records their reference locks, dimensions and checksums. Only the sixteen explicitly reviewed designs/settings/quiet-practice images are exported to the neutral gallery. Run `node tests/verify-chapter-three-art.mjs` after changes. Keep plot-specific sources private and outside the released app.
