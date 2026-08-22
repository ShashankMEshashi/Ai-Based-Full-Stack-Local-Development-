@echo off
title Launch MindPulse AI Localhost
echo ===================================================
echo ⚡ Launching MindPulse AI Full-Stack Localhost
echo ===================================================
set PATH=C:\Users\abhis\.gemini\antigravity\scratch\node\node-v20.18.0-win-x64;%PATH%
cd /d "%~dp0"

echo 📡 Starting Backend Server on port 5000...
start "MindPulse AI Backend" cmd /k "set PATH=C:\Users\abhis\.gemini\antigravity\scratch\node\node-v20.18.0-win-x64;%%PATH%% && cd backend && node server.js"

echo 🌐 Starting Frontend Web Application on port 3000...
start "MindPulse AI Frontend" cmd /k "set PATH=C:\Users\abhis\.gemini\antigravity\scratch\node\node-v20.18.0-win-x64;%%PATH%% && cd frontend && node node_modules\vite\bin\vite.js --port 3000"

echo ===================================================
echo ✅ Localhost Servers Launched!
echo 🌐 Frontend: http://localhost:3000
echo 📡 Backend:  http://localhost:5000/api/health
echo ===================================================
pause
