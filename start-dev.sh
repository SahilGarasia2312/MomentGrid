#!/bin/bash
echo "Starting local MongoDB..."
docker compose up -d

# Function to find next available port
find_port() {
    local port=$1
    while lsof -i :$port >/dev/null 2>&1; do
        port=$((port + 1))
    done
    echo $port
}

BACKEND_PORT=$(find_port 4000)
FRONTEND_PORT=$(find_port 3000)

echo "Starting Backend on port $BACKEND_PORT..."
export PORT=$BACKEND_PORT
export CLIENT_URL="http://localhost:$FRONTEND_PORT"
cd backend && npm run dev &
BACKEND_PID=$!

echo "Starting Frontend on port $FRONTEND_PORT..."
export PORT=$FRONTEND_PORT
export NEXT_PUBLIC_API_URL="http://localhost:$BACKEND_PORT"
cd frontend && npm run dev &
FRONTEND_PID=$!

cleanup() {
    echo "Stopping servers..."
    # Remove traps to prevent infinite recursion when we kill the process group
    trap - SIGINT SIGTERM
    kill -TERM 0
}

trap cleanup SIGINT SIGTERM

echo "Development environment is running! Press Ctrl+C to stop."
wait
