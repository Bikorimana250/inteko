#!/bin/bash

# =====================================================
# Inteko y'Abaturage - Database Initialization Script
# =====================================================

set -e

echo "==================================================="
echo "Inteko y'Abaturage - Database Setup"
echo "==================================================="
echo ""

# Configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-inteko_db}"
DB_USER="${DB_USER:-inteko_user}"
DB_PASSWORD="${DB_PASSWORD:-inteko_pass}"
POSTGRES_USER="${POSTGRES_USER:-postgres}"

echo "Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Check if PostgreSQL is running
echo "Checking PostgreSQL connection..."
if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" > /dev/null 2>&1; then
    echo "❌ Error: Cannot connect to PostgreSQL at $DB_HOST:$DB_PORT"
    echo ""
    echo "Please ensure PostgreSQL is running:"
    echo "  - Using Docker: docker-compose up -d"
    echo "  - Using system service: sudo systemctl start postgresql"
    echo ""
    exit 1
fi

echo "✅ PostgreSQL is running"
echo ""

# Check if database exists
echo "Checking if database exists..."
DB_EXISTS=$(PGPASSWORD="$POSTGRES_USER" psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" 2>/dev/null || echo "0")

if [ "$DB_EXISTS" = "1" ]; then
    echo "⚠️  Database '$DB_NAME' already exists"
    echo ""
    read -p "Do you want to drop and recreate it? (yes/no): " CONFIRM
    
    if [ "$CONFIRM" = "yes" ]; then
        echo "Dropping database..."
        PGPASSWORD="$POSTGRES_USER" psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -c "DROP DATABASE IF EXISTS $DB_NAME;" > /dev/null 2>&1
        echo "✅ Database dropped"
    else
        echo "Keeping existing database. Exiting..."
        exit 0
    fi
fi

# Create database
echo "Creating database '$DB_NAME'..."
PGPASSWORD="$POSTGRES_USER" psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -c "CREATE DATABASE $DB_NAME;" > /dev/null 2>&1
echo "✅ Database created"

# Check if user exists
echo "Checking if user exists..."
USER_EXISTS=$(PGPASSWORD="$POSTGRES_USER" psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" 2>/dev/null || echo "0")

if [ "$USER_EXISTS" = "0" ]; then
    echo "Creating user '$DB_USER'..."
    PGPASSWORD="$POSTGRES_USER" psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" > /dev/null 2>&1
    echo "✅ User created"
else
    echo "✅ User already exists"
fi

# Grant privileges
echo "Granting privileges..."
PGPASSWORD="$POSTGRES_USER" psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" > /dev/null 2>&1
PGPASSWORD="$POSTGRES_USER" psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO $DB_USER;" > /dev/null 2>&1
echo "✅ Privileges granted"

echo ""
echo "==================================================="
echo "✅ Database setup complete!"
echo "==================================================="
echo ""
echo "Next steps:"
echo "  1. Start the application with PostgreSQL profile:"
echo "     mvn spring-boot:run -Dspring-boot.run.profiles=postgres"
echo ""
echo "  2. Flyway will automatically run migrations"
echo ""
echo "  3. Connect to database:"
echo "     psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
echo ""
