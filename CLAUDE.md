# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

This is a pnpm monorepo managed by Turborepo (Node 22.14.0, pnpm 10.24.0).

```bash
# Install all dependencies
pnpm install

# Run all apps in development mode
pnpm run dev

# Build all apps
pnpm run build

# Lint all apps
pnpm run lint

# Run tests (server only)
pnpm run test

# Format code
pnpm run format
```

### App-Specific Commands

**Client (apps/client):**
```bash
pnpm --filter client dev      # Next.js dev server (port 3000)
pnpm --filter client build    # Production build
pnpm --filter client test:e2e # Playwright E2E tests
```

**Server (apps/server):**
```bash
pnpm --filter server dev      # Nodemon dev server (port 8080)
pnpm --filter server build    # TypeScript compile
pnpm --filter server test     # Jest unit tests
```

**Database (packages/database):**
```bash
pnpm --filter database db:push          # Push schema to database
pnpm --filter database db:migrate:create # Generate migration
pnpm --filter database db:migrate:run    # Run migrations
```

## Architecture Overview

**Artificial Unintelligence** is an online multiplayer party game where players compete to create the funniest AI-generated images in response to prompts. Think Quiplash but with AI images.

### Monorepo Structure

- `apps/client` - Next.js 16 frontend (React 19, Tailwind CSS 4)
- `apps/server` - Express 5 backend with Socket.io for real-time communication
- `packages/database` - Shared Drizzle ORM schema and PostgreSQL connection
- `packages/eslint-config-custom` - Shared ESLint configuration
- `packages/tsconfig` - Shared TypeScript configuration

### Key Technologies

- **Real-time**: Socket.io for WebSocket communication between client and server
- **State Machine**: XState v5 manages client-side game state flow (`apps/client/src/components/game/game-machine.tsx`)
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: NextAuth v4 with Google OAuth
- **AI Images**: Replicate API for image generation
- **Caching**: Redis for session caching and rate limiting

### Game Flow

The game state machine (`game-machine.tsx`) controls the UI flow:
1. `connectingToMainframe` → `connectionEstablished` → `prompt` (generation phase)
2. `promptSubmitted` → `promptDone` → `faceOff` → `faceOffResults` (voting phase)
3. Repeats for 3 rounds, then `winnerLeadUp` → `winner` → `leaderboard`

### Server Architecture

- `src/handlers/` - Socket.io event handlers (connection, room, game, generation, vote)
- `src/services/` - Business logic layer
- `src/controllers/` - HTTP request handlers
- `src/routes/` - Express route definitions
- `src/middleware/` - Auth middleware for both HTTP and WebSocket

### Database Schema (packages/database/schema.ts)

Core tables: `users`, `rooms`, `games`, `questions`, `generations`, `votes`
- Users join rooms, rooms host games
- Games have multiple rounds with questions assigned to player pairs
- Players submit generations (AI images) for questions
- Other players vote on generations in face-offs

## Environment Variables

**Server (.env):**
- `PORT`, `DATABASE_URL`, `OPENAI_API_KEY`, `REPLICATE_API_TOKEN`, `REDIS_URL`

**Client (.env.local):**
- `NEXT_PUBLIC_API_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OPENAI_API_KEY`
