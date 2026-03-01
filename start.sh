#!/bin/bash

# CodeCraft — Development Server Startup Script
# Starts all required services for local development

# Exit on Ctrl+C
trap cleanup SIGINT SIGTERM

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Process tracking
PIDS=()

# Helper functions
print_header() {
  echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}  $1${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
  echo -e "${GREEN}✓${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

print_info() {
  echo -e "${CYAN}ℹ${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

# Cleanup function to kill all child processes
cleanup() {
  echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}  Shutting down services...${NC}"
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

  # Kill all child processes
  for pid in "${PIDS[@]}"; do
    if kill -0 "$pid" 2>/dev/null; then
      print_info "Stopping process $pid..."
      kill -TERM "$pid" 2>/dev/null
    fi
  done

  # Wait for graceful shutdown
  sleep 2

  # Force kill if still running
  for pid in "${PIDS[@]}"; do
    if kill -0 "$pid" 2>/dev/null; then
      print_warning "Force killing process $pid..."
      kill -9 "$pid" 2>/dev/null
    fi
  done

  print_success "All services stopped"
  exit 0
}

# Check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check if port is in use
port_in_use() {
  lsof -i :"$1" >/dev/null 2>&1
}

# Wait for service to be ready
wait_for_service() {
  local url=$1
  local name=$2
  local max_attempts=30
  local attempt=0

  while [ $attempt -lt $max_attempts ]; do
    if curl -s "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
    ((attempt++))
  done

  return 1
}

# Main script
clear
print_header "CodeCraft — Starting Development Environment"

# Step 1: Check prerequisites
print_info "Checking prerequisites..."

# Check Node.js
if ! command_exists node; then
  print_error "Node.js not found. Please install Node.js >= 20"
  exit 1
fi

# Check npm
if ! command_exists npm; then
  print_error "npm not found. Please install npm"
  exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  print_error "node_modules not found. Please run: npm install"
  exit 1
fi

print_success "Prerequisites check passed"

# Step 2: Check database
print_info "Checking database connection..."

if command_exists docker; then
  # Check if PostgreSQL container is running
  if ! docker ps | grep -q postgres; then
    print_warning "PostgreSQL container not running"
    print_info "Starting PostgreSQL..."

    cd apps/api
    docker compose up -d
    cd ../..

    if [ $? -eq 0 ]; then
      print_success "PostgreSQL started"
      sleep 3  # Wait for initialization
    else
      print_error "Failed to start PostgreSQL"
      print_info "Please start manually: cd apps/api && docker compose up -d"
    fi
  else
    print_success "PostgreSQL is running"
  fi
else
  print_warning "Docker not found - skipping database check"
  print_info "Ensure PostgreSQL is running manually on localhost:5433"
fi

# Step 3: Check for port conflicts
print_info "Checking for port conflicts..."

CONFLICTS=0

if port_in_use 3000; then
  print_warning "Port 3000 is already in use (Next.js web app)"
  CONFLICTS=1
fi

if port_in_use 3001; then
  print_warning "Port 3001 is already in use (Express API)"
  CONFLICTS=1
fi

if port_in_use 3002; then
  print_warning "Port 3002 is already in use (Executor service)"
fi

if [ $CONFLICTS -eq 1 ]; then
  echo ""
  read -p "Ports are in use. Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Cancelled. Stop conflicting services and try again."
    exit 0
  fi
fi

# Step 4: Start services
print_header "Starting Services"

echo -e "${MAGENTA}[API]${NC} Starting Express API on http://localhost:3001"
npm run dev:api > >(sed "s/^/$(echo -e ${MAGENTA})[API]$(echo -e ${NC}) /") 2>&1 &
API_PID=$!
PIDS+=($API_PID)

sleep 2  # Give API a head start

echo -e "${CYAN}[WEB]${NC} Starting Next.js web app on http://localhost:3000"
npm run dev > >(sed "s/^/$(echo -e ${CYAN})[WEB]$(echo -e ${NC}) /") 2>&1 &
WEB_PID=$!
PIDS+=($WEB_PID)

# Step 5: Wait for services to be ready
print_header "Waiting for Services"

print_info "Waiting for API to be ready..."
if wait_for_service "http://localhost:3001/api/health" "API"; then
  print_success "API is ready at http://localhost:3001"
else
  print_warning "API health check timed out (may still be starting)"
fi

print_info "Waiting for Next.js to be ready..."
if wait_for_service "http://localhost:3000" "Next.js"; then
  print_success "Next.js is ready at http://localhost:3000"
else
  print_warning "Next.js health check timed out (may still be starting)"
fi

# Step 6: Display status
print_header "CodeCraft Development Environment Ready! 🚀"

echo -e "${GREEN}✓ All services started successfully${NC}\n"

echo "Access points:"
echo -e "  ${CYAN}Web App:${NC}       http://localhost:3000"
echo -e "  ${CYAN}Dashboard:${NC}     http://localhost:3000/dashboard"
echo -e "  ${CYAN}Practice:${NC}      http://localhost:3000/practice/two-sum"
echo -e "  ${MAGENTA}API:${NC}           http://localhost:3001"
echo -e "  ${MAGENTA}API Health:${NC}    http://localhost:3001/api/health"
echo -e "  ${MAGENTA}API Docs:${NC}      http://localhost:3001/api (if enabled)"
echo ""

echo "Running processes:"
echo -e "  ${MAGENTA}API Server:${NC}    PID $API_PID (port 3001)"
echo -e "  ${CYAN}Web Server:${NC}    PID $WEB_PID (port 3000)"
echo ""

echo "Commands:"
echo -e "  ${YELLOW}Ctrl+C${NC}         Stop all services"
echo -e "  ${BLUE}npm run db:studio -w @codecraft/api${NC}  Open Prisma Studio"
echo ""

print_info "Logs will appear below (color-coded by service)"
print_info "Press Ctrl+C to stop all services gracefully"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Wait for all background processes
wait
