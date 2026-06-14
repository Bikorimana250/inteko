#!/bin/bash

# =====================================================
# Test Database Connection
# =====================================================

set -e

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-inteko_db}"
DB_USER="${DB_USER:-inteko_user}"

echo "Testing connection to PostgreSQL..."
echo "Host: $DB_HOST:$DB_PORT"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo ""

# Test connection
if PGPASSWORD="${DB_PASSWORD:-inteko_pass}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Connection successful!"
    echo ""
    
    # Get database info
    echo "Database Information:"
    PGPASSWORD="${DB_PASSWORD:-inteko_pass}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "
    SELECT 
        'PostgreSQL Version' AS info, 
        split_part(version(), ' ', 2) AS value
    UNION ALL
    SELECT 'Database Size', pg_size_pretty(pg_database_size('$DB_NAME'))
    UNION ALL
    SELECT 'Table Count', COUNT(*)::TEXT 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    "
else
    echo "❌ Connection failed!"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check if PostgreSQL is running:"
    echo "     docker ps | grep postgres"
    echo "  2. Verify credentials in .env file"
    echo "  3. Check firewall settings"
    exit 1
fi
