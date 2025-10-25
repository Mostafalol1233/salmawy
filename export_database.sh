#!/bin/bash
# Export database from Replit to SQL file

echo "Exporting database from Replit..."

# Export schema and data to SQL file
pg_dump $DATABASE_URL > database_backup.sql

echo "✅ Database exported to: database_backup.sql"
echo ""
echo "Next steps:"
echo "1. Download the database_backup.sql file"
echo "2. Go to your Neon project"
echo "3. Use psql or Neon's SQL Editor to import the data"
echo "4. Or run: psql YOUR_NEON_DATABASE_URL < database_backup.sql"
