# Opens the portfolio in your default browser
# Usage: Right-click and "Run with PowerShell" or run: ./run.ps1

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$indexPath = Join-Path $projectRoot 'index.html'

if (-Not (Test-Path $indexPath)) {
  Write-Error "index.html not found at $indexPath"
  exit 1
}

Start-Process $indexPath
