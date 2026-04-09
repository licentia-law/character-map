@echo off
SET PATH=C:\Program Files\nodejs;%PATH%
cd /d "%~dp0client"
npm run dev
