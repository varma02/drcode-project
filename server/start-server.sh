#!/bin/bash
export API_PORT="3000"
export JWT_SECRET="verysecure"
export DB_URL="ws://localhost:8000/rpc"
export DB_NAMESPACE="DRCODE"
export DB_DATABASE="main" 
export DB_USERNAME="root"
export DB_PASSWORD="root"

# Reset the database first
bun run db reset

# Start the server
bun run dev

