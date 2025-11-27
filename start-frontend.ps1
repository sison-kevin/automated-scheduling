# Start Frontend Development Server
# This script starts the React frontend on http://localhost:5173

$frontendPath = "C:\xampp\htdocs\userpanel-event\userpanel-frontend"

Write-Host "Starting Userpanel Frontend..." -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "$frontendPath\node_modules")) {
    Write-Host "Installing dependencies first..." -ForegroundColor Yellow
    Set-Location $frontendPath
    npm install
}

# Check if .env exists
if (-not (Test-Path "$frontendPath\.env")) {
    Write-Host ""
    Write-Host "WARNING: .env file not found!" -ForegroundColor Red
    Write-Host "Copying from .env.example..." -ForegroundColor Yellow
    Copy-Item "$frontendPath\.env.example" "$frontendPath\.env"
    Write-Host "Please edit .env to configure your API base URL" -ForegroundColor Yellow
    Write-Host ""
}

# Start dev server
Write-Host "Starting Vite dev server..." -ForegroundColor Green
Set-Location $frontendPath
npm run dev
