@echo off
REM Setup H2 File-Based Database for Inteko Backend
REM Use this if you don't have Docker

echo ========================================
echo Inteko Backend - H2 File Database Setup
echo ========================================
echo.

cd /d "%~dp0.."

REM Create data directory
if not exist "data" (
    echo Creating data directory...
    mkdir data
    echo Created: backend\data
) else (
    echo Data directory already exists
)
echo.

REM Update application-dev.yml for file-based H2
echo Configuring H2 for file-based storage...
powershell -Command "(Get-Content 'src\main\resources\application-dev.yml') -replace 'jdbc:h2:mem:inteko_db', 'jdbc:h2:file:./data/inteko_db;AUTO_SERVER=TRUE' | Set-Content 'src\main\resources\application-dev.yml'"

echo.
echo ========================================
echo H2 File Database configured!
echo ========================================
echo Database file: backend\data\inteko_db.mv.db
echo.
echo Now set the profile and start backend:
echo   cd backend
echo   echo SPRING_PROFILES_ACTIVE=dev >> .env
echo   mvn clean
echo   mvn spring-boot:run
echo ========================================
echo.
pause
