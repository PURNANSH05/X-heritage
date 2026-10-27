@echo off
setlocal

set "ROOT=%~dp0"

where node.exe >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install Node.js 18 or newer, then run this file again.
  pause
  exit /b 1
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo npm was not found. Repair or reinstall Node.js, then run this file again.
  pause
  exit /b 1
)

if not exist "%ROOT%backend\.env" (
  echo Missing backend\.env. Copy backend\.env.example to backend\.env and set MONGODB_URI first.
  pause
  exit /b 1
)

if not exist "%ROOT%backend\node_modules" (
  echo Installing backend dependencies...
  pushd "%ROOT%backend"
  call npm.cmd install
  if errorlevel 1 (
    popd
    echo Backend dependency installation failed.
    pause
    exit /b 1
  )
  popd
)

if not exist "%ROOT%frontend\node_modules" (
  echo Installing frontend dependencies...
  pushd "%ROOT%frontend"
  call npm.cmd install
  if errorlevel 1 (
    popd
    echo Frontend dependency installation failed.
    pause
    exit /b 1
  )
  popd
)

pushd "%ROOT%frontend"
call npm.cmd run build
if errorlevel 1 (
  popd
  echo Frontend build failed.
  pause
  exit /b 1
)
popd

start "HeritageX Backend" /D "%ROOT%backend" cmd /k "node server.js"
start "HeritageX Frontend" /D "%ROOT%frontend" cmd /k "node serve.js"

timeout /t 4 /nobreak >nul
start "" "http://localhost:4173"

endlocal
