#!/usr/bin/env bash
set -e
echo "Installing backend dependencies..."
cd backend
npm ci || npm install
echo "Installing frontend dependencies..."
cd ../frontend
npm ci || npm install
echo "Done. To build frontend run: cd frontend && npm run build"
