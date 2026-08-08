# My Custom Newsletter

AI-powered newsletter SaaS that curates and delivers personalized content using embeddings, RAG, and web scraping.

## What it does

Users subscribe to topics. The system aggregates, processes, and delivers curated newsletter emails for each topic — with minimal manual intervention.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict)
- **Database:** Supabase (PostgreSQL + Auth + Edge Functions)
- **Payments:** Stripe (via Supabase Edge Functions)
- **UI:** Radix UI + TailwindCSS + shadcn/ui
- **i18n:** Locale-based routing (en / pt)
- **CI/CD:** GitHub Actions, semantic-release
- **Testing:** Jest + Playwright

## Features

- Email/password authentication via Supabase Auth
- Stripe billing with subscription management
- Topic-based newsletter subscriptions
- Server-rendered dashboard with real-time data
- Edge Function pipeline for newsletter generation (RAG + embeddings)
- i18n support (English and Portuguese)
- Responsive landing page with pricing

## Getting Started

```bash
cp .env.example .env.local
# Fill in Supabase and Stripe credentials
npm install
npm run dev
```

## Status

Functional SaaS with auth, billing, and topic management. The newsletter generation pipeline runs on Supabase Edge Functions.