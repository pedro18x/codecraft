#!/bin/bash
set -e  # Exit on error

# CodeCraft — Development Environment Initialization Script
# This script sets up the complete development environment from scratch

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
  echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}  $1${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
  echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

print_info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

# Check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Main script
print_header "CodeCraft — Development Environment Setup"

echo "This script will:"
echo "  1. Check prerequisites (Node.js, npm, Docker)"
echo "  2. Install dependencies"
echo "  3. Set up environment files"
echo "  4. Start PostgreSQL database"
echo "  5. Run database migrations and seed data"
echo "  6. Build the application"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Setup cancelled."
  exit 0
fi

# Step 1: Check Prerequisites
print_header "Step 1: Checking Prerequisites"

# Check Node.js
if command_exists node; then
  NODE_VERSION=$(node -v)
  print_success "Node.js installed: $NODE_VERSION"

  # Check if version is >= 20
  MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
  if [ "$MAJOR_VERSION" -lt 20 ]; then
    print_error "Node.js version must be >= 20. Current: $NODE_VERSION"
    exit 1
  fi
else
  print_error "Node.js not found. Please install Node.js >= 20 from https://nodejs.org"
  exit 1
fi

# Check npm
if command_exists npm; then
  NPM_VERSION=$(npm -v)
  print_success "npm installed: $NPM_VERSION"
else
  print_error "npm not found. Please install npm"
  exit 1
fi

# Check Docker
if command_exists docker; then
  DOCKER_VERSION=$(docker --version)
  print_success "Docker installed: $DOCKER_VERSION"
else
  print_warning "Docker not found. You'll need to set up PostgreSQL manually."
  print_info "Install Docker from https://www.docker.com/products/docker-desktop"
fi

# Check Docker Compose
if command_exists docker; then
  if docker compose version >/dev/null 2>&1; then
    COMPOSE_VERSION=$(docker compose version)
    print_success "Docker Compose installed: $COMPOSE_VERSION"
  else
    print_error "Docker Compose not found. Please update Docker to latest version."
    exit 1
  fi
fi

# Step 2: Install Dependencies
print_header "Step 2: Installing Dependencies"

print_info "Installing npm packages for all workspaces..."
npm install

if [ $? -eq 0 ]; then
  print_success "Dependencies installed successfully"
else
  print_error "Failed to install dependencies"
  exit 1
fi

# Step 3: Set Up Environment Files
print_header "Step 3: Setting Up Environment Files"

# Check if .env files exist
API_ENV="apps/api/.env"
WEB_ENV="apps/web/.env.local"

if [ -f "$API_ENV" ]; then
  print_success "API .env file already exists: $API_ENV"
else
  if [ -f "apps/api/.env.example" ]; then
    print_info "Copying apps/api/.env.example to $API_ENV"
    cp apps/api/.env.example "$API_ENV"
    print_success "Created $API_ENV from example"
  else
    print_warning "No .env.example found in apps/api"
    print_info "Creating minimal .env file..."
    cat > "$API_ENV" <<EOL
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://codecraft:codecraft@localhost:5433/codecraft
JWT_ACCESS_SECRET=dev-access-secret-change-me
JWT_REFRESH_SECRET=dev-refresh-secret-change-me
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
COOKIE_SECURE=false
EXECUTOR_URL=http://localhost:3002
EXECUTOR_SERVICE_TOKEN=dev-executor-service-token
EXECUTOR_TIMEOUT_MS=5000
EXECUTOR_MEMORY_LIMIT_MB=128
EOL
    print_success "Created minimal $API_ENV"
  fi
fi

if [ -f "$WEB_ENV" ]; then
  print_success "Web .env.local file already exists: $WEB_ENV"
else
  print_info "Creating $WEB_ENV"
  cat > "$WEB_ENV" <<EOL
NEXT_PUBLIC_API_URL=http://localhost:3001/api
EOL
  print_success "Created $WEB_ENV"
fi

# Step 4: Start PostgreSQL Database
print_header "Step 4: Starting PostgreSQL Database"

if command_exists docker; then
  print_info "Starting PostgreSQL container..."

  # Navigate to API directory for docker-compose
  cd apps/api

  # Check if container is already running
  if docker ps | grep -q postgres; then
    print_success "PostgreSQL container already running"
  else
    docker compose up -d

    if [ $? -eq 0 ]; then
      print_success "PostgreSQL container started"
      print_info "Waiting 5 seconds for PostgreSQL to initialize..."
      sleep 5
    else
      print_error "Failed to start PostgreSQL container"
      cd ../..
      exit 1
    fi
  fi

  # Return to root directory
  cd ../..

  # Check database connection
  print_info "Checking database connection..."
  if docker exec -i $(docker ps -q -f name=postgres) pg_isready -U codecraft >/dev/null 2>&1; then
    print_success "Database connection verified"
  else
    print_warning "Database might not be ready yet. Waiting 5 more seconds..."
    sleep 5
    if docker exec -i $(docker ps -q -f name=postgres) pg_isready -U codecraft >/dev/null 2>&1; then
      print_success "Database connection verified"
    else
      print_error "Failed to connect to database"
      print_info "You may need to run: cd apps/api && docker compose up -d"
      exit 1
    fi
  fi
else
  print_warning "Skipping database setup (Docker not available)"
  print_info "Please set up PostgreSQL manually and update DATABASE_URL in $API_ENV"
fi

# Step 5: Run Database Migrations and Seed Data
print_header "Step 5: Database Migrations & Seed Data"

if command_exists docker && docker ps | grep -q postgres; then
  print_info "Generating Prisma Client..."
  npm run db:generate -w @codecraft/api

  if [ $? -eq 0 ]; then
    print_success "Prisma Client generated"
  else
    print_error "Failed to generate Prisma Client"
    exit 1
  fi

  print_info "Running database migrations..."
  npm run db:push -w @codecraft/api

  if [ $? -eq 0 ]; then
    print_success "Database migrations completed"
  else
    print_error "Failed to run migrations"
    exit 1
  fi

  print_info "Seeding database with 50 coding problems..."
  npm run db:seed -w @codecraft/api

  if [ $? -eq 0 ]; then
    print_success "Database seeded successfully (50 problems)"
  else
    print_error "Failed to seed database"
    exit 1
  fi
else
  print_warning "Skipping migrations/seeding (database not available)"
fi

# Step 6: Build Applications
print_header "Step 6: Building Applications"

print_info "Running type checks..."
npm run type-check

if [ $? -eq 0 ]; then
  print_success "Type checks passed"
else
  print_warning "Type checks failed (non-blocking)"
fi

print_info "Building Next.js application..."
npm run build

if [ $? -eq 0 ]; then
  print_success "Next.js build successful"
else
  print_error "Next.js build failed"
  exit 1
fi

print_info "Building API..."
npm run build -w @codecraft/api

if [ $? -eq 0 ]; then
  print_success "API build successful"
else
  print_error "API build failed"
  exit 1
fi

# Final Summary
print_header "Setup Complete! 🎉"

echo -e "${GREEN}✓ Development environment ready${NC}\n"

echo "Next steps:"
echo ""
echo "  1. Start the development servers:"
echo -e "     ${BLUE}npm run dev:api${NC}     # Start API server (http://localhost:3001)"
echo -e "     ${BLUE}npm run dev${NC}         # Start Next.js web app (http://localhost:3000)"
echo ""
echo "  2. Or use the quickstart script:"
echo -e "     ${BLUE}./dev.sh${NC}            # Starts both API and web in parallel"
echo ""
echo "  3. Access the application:"
echo -e "     ${BLUE}http://localhost:3000${NC}    # Landing page"
echo -e "     ${BLUE}http://localhost:3000/dashboard${NC}    # Dashboard (requires auth)"
echo -e "     ${BLUE}http://localhost:3001/api/health${NC}   # API health check"
echo ""
echo "  4. Useful commands:"
echo -e "     ${BLUE}npm run lint${NC}        # Run ESLint"
echo -e "     ${BLUE}npm run type-check${NC}  # Run TypeScript checks"
echo -e "     ${BLUE}npm run test:api${NC}    # Run API tests"
echo -e "     ${BLUE}npm run test:e2e${NC}    # Run E2E tests"
echo ""
echo "  5. Database tools:"
echo -e "     ${BLUE}npm run db:studio -w @codecraft/api${NC}  # Prisma Studio (GUI)"
echo ""

print_info "Documentation: See CLAUDE.md, apps/web/CLAUDE.md, apps/api/CLAUDE.md"
print_info "Problems seeded: 50 (Two Sum → Unique Paths)"

echo ""
print_success "Happy coding! 🚀"
echo ""
