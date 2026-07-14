@echo off
REM Setup PostgreSQL for Inteko Backend Defense Build
REM Run this script to start PostgreSQL in Docker

echo ========================================
echo Inteko Backend - PostgreSQL Setup
echo ========================================
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running
    echo Please start Docker Desktop and try again
    pause
    exit /b 1
)

echo Docker is running...
echo.

REM Stop and remove existing container if it exists
echo Checking for existing inteko-postgres container...
docker stop inteko-postgres >nul 2>&1
docker rm inteko-postgres >nul 2>&1
echo Cleaned up any existing containers
echo.

REM Start PostgreSQL container
echo Starting PostgreSQL container...
docker run --name inteko-postgres ^
  -e POSTGRES_PASSWORD=nelson ^
  -e POSTGRES_USER=nelson ^
  -e POSTGRES_DB=inteko_db ^
  -p 5432:5432 ^
  -d postgres:15

if %errorlevel% neq 0 (
    echo ERROR: Failed to start PostgreSQL container
    pause
    exit /b 1
)

echo.
echo ========================================
echo PostgreSQL is running!
echo ========================================
echo Database: inteko_db
echo User: nelson
echo Password: nelson
echo Port: 5432
echo.
echo You can now start the backend:
echo   cd backend
echo   mvn clean
echo   mvn spring-boot:run
echo ========================================
echo.
pause
