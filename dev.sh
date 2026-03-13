#!/bin/bash

# CodeCraft — Unified Development Script
# Usage:
#   ./dev.sh            start all services (default)
#   ./dev.sh stop       stop services on dev ports
#   ./dev.sh restart    stop then start

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

print_header() {
  echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}  $1${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_error()   { echo -e "${RED}✗${NC} $1"; }
print_info()    { echo -e "${CYAN}ℹ${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }

# macOS-safe log prefixing — avoids the fragile >(sed ...) process substitution
prefix_output() {
  local label=$1 color=$2
  while IFS= read -r line; do
    echo -e "${color}[${label}]${NC} ${line}"
  done
}

# ──────────────────────────────────────────────────────────────────────────────
# cmd_stop — free ports 3000, 3001, 3002
# ──────────────────────────────────────────────────────────────────────────────
cmd_stop() {
  print_header "CodeCraft — Stopping Services"

  local ports=(3000 3001 3002)
  local names=("Next.js Web" "Express API" "Executor Service")

  for i in "${!ports[@]}"; do
    local port=${ports[$i]}
    local name=${names[$i]}
    local pids
    pids=$(lsof -ti :"$port" 2>/dev/null)

    if [ -z "$pids" ]; then
      print_success "Port $port ($name) — already clear"
      continue
    fi

    print_info "Stopping port $port ($name) — PID(s): $pids"
    echo "$pids" | xargs kill -TERM 2>/dev/null
    sleep 1

    # Force-kill anything still alive
    pids=$(lsof -ti :"$port" 2>/dev/null)
    if [ -n "$pids" ]; then
      echo "$pids" | xargs kill -9 2>/dev/null
    fi

    if ! lsof -ti :"$port" >/dev/null 2>&1; then
      print_success "Port $port freed"
    else
      print_warning "Port $port may still be in use"
    fi
  done

  echo ""
  print_info "To start again: ./dev.sh"
  echo ""
}

# ──────────────────────────────────────────────────────────────────────────────
# cmd_start — start API + Web with DB check and prefixed logs
# ──────────────────────────────────────────────────────────────────────────────
cmd_start() {
  print_header "CodeCraft — Starting Development Environment"

  # 1. DB check
  if command -v docker >/dev/null 2>&1; then
    if ! docker ps 2>/dev/null | grep -q postgres; then
      print_warning "PostgreSQL container not running — starting it..."
      (cd apps/api && docker compose up -d) 2>/dev/null

      # Poll pg_isready up to 10s
      local ready=0
      for i in $(seq 1 10); do
        local pg_container
        pg_container=$(docker ps -q -f name=postgres 2>/dev/null | head -1)
        if [ -n "$pg_container" ] && docker exec "$pg_container" pg_isready -U codecraft >/dev/null 2>&1; then
          ready=1
          break
        fi
        sleep 1
      done

      if [ "$ready" -eq 1 ]; then
        print_success "PostgreSQL is ready"
      else
        print_warning "PostgreSQL did not respond in 10s — API may fail to connect"
      fi
    else
      print_success "PostgreSQL is running"
    fi
  else
    print_warning "Docker not found — skipping DB check (ensure Postgres is up on localhost:5433)"
  fi

  # 2. Port conflict warnings (non-blocking)
  for port in 3000 3001; do
    if lsof -i :"$port" >/dev/null 2>&1; then
      print_warning "Port $port is already in use — service may fail to bind"
    fi
  done

  # 3. Graceful shutdown trap — kills entire process group
  cleanup() {
    echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}  Shutting down...${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
    kill 0
    exit 0
  }
  trap cleanup SIGINT SIGTERM

  # 4. Start services with prefixed output
  print_info "Starting Express API on http://localhost:3001"
  npm run dev:api 2>&1 | prefix_output "API" "$MAGENTA" &

  print_info "Starting Next.js web on http://localhost:3000"
  npm run dev 2>&1 | prefix_output "WEB" "$CYAN" &

  # 5. Print URLs immediately (no health-check polling)
  echo ""
  echo -e "${GREEN}Services launching...${NC}"
  echo ""
  echo "  ${CYAN}Web:${NC}        http://localhost:3000"
  echo "  ${CYAN}Dashboard:${NC}  http://localhost:3000/dashboard"
  echo "  ${MAGENTA}API:${NC}        http://localhost:3001"
  echo "  ${MAGENTA}Health:${NC}     http://localhost:3001/api/health"
  echo ""
  echo -e "  ${YELLOW}Ctrl+C${NC} to stop all services"
  echo ""

  # 6. Hold terminal until Ctrl+C
  wait
}

# ──────────────────────────────────────────────────────────────────────────────
# Entry point
# ──────────────────────────────────────────────────────────────────────────────
case "${1:-start}" in
  stop)
    cmd_stop
    ;;
  restart)
    cmd_stop
    cmd_start
    ;;
  start|"")
    cmd_start
    ;;
  *)
    echo "Usage: $0 [start|stop|restart]"
    exit 1
    ;;
esac
