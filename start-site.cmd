@echo off
setlocal

set "ROOT=%~dp0"
set "NODE=C:\Program Files\nodejs\node.exe"

pushd "%ROOT%frontend"
call npm.cmd run build
if errorlevel 1 (
  popd
  echo Frontend build failed.
  exit /b 1
)
popd

start "HeritageX Backend" /min "%NODE%" "%ROOT%backend\server.js"
start "HeritageX Frontend" /min "%NODE%" "%ROOT%frontend\serve.js"

timeout /t 3 /nobreak >nul
start "" "http://localhost:4173"

endlocal
