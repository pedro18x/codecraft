#!/bin/bash

# CodeCraft — Stop Development Servers
# Stops all running development services and cleans up ports

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

print_header() {
  echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${CYAN}  $1${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
  echo -e "${GREEN}✓${NC} $1"
}

print_info() {
  echo -e "${CYAN}ℹ${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

print_header "CodeCraft — Stopping Development Services"

# Function to kill processes on a port
kill_port() {
  local port=$1
  local name=$2

  print_info "Checking port $port ($name)..."

  # Find PIDs using the port
  PIDS=$(lsof -ti :$port 2>/dev/null)

  if [ -z "$PIDS" ]; then
    print_success "Port $port is not in use"
    return 0
  fi

  # Kill all processes
  echo "$PIDS" | while read -r pid; do
    if [ -n "$pid" ]; then
      print_info "Stopping process $pid on port $port..."
      kill -TERM "$pid" 2>/dev/null || kill -9 "$pid" 2>/dev/null
    fi
  done

  # Wait a moment
  sleep 1

  # Verify port is free
  if ! lsof -ti :$port >/dev/null 2>&1; then
    print_success "Port $port freed ($name stopped)"
  else
    print_warning "Port $port may still be in use"
  fi
}

# Stop services on common ports
kill_port 3000 "Next.js Web"
kill_port 3001 "Express API"
kill_port 3002 "Executor Service"

# Also kill any node processes that match our package names
print_info "Checking for lingering Node.js processes..."

# Find and kill processes matching our project
LINGERING=$(ps aux | grep -E "node.*(@codecraft|next|tsx)" | grep -v grep | awk '{print $2}')

if [ -n "$LINGERING" ]; then
  echo "$LINGERING" | while read -r pid; do
    if [ -n "$pid" ]; then
      print_info "Killing lingering process $pid..."
      kill -9 "$pid" 2>/dev/null
    fi
  done
  print_success "Cleaned up lingering processes"
else
  print_success "No lingering processes found"
fi

print_header "All Services Stopped 🛑"

echo "To start development again, run:"
echo -e "  ${CYAN}./start.sh${NC}     # Full startup with health checks"
echo -e "  ${CYAN}./dev.sh${NC}       # Quick start (no health checks)"
echo ""
