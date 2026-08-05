# TruthGuard AI

AI-powered misinformation detection platform that helps users verify whether online information is trustworthy.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui-style components
- **Animation:** Framer Motion
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Icons:** Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
/app                  # Next.js App Router pages
  /(auth)             # Authentication pages (login, register, forgot-password)
  /(dashboard)        # Protected dashboard pages
/components           # Reusable UI components
  /ui                 # Base UI components (Button, Card, Input, etc.)
  /layout             # Layout components (Navbar, Sidebar, Footer)
  /charts             # Chart components
/features             # Feature-specific modules
  /auth               # Authentication forms and schemas
  /landing            # Landing page sections
/hooks                # Custom React hooks
/services             # API services and mock data
/types                # TypeScript type definitions
/utils                # Constants and utilities
/lib                  # Shared utilities (cn, formatters)
/styles               # Global styles
```

## Features

- **Landing Page** — Hero, features, how-it-works, CTA, footer
- **Authentication** — Login, register, forgot password with Zod validation
- **Dashboard** — Stats widgets, charts, recent activity
- **Verify Content** — Text, URL, image, PDF, video upload with drag-and-drop
- **Results Page** — Trust score, bias analysis, fact checks, evidence sources
- **Analysis History** — Searchable table of past analyses
- **Reports** — Analytics reports and charts
- **Notifications** — Analysis, security, and update notifications
- **Settings** — Profile, password, theme, notifications, API keys

## Backend

This app uses **Next.js API routes** with **PostgreSQL** (via Prisma) for persistence.

### Setup

1. Start PostgreSQL:
   ```bash
   docker compose up -d
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Run database migrations:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

### API Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/auth/login` | POST | Sign in |
| `/api/auth/register` | POST | Create account |
| `/api/auth/logout` | POST | Sign out |
| `/api/users/me` | GET, PATCH | Profile |
| `/api/users/me/settings` | GET, PATCH | Notification prefs |
| `/api/analyses` | GET, POST | History & new analysis |
| `/api/analyses/[id]` | GET | Analysis detail |
| `/api/reports` | GET | Filtered reports |
| `/api/reports/stats` | GET | Report summary stats |
| `/api/reports/[id]/read` | PATCH | Mark report read |
| `/api/dashboard/stats` | GET | Dashboard metrics |
| `/api/notifications` | GET, PATCH | Notifications |

Auth uses JWT tokens stored in `localStorage` (`truthguard_token`).

### External AI Integration (future)

Service stubs in `/services` for external APIs:

- `openai-service.ts` — OpenAI API
- `google-ai-service.ts` — Google AI (Gemini)
- `factcheck-service.ts` — Fact-check APIs
- `news-service.ts` — News APIs

## Environment Variables

```env
DATABASE_URL="postgresql://truthguard:truthguard@localhost:5433/truthguard?schema=public"
JWT_SECRET="change-me-to-a-long-random-string"
NEXT_PUBLIC_API_URL="/api"
```

## Design

- Glassmorphism effects
- Blue and white color palette
- Dark/light mode support
- Responsive layout
- Smooth Framer Motion animations
- Accessible focus states and ARIA labels
