@echo off
where node >nul 2>nul
if errorlevel 1 (
 echo Node.js 20 veya ustunu nodejs.org adresinden kurun.
 pause
 exit /b
)
start http://localhost:3000
node server.mjs
pause
