# Local Dojo for Windows

Open **Dojo** from the desktop or Start menu. This is a native Electron application with its own bundled runtime, artwork, fonts and SQLite database. It runs without ChatGPT or an internet connection. No terminal or browser is needed to use the installed app.

## Automatic local updates

The installed app reads `C:\Users\minal\Amahara-Dojo` on this machine. Saving changes to the interface, story, game rules or delivery artwork updates the open app through Vite. Native desktop shell changes restart the window automatically. Practice timers and completed reading positions stay in the database. An invalid edit may show a local development error until the edit is fixed.

Changes made in a different worktree must reach that canonical folder to appear in the installed app. This is local file watching, not a GitHub downloader or a cloud updater. There is no upload or publishing step.

If the source folder or its development dependencies are unavailable, Dojo uses the last packaged copy. `Dojo.exe --offline` always uses that self-contained copy; both modes run entirely on the computer. Rebuild and reinstall occasionally to bring the fallback copy up to date. The app never installs dependencies or downloads updates while you play.

## Local progress and backup

Progress, journal notes, assessment, rewards, reading places and restart history are in `%LOCALAPPDATA%\Dojo\progress.sqlite`. Each Windows user has a separate app folder. Reader preferences, a remembered local port and Chromium data also stay there. The app binds only to loopback and uses a private desktop session cookie. Hosted saves remain on the previous hosted app; this new local save starts fresh.

Use **Dojo → Back up local save…** for a consistent SQLite snapshot, or **Open save folder** to locate the files. Do not copy only the active SQLite file while Dojo is running: its newest writes can be in the accompanying WAL file. To restore a backup, quit Dojo, preserve the existing save folder, then restore the backup as `progress.sqlite` in a clean save folder. The app can re-create its non-progress files on launch.

The previous URL shortcut is renamed **Dojo (hosted archive)** during installation. The new **Dojo** shortcut points to an executable in `%LOCALAPPDATA%\Programs\Dojo`.

## Build and install

Use Node.js 24 or later for development. The existing project lockfile and hosted runtime remain unchanged. Electron's tools have a separate lockfile in `desktop`.

```powershell
npm run install:ci
npm run desktop:setup
npm run desktop:build
npm run desktop:dev
```

To create the portable Windows package and install it for the current user:

```powershell
npm run desktop:package
pwsh -File scripts/install-desktop.ps1
```

Installation creates desktop and Start menu shortcuts without administrator access. To package in a separate worktree and point the installed app at the canonical source folder, pass `-SourceRoot C:\Users\minal\Amahara-Dojo` to the installer after synchronizing the source.

The package is `desktop/release/Dojo-win32-x64`. Its **Dojo.exe** can be run without Node.js, npm, the source folder or any ChatGPT app. Move the entire package folder together, keeping its DLLs and `resources` directory. Deleting or reinstalling the executable folder does not remove progress from the separate save folder.

## Validation

```powershell
npm run typecheck
npm test
npm run desktop:build
npm run test:desktop
```

Desktop checks use a disposable SQLite database. They exercise both the bundled runtime and live source, the existing full API concurrency suite, atomic rollback, migrations, restart persistence, local artwork, unauthorized requests, origin/host checks and consistent backups. `npm run test:api` still defaults to the original local hosted-stack preview.
