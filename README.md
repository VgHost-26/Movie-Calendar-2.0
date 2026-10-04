# Movie Calendar 2.0 *(Work in Progress)*

A personal radar for upcoming movie premieres. A complete rebuild of my very first React app, this time with modern tooling and deployment in mind.

**Live app:** https://movie-calendar-2-0.vercel.app

> **For recruiters / reviewers — try it in 20 seconds, no sign-up needed:**
>
> 1. Open the **live app** above
> 2. Click **DEMO** in the top-right corner
> 3. Browse a pre-filled Timeline with posters, add a movie, mark one as watched
>
> Demo mode loads temporary data so you get the full product feel without creating an account. You can also sign up with email or continue with Google.

---

## The Idea

You watch a trailer, think *“I need to see that,”* then discover the premiere is 14 months away. You tell yourself you’ll remember. You won’t.

Movie Calendar 2.0 is a quiet, dedicated shelf for those intentions — separate from your crowded Google or work calendar. Save what caught your eye, forget about it guilt-free, and come back to a visual timeline when release season arrives.

It’s deliberately poster-forward: tracking dates is the utility, admiring the artwork is the pleasure.

This project was never just about a frontend mockup. It was an exercise in taking something from a loose idea to a hosted, working product — auth, database, state, caching, routing, and deploys included.

## What You Can Do Right Now

There are 4 areas in the app:

- **Calendar**
  The classic month-grid view. Currently in a raw, early state — the foundation is there, polish is next.

- **Timeline**
  The heart of the app. A poster-led, scrollable timeline of released and upcoming films. Add new titles, edit details, and follow their journey toward release.

- **Archive**
  Movies you’ve marked as “watched” move here, keeping the Timeline focused on what’s still ahead.

- **Settings**
  Quiet for now. Account and preference controls will live here as the app matures.

Core flows to test in Demo mode: add movie → browse Timeline → mark as watched → find it in Archive.

## Stack

- **React + TypeScript** — component model and type safety
- **React Router** — routing between Calendar / Timeline / Archive / Settings
- **Tailwind CSS + shadcn/ui** — styling system and accessible primitives
- **Firebase (Auth + Firestore)** — Google/email auth and persistent movie data
- **TanStack Query** — server-state caching and sync
- **Zustand** — lightweight client state

Deployed on **Vercel** with Vite + pnpm.

## Run It Locally

```bash
pnpm install
pnpm dev
```

You’ll need your own Firebase project — copy `.env.template` to `.env` and fill in your keys:


Production build check:

```bash
pnpm build
```

## Roadmap

- [ ] Bring Calendar view to parity with Timeline
- [ ] Expand Settings
- [ ] Poster / metadata enrichment
- [ ] Trending page fetched from TMDB
- [ ] Upcoming page fetched from TMDB

## A Note on AI Usage

This repo was intentionally a learning ground, so I kept AI on a short leash. I used it as my project manager: to sanity-check the stack order and break the rebuild into sensible phases.

The key logic and UI decisions are mine. Autocomplete and agentic help covered the repetitive parts — boilerplate, refactors, small repetitive components — not the core functionality.
