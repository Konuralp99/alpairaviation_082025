@echo off
REM ALPAIR AVIATION Sunucularini Baslatma Betigi
REM Bu betik, backend ve frontend gelistirme sunucularini
REM ayri pencerelerde otomatik olarak baslatir.

ECHO Sunucular baslatiliyor...

REM Betigin bulundugu dizine gecis yap
cd /d "%~dp0"

REM Backend sunucusunu yeni bir pencerede baslat
ECHO Backend sunucusu baslatiliyor...
start "ALPAIR Backend" cmd /k "cd backend && npm run dev"

REM Frontend sunucusunu yeni bir pencerede baslat
ECHO Frontend sunucusu baslatiliyor...
start "ALPAIR Frontend" cmd /k "cd frontend && npm run dev"

ECHO Iki sunucu da ayri pencerelerde baslatildi.
timeout /t 3 >nul
exit
