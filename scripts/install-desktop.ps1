param([string]$SourceRoot = (Split-Path -Parent $PSScriptRoot))
$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot))
$packageRoot = Join-Path $projectRoot 'desktop/release/Dojo-win32-x64'
if (-not (Test-Path -LiteralPath (Join-Path $packageRoot 'Dojo.exe'))) { throw 'Build the desktop package first with npm run desktop:package.' }
$SourceRoot = (Resolve-Path -LiteralPath $SourceRoot).Path
if (-not (Test-Path -LiteralPath (Join-Path $SourceRoot 'desktop/main.mjs'))) { throw 'The local project folder needs the desktop source files.' }
$installRoot = Join-Path $env:LOCALAPPDATA 'Programs/Dojo'
$saveRoot = Join-Path $env:LOCALAPPDATA 'Dojo'
New-Item -ItemType Directory -Path $installRoot -Force | Out-Null
Get-ChildItem -LiteralPath $packageRoot | ForEach-Object { Copy-Item -LiteralPath $_.FullName -Destination $installRoot -Recurse -Force }
@{ sourceRoot = $SourceRoot } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $installRoot 'resources/source.json') -Encoding utf8NoBOM
$shortcutShell = New-Object -ComObject WScript.Shell
foreach ($folder in @([Environment]::GetFolderPath('Desktop'), (Join-Path ([Environment]::GetFolderPath('StartMenu')) 'Programs'))) {
  $shortcut = $shortcutShell.CreateShortcut((Join-Path $folder 'Dojo.lnk'))
  $shortcut.TargetPath = Join-Path $installRoot 'Dojo.exe'
  $shortcut.WorkingDirectory = $installRoot
  $shortcut.Description = 'Local Dojo — automatic updates from your project folder'
  $shortcut.IconLocation = (Join-Path $installRoot 'Dojo.exe') + ',0'
  $shortcut.Save()
}
$oldShortcut = Join-Path ([Environment]::GetFolderPath('Desktop')) 'Amahara Dojo.url'
$archiveShortcut = Join-Path ([Environment]::GetFolderPath('Desktop')) 'Dojo (hosted archive).url'
if ((Test-Path -LiteralPath $oldShortcut) -and -not (Test-Path -LiteralPath $archiveShortcut)) { Move-Item -LiteralPath $oldShortcut -Destination $archiveShortcut }
Write-Output "Installed: $(Join-Path $installRoot 'Dojo.exe')"
Write-Output "Automatic updates from: $SourceRoot"
Write-Output "Private local saves: $saveRoot"
