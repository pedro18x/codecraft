#!/bin/bash

# CodeCraft — Quick Development Server Startup
# Simple script to start API and Web in parallel (no health checks)

# Exit on Ctrl+C
trap 'kill 0' SIGINT

# Colors
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  CodeCraft — Quick Start${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${MAGENTA}[API]${NC} Starting on http://localhost:3001"
echo -e "${CYAN}[WEB]${NC} Starting on http://localhost:3000"
echo -e "\n${YELLOW}Press Ctrl+C to stop all services${NC}\n"

# Start both services in parallel
npm run dev:api &
npm run dev &

# Wait for both processes
wait
