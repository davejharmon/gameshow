@echo off
cd /d "%~dp0server"
echo Starting server...
start "" node server.js
