@echo off

set /p commitMessage="Commit message: "

git status

git add .

git commit -m "%commitMessage%"

if errorlevel 1 (
    echo Commit failed.
    pause
    exit /b
)

git push origin main

pause