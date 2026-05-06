# Family Worship App — Claude Code Context

## Project Overview
A Progressive Web App (PWA) for couples and families to plan, schedule, and engage 
with their family worship nights. Built with React 18 + TypeScript + Vite + Supabase, 
deployed to Cloudflare Pages.

## Tech Stack
- Frontend: React 18 + TypeScript + Vite
- Styling: Tailwind CSS v3 with custom paradise design system
- PWA: vite-plugin-pwa (Workbox)
- Routing: React Router v6
- Auth/DB/Realtime: Supabase
- Icons: Lucide React
- Fonts: Cormorant Garamond (display) + Nunito (body) via Google Fonts
- JW.org Content: Separate Node.js microservice (Railway) using Cheerio + Axios
- Hosting: Cloudflare Pages (frontend) + Railway (scraper microservice)

## Folder Structure
- src/pages/ — one file per route/page
- src/components/ui/ — reusable base UI components (Button, Card, Modal, etc.)
- src/components/layout/ — AppShell, TopBar, BottomNav
- src/components/paradise/ — paradise background and visual components
- src/hooks/ — custom React hooks (useAuth, useHousehold, etc.)
- src/lib/ — supabase client, constants, utilities
- src/types/ — all TypeScript interfaces and types (index.ts)
- src/styles/ — globals.css with Tailwind directives and CSS variables

## Design System
All colors use CSS variables defined in src/styles/globals.css.
Core palette:
  --paradise-green-deep: #1a3d2b  (primary dark)
  --paradise-green-mid: #2d6a4f   (primary mid)
  --paradise-green-light: #52b788 (accent)
  --paradise-gold: #d4a017        (highlight)
  --paradise-cream: #fdf8f0       (background)
  --paradise-ocean: #0077b6       (link/action)
Always use Tailwind paradise-* color classes, never hardcode hex values in components.
Display font (headings): font-display (Cormorant Garamond)
Body font: font-body (Nunito)

## User Roles
- head_of_household (HH): full control — creates household, schedules events, 
  assigns material, sets instructions, overrides topic votes
- family_member: can view events, vote on topics, submit feedback, 
  request date changes

## Database
All Supabase tables use Row Level Security (RLS). Every table has:
  - id (uuid, primary key, default gen_random_uuid())
  - created_at (timestamptz, default now())
Profiles are linked to auth.users via user_id foreign key.

## Key Rules — Always Follow
1. Never assume instructions — ask before proceeding if anything is unclear
2. Never assume existing code — read the file before editing it
3. Provide all instructions in chronological order
4. Go through requirements one at a time
5. Do not proceed to the next task without confirmation
6. Always use TypeScript — no plain .js files in src/
7. Always use Tailwind classes — no inline styles except CSS variables
8. All new Supabase tables must include RLS policies
9. All git commits must follow Conventional Commits format:
   feat: / fix: / chore: / docs: / refactor: / style:
10. Never hardcode secrets — always use import.meta.env.VITE_* variables

## Git Conventions
Format: type(scope): description
Examples:
  feat(auth): add login page with supabase auth
  feat(calendar): create family worship event component
  fix(pwa): correct service worker registration
  chore(deps): update supabase client to latest

## Environment Variables
All secrets live in .env (gitignored). 
Reference .env.example for required keys.
Never commit .env to git.

## Phase Tracker
- [x] Phase 1 — Project scaffold, design system, PWA config
- [x] Phase 2 — Supabase setup (auth, tables, RLS)
- [x] Phase 3 — Profiles (HH + family member roles)
- [x] Phase 4 — Shared calendar + FW events + date change requests
- [ ] Phase 5 — Topic selection (dropdown + swipe voting)
- [ ] Phase 6 — Post-FW rating + private feedback
- [x] Phase 7 — JW.org scraper microservice (Railway)
- [ ] Phase 8 — Study material assignment
- [ ] Phase 9 — Private per-member instructions
- [ ] Phase 10 — Topic selection (dropdown + swipe voting)
- [ ] Phase 11 — HH override + alert notifications
- [ ] Phase 12 — Post-FW rating + private feedback
- [ ] Phase 13 — PWA push notifications
- [ ] Phase 14 — Cloudflare Pages deployment
