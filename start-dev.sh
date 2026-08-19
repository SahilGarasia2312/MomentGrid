#!/bin/bash
echo "Starting local MongoDB..."
docker compose up -d

echo "Starting Backend..."
cd backend && npm run dev &

echo "Starting Frontend..."
cd frontend && npm run dev &

echo "Development environment is running! Press Ctrl+C to stop."
wait
