#!/usr/bin/env bash
set -e
cd frontend
npm ci || npm install
echo "Frontend dependencies installed."
