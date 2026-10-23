#requires -Version 5.1
<#
  Build Vuemora and publish it to the gh-pages branch of:
  https://github.com/Siva4915/Siva4915.github.io

  This script does not switch branches in the source repository. It builds
  dist/, copies it into a temporary Git repository, and force-pushes that
  snapshot to gh-pages. GitHub Pages then rebuilds automatically.

  Run from any location:
    powershell -ExecutionPolicy Bypass -File scripts/deploy-pages.ps1
#>

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$pages = Join-Path $env:TEMP 'vuemora-gh-pages-deploy'

Write-Host 'Building Vuemora...' -ForegroundColor Cyan
Push-Location $root
try {
    & npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw 'npm run build failed.' }

    if (Test-Path $pages) { Remove-Item -Recurse -Force $pages }
    New-Item -ItemType Directory -Force -Path $pages | Out-Null
    Copy-Item 'dist\*' $pages -Recurse -Force
    New-Item -ItemType File -Force (Join-Path $pages '.nojekyll') | Out-Null
} finally {
    Pop-Location
}

Write-Host 'Publishing gh-pages...' -ForegroundColor Cyan
Push-Location $pages
try {
    git init -b gh-pages | Out-Null
    git config user.name 'Chukka Siva'
    git config user.email 'chukkasiva09@gmail.com'
    git remote add origin https://github.com/Siva4915/Siva4915.github.io.git
    git add -A
    git commit -m "Deploy Vuemora $(Get-Date -Format 'yyyy-MM-dd HH:mm')" | Out-Null
    git push -f origin gh-pages
    if ($LASTEXITCODE -ne 0) { throw 'git push failed. Sign in to GitHub and retry.' }
} finally {
    Pop-Location
}

Write-Host ''
Write-Host 'Published: https://siva4915.github.io/' -ForegroundColor Green
Write-Host 'GitHub Pages usually refreshes within a minute.' -ForegroundColor DarkGray
