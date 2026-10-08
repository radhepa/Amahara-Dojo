# Dojo art gallery

This folder is a self-contained, spoiler-reviewed preview. Open `index.html` directly, or run `node scripts/serve-art-gallery.mjs` from the repository and visit `http://127.0.0.1:4318`.

The Chapter 1 and Chapter 2 casts are included with all available poses. Only the founding five are named; all other portraits use neutral study labels. The collection contains designs, settings and quiet practice only. Source filenames, biographies, scene order, story captions and plot-specific illustrations are excluded. The local server exposes only this folder.

`node scripts/prepare-art-gallery.mjs` rebuilds its image copies from an explicit allowlist; it never scans unreleased sources. `node tests/verify-chapter-two-art.mjs` checks source coverage, alpha, framing, provenance and gallery isolation.
