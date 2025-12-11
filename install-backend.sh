#!/usr/bin/env bash
set -e
cd backend
npm ci || npm install
echo "Backend dependencies installed."
