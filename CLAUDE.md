# Family Worship App — Claude Code Context

## Project Overview
A PWA for Jehovah's Witnesses families to plan, schedule, and 
engage with their Family Worship evenings.

## Tech Stack
- Frontend: React 18 + TypeScript + Vite
- Styling: Tailwind CSS v3 with custom paradise design system
- PWA: vite-plugin-pwa (Workbox)
- Routing: React Router v6
- Auth/DB/Realtime: Supabase
- Icons: Lucide React
- Fonts: Cormorant Garamond (display) + Nunito (body)
- JW.org Content: Node.js microservice on Render (Cheerio + Puppeteer)
- Hosting: Cloudflare Pages (frontend) + Render (scraper)

## Directory Structure
- src/pages/          — one file per route
- src/components/ui/  — reusable base components
- src/components/layout/ — AppShell, TopBar, BottomNav
- src/components/paradise/ — paradise background components
- src/components/calendar/ — calendar and event components
- src/components/study/    — study material components
- src/components/topics/   — topic selection and voting
- src/components/feedback/ — rating and feedback components
- src/components/notifications/ — push notification components
- src/hooks/          — custom React hooks
- src/lib/            — supabase client, scraperApi, constants
- src/types/          — all TypeScript interfaces (index.ts)
- src/styles/         — globals.css with Tailwind + CSS variables
- jw-scraper/         — standalone Node.js scraper microservice
- supabase/           — SQL migrations and edge functions

## User Roles
- head_of_household: full control — schedules events, assigns 
  material, manages topics, overrides votes, views all feedback
- family_member: views events, votes on topics, submits feedback,
  requests date changes

## Key Conventions
- TypeScript only — no .js files in src/
- Tailwind paradise-* classes only — no hardcoded hex values
- All new Supabase tables must have RLS policies
- Commits follow Conventional Commits: feat/fix/chore/docs/refactor
- Secrets in .env only — never committed to git
- Read every file before editing it

## JW Terminology Standards
| Use | Never use |
|---|---|
| Family Worship evening | session / worship night |
| Head of Household | admin / leader |
| Jehovah | God (in UI text) |
| Kingdom Hall | church |
| Elder | pastor / priest |
| Congregation | parish / community |

Event title fallback: "Family Worship Evening"
Tone: warm, encouraging, family-centered

## Approved Content Sources
Only these domains are permitted — no exceptions:
- www.jw.org
- wol.jw.org
- tv.jw.org
- download.jw.org

## Database Tables
profiles, households, family_worship_events, study_materials,
member_instructions, topics, topic_votes, date_change_requests,
feedback_entries, notifications, push_subscriptions

## Production URLs
- App: https://family-worship.pages.dev
- Scraper: https://jw-scraper.onrender.com

## Phase Tracker
- [x] Phase 1 — Scaffold, design system, PWA config
- [x] Phase 2 — Supabase tables and RLS policies
- [x] Phase 3 — Auth, profiles, household invite system
- [x] Phase 4 — Shared calendar and FW events
- [x] Phase 5 — JW.org scraper microservice
- [x] Phase 6 — Study material UI and assignment
- [x] Phase 7 — Topic selection, swipe voting, HH override
- [x] Phase 8 — Feedback and rating system
- [x] Phase 9 — PWA push notifications + Cloudflare deployment
