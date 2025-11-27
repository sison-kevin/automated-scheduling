# Quick Start Script for Userpanel Event System
# This script helps you verify both frontend and backend are set up correctly

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Userpanel Event System - Setup Verification" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check backend
Write-Host "[1/5] Checking backend..." -ForegroundColor Yellow
$backendPath = "C:\xampp\htdocs\userpanel-event\userpanel-backend"
if (Test-Path "$backendPath\index.php") {
    Write-Host "  ✓ Backend folder exists" -ForegroundColor Green
    
    if (Test-Path "$backendPath\vendor") {
        Write-Host "  ✓ Composer dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Composer dependencies missing" -ForegroundColor Red
        Write-Host "    Run: cd $backendPath; composer install" -ForegroundColor Yellow
    }
    
    if (Test-Path "$backendPath\.htaccess") {
        Write-Host "  ✓ .htaccess configured" -ForegroundColor Green
    } else {
        Write-Host "  ✗ .htaccess missing" -ForegroundColor Red
    }
} else {
    Write-Host "  ✗ Backend not found" -ForegroundColor Red
}

Write-Host ""

# Check frontend
Write-Host "[2/5] Checking frontend..." -ForegroundColor Yellow
$frontendPath = "C:\xampp\htdocs\userpanel-event\userpanel-frontend"
if (Test-Path "$frontendPath\package.json") {
    Write-Host "  ✓ Frontend folder exists" -ForegroundColor Green
    
    if (Test-Path "$frontendPath\node_modules") {
        Write-Host "  ✓ Node dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Node dependencies missing" -ForegroundColor Red
        Write-Host "    Run: cd $frontendPath; npm install" -ForegroundColor Yellow
    }
    
    if (Test-Path "$frontendPath\.env") {
        Write-Host "  ✓ .env configured" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ .env not found (copy from .env.example)" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ✗ Frontend not found" -ForegroundColor Red
}

Write-Host ""

# Check XAMPP
Write-Host "[3/5] Checking XAMPP services..." -ForegroundColor Yellow
$apacheRunning = Get-Process | Where-Object { $_.ProcessName -eq "httpd" }
$mysqlRunning = Get-Process | Where-Object { $_.ProcessName -eq "mysqld" }

if ($apacheRunning) {
    Write-Host "  ✓ Apache is running" -ForegroundColor Green
} else {
    Write-Host "  ✗ Apache is not running" -ForegroundColor Red
    Write-Host "    Start XAMPP and enable Apache" -ForegroundColor Yellow
}

if ($mysqlRunning) {
    Write-Host "  ✓ MySQL is running" -ForegroundColor Green
} else {
    Write-Host "  ✗ MySQL is not running" -ForegroundColor Red
    Write-Host "    Start XAMPP and enable MySQL" -ForegroundColor Yellow
}

Write-Host ""

# URLs
Write-Host "[4/5] Access URLs:" -ForegroundColor Yellow
Write-Host "  Backend:  http://localhost/userpanel-event/userpanel-backend/" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173 (after running: npm run dev)" -ForegroundColor Cyan

Write-Host ""

# Next steps
Write-Host "[5/5] Next steps:" -ForegroundColor Yellow
Write-Host "  1. Ensure Apache & MySQL are running in XAMPP" -ForegroundColor White
Write-Host "  2. Configure database in: userpanel-backend/app/config/database.php" -ForegroundColor White
Write-Host "  3. Test backend: http://localhost/userpanel-event/userpanel-backend/" -ForegroundColor White
Write-Host "  4. Start frontend: cd $frontendPath; npm run dev" -ForegroundColor White

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Setup verification complete!" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
