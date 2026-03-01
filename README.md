# CodeCraft

**CodeCraft** is a neo-brutalist coding interview preparation platform with 50 curated problems for focused practice.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TailwindCSS v4, TypeScript
- **API:** Express 4, Prisma 6, PostgreSQL, Zod v3, JWT auth, Vitest
- **Database:** PostgreSQL 16 (Docker)
- **Auth:** httpOnly cookie sessions (access + refresh), refresh-token rotation
- **Security:** CORS allowlist, Helmet, CSRF double-submit token, rate limiting
- **Executor:** Isolated code execution service (Docker-based)

## Project Structure

```
├── apps/
│   ├── web/              # Next.js 16 frontend
│   │   ├── src/app/      # App Router pages
│   │   ├── src/components/
│   │   ├── src/hooks/
│   │   └── src/lib/
│   └── api/              # Express API
│       ├── src/
│       │   ├── routes/   # API endpoints
│       │   ├── services/ # Business logic
│       │   ├── middleware/
│       │   └── utils/
│       └── prisma/       # Database schema & migrations
├── docs/
│   ├── memory/           # Implementation history
│   ├── plans/            # Implementation plans
│   └── adr/              # Architecture decisions
└── init.sh               # Development setup script
```

## Quick Start

### Automated Setup (Recommended)

Run the initialization script to set up everything automatically:

```bash
./init.sh
```

This will:
1. ✓ Check prerequisites (Node.js >= 20, npm, Docker)
2. ✓ Install all dependencies
3. ✓ Create environment files
4. ✓ Start PostgreSQL database
5. ✓ Run migrations and seed 50 problems
6. ✓ Build both applications

### Manual Setup

#### 1. Prerequisites

- **Node.js >= 20** ([download](https://nodejs.org))
- **npm** (comes with Node.js)
- **Docker Desktop** ([download](https://www.docker.com/products/docker-desktop))

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Set Up Environment Files

**API (.env):**
```bash
cp apps/api/.env.example apps/api/.env
```

**Web (.env.local):**
```bash
cat > apps/web/.env.local <<EOF
NEXT_PUBLIC_API_URL=http://localhost:3001/api
EOF
```

#### 4. Start PostgreSQL Database

```bash
cd apps/api
docker compose up -d
cd ../..
```

#### 5. Run Database Migrations & Seed Data

```bash
npm run db:generate -w @codecraft/api
npm run db:push -w @codecraft/api
npm run db:seed -w @codecraft/api
```

#### 6. Build Applications

```bash
npm run build
npm run build -w @codecraft/api
```

## Development

### Start Development Servers

**Option 1: Separate terminals**
```bash
# Terminal 1: API server (http://localhost:3001)
npm run dev:api

# Terminal 2: Web app (http://localhost:3000)
npm run dev
```

**Option 2: Parallel script**
```bash
./dev.sh  # Starts both API and web
```

### Access Points

- **Landing Page:** [http://localhost:3000](http://localhost:3000)
- **Dashboard:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard) (requires auth)
- **Practice:** [http://localhost:3000/practice/two-sum](http://localhost:3000/practice/two-sum)
- **API Health:** [http://localhost:3001/api/health](http://localhost:3001/api/health)

## Available Commands

### Root Commands

```bash
npm run dev           # Start Next.js web app
npm run dev:api       # Start Express API server
npm run build         # Build Next.js production bundle
npm run build:api     # Build API TypeScript to JS
npm run type-check    # Run TypeScript type checking
npm run lint          # Run ESLint
npm run test:e2e      # Run Playwright E2E tests
npm run test:api      # Run Vitest API tests
```

### Workspace-Specific Commands

```bash
# Run command in specific workspace
npm run <script> -w @codecraft/web
npm run <script> -w @codecraft/api

# Install dependency to workspace
npm install <package> -w @codecraft/web
npm install <package> -w @codecraft/api
```

### Database Commands

```bash
npm run db:generate -w @codecraft/api  # Generate Prisma Client
npm run db:migrate -w @codecraft/api   # Create new migration
npm run db:push -w @codecraft/api      # Push schema to database
npm run db:seed -w @codecraft/api      # Seed 50 coding problems
npm run db:studio -w @codecraft/api    # Open Prisma Studio GUI
```

## Quality Gates

Before committing, ensure all checks pass:

```bash
npm run type-check    # Must pass with 0 errors
npm run lint          # Must pass with 0 errors
npm run test:api      # All Vitest tests green
npm run test:e2e      # Playwright E2E tests
npm run build         # Production build succeeds
```

## Features

### 50 Coding Problems

Problems range from Easy to Hard across categories:
- Arrays, Hash Tables, Strings
- Two Pointers, Sliding Window
- Dynamic Programming, Greedy
- Binary Search, Sorting
- Math, Bit Manipulation

**Example problems:**
- Two Sum, Valid Palindrome, FizzBuzz (Easy)
- Longest Substring Without Repeating Characters, Maximum Subarray (Medium)
- Container With Most Water, 3Sum, Search in Rotated Sorted Array (Medium)

### Authentication & Security

- JWT-based auth with refresh token rotation
- httpOnly cookies (no localStorage)
- CSRF protection on mutating routes
- Rate limiting on auth endpoints
- Helmet security headers
- CORS allowlist

### Code Execution

- Isolated Docker-based executor service
- Memory limits: 128MB
- Timeout: 5 seconds
- Supported languages: JavaScript, TypeScript

### AI-Powered Hints

- Progressive hint system (3 levels)
- Error diagnosis with AI suggestions
- Streaming Server-Sent Events (SSE)

## Architecture

### Monorepo Strategy

- **npm workspaces** for dependency management
- **Workspace-scoped scripts** (`-w` flag) from root
- **Shared types** via TypeScript path aliases
- **Independent deployments** (web + API)

### Authentication Flow

1. User registers/logs in → API returns access token (15m) + refresh token (7d)
2. Tokens stored in httpOnly cookies
3. Refresh token rotation on every refresh (invalidates old family)
4. CSRF token in separate cookie for mutation protection

### Database Schema

- **Users** - email, username, password (bcrypt)
- **Problems** - title, slug, difficulty, categories, test cases, hints
- **Progress** - user attempts, completion status
- **SavedCode** - user's code per problem/language
- **Submissions** - execution history with results
- **RefreshTokens** - token rotation tracking

## Deployment

### Environment Variables (Production)

**API:**
```bash
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>
COOKIE_SECURE=true
CORS_ORIGIN=https://yourapp.com
EXECUTOR_URL=https://executor.yourapp.com
```

**Web:**
```bash
NEXT_PUBLIC_API_URL=https://api.yourapp.com/api
```

### Build & Deploy

```bash
# Build for production
npm run build
npm run build -w @codecraft/api

# Start production servers
npm start -w @codecraft/api  # API on port 3001
npm start -w @codecraft/web  # Web on port 3000
```

## Documentation

- **Project Rules:** [CLAUDE.md](CLAUDE.md)
- **Web App Rules:** [apps/web/CLAUDE.md](apps/web/CLAUDE.md)
- **API Rules:** [apps/api/CLAUDE.md](apps/api/CLAUDE.md)
- **Implementation History:** [docs/memory/](docs/memory/)
- **Architecture Decisions:** [docs/adr/](docs/adr/)

## Contributing

1. Read [CLAUDE.md](CLAUDE.md) for workspace commands and conventions
2. Create feature branch from `dev`
3. Run quality gates before committing
4. Create memory entry in `docs/memory/YYYY-MM-DD-feature-name.md`
5. Submit PR to `dev` branch

## License

MIT

## Support

For issues or questions, see [GitHub Issues](https://github.com/yourusername/codecraft/issues)
