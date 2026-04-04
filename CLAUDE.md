# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Response Style

Always give concise, direct, production-ready answers without unnecessary explanation.

## Commands

```bash
npm run dev      # Start development server on localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

There are no tests in this project.

## Architecture Overview

This is a **Next.js 14 (App Router)** personal portfolio for Yash Sachan, deployed on **Netlify**.

### Page Structure

`app/page.tsx` is a single-page app with a collapsible sidebar (`Sidebar` from `components/ui/sidebar.tsx`) and a scrollable main content area. All portfolio sections (Hero, Skills, Experience, Grid, Projects, Certificates, Approach, Footer) are rendered inline with anchor IDs for navigation.

Sub-pages:

- `/blogs` — public blog feed with admin-gated write/delete
- `/worklog` — private work journal (password-protected)
- `/gym` — gym tracking (password-protected)

### Auth System

`lib/admin-auth.ts` is the single auth implementation used by both the blog admin and worklog systems. It uses a cookie (`admin-session`) with an HMAC-style SHA256 token derived from `WORKLOG_PASSWORD` and `WORKLOG_SESSION_SECRET` env vars. The `lib/worklog-auth.ts` file just re-exports from `admin-auth`.

`app/api/admin/auth` handles login (`POST`), session check (`GET`), and logout (`DELETE`).

### Data Storage

All persistent data (blog posts, worklog entries, gym logs) uses a dual-mode store pattern in `lib/`:

- **Development**: writes to `.data/*.json` files locally
- **Production (Netlify)**: uses `@netlify/blobs` key-value store

Detection logic lives in each `*-store.ts` file — it checks for Netlify env vars (`NETLIFY`, `NETLIFY_SITE_ID`, etc.) to decide which backend to use.

### Content Data

All static portfolio content (nav items, projects, skills/testimonials, work experience, social links, grid items) lives in `data/index.tsx` as exported arrays. This is the primary file to edit for portfolio content updates.

### UI Components

`components/ui/` contains Aceternity UI / custom animated primitives (3D cards, moving borders, spotlight, sparkles, globe, etc.). These are self-contained and use `framer-motion` for animations.

`utils/cn.ts` is the standard `clsx` + `tailwind-merge` utility used across all components.

### Environment Variables

| Variable                                     | Purpose                                                   |
| -------------------------------------------- | --------------------------------------------------------- |
| `WORKLOG_PASSWORD`                           | Admin/worklog login password (default: `080808`)          |
| `WORKLOG_SESSION_SECRET`                     | Session token salt (default: `portfolio-worklog-session`) |
| `NETLIFY_BLOBS_SITE_ID` / `NETLIFY_SITE_ID`  | Blob store site ID                                        |
| `NETLIFY_BLOBS_TOKEN` / `NETLIFY_AUTH_TOKEN` | Blob store auth token                                     |
| `EMAIL_USER`                                 | Sender address for the contact form (`/api/send-mail`)    |

The send-mail API route (`app/api/send-mail/route.js`) is partially implemented — SMTP credentials are not set up.
