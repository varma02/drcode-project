#!/bin/bash

# Export the environment variables needed to connect to the database
export DB_URL="ws://localhost:8000/rpc"
export DB_NAMESPACE="DRCODE"
export DB_DATABASE="main"
export DB_USERNAME="root"
export DB_PASSWORD="root"

# Run the database initialization script
echo "Resetting database..."
bun run src/database/cli.ts reset

echo "Database reset complete!"
