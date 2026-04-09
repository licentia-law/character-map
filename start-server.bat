@echo off
SET PATH=C:\Program Files\nodejs;%PATH%
cd /d "%~dp0server"
npm run dev
