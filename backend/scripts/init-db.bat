@echo off
REM =====================================================
REM Inteko y'Abaturage - Database Initialization Script (Windows)
REM =====================================================

setlocal enabledelayedexpansion

echo ===================================================
echo Inteko y'Abaturage - Database Setup
echo ===================================================
echo.

REM Configuration
if "%DB_HOST%"=="" set DB_HOST=localhost
if "%DB_PORT%"=="" set DB_PORT=5432
if "%DB_NAME%"=="" set DB_NAME=inteko_db
if "%DB_USER%"=="" set DB_USER=inteko_user
if "%DB_PASSWORD%"=="" set DB_PASSWORD=inteko_pass
if "%POSTGRES_USER%"=="" set POSTGRES_USER=postgres

echo Database Configuration:
echo   Host: %DB_HOST%
echo   Port: %DB_PORT%
echo   Database: %DB_NAME%
echo   User: %DB_USER%
echo.

REM Check if Docker is being used
echo Checking PostgreSQL connection...
docker ps -q -f name=inteko-postgres >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Using Docker container
    set USE_DOCKER=1
) else (
    set USE_DOCKER=0
)

if %USE_DOCKER% EQU 1 (
    echo Checking Docker container status...
    docker ps -f name=inteko-postgres -f status=running -q >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo Starting PostgreSQL container...
        cd ..
        docker-compose up -d postgres
        timeout /t 5 /nobreak >nul
        cd scripts
    )
    echo PostgreSQL is running
    echo.
    
    echo Database will be initialized automatically by Flyway
    echo when you start the application.
    echo.
    echo Next steps:
    echo   1. Start the application with PostgreSQL profile:
    echo      mvn spring-boot:run -Dspring-boot.run.profiles=postgres
    echo.
    echo   2. Or using Docker:
    echo      docker-compose up backend
    echo.
) else (
    echo Please ensure PostgreSQL is running or use Docker:
    echo   docker-compose up -d
    echo.
)

echo ===================================================
echo Database setup script completed
echo ===================================================
echo.

endlocal
