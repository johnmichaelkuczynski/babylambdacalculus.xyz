# 🔎 Baby Lambda Calculus

**A friendly, one-unit intro to the lambda calculus that teaches, tutors, drills, and grades itself — for curious students and adults alike.**

Baby Lambda Calculus is a self-paced, single-user web course that delivers a plain-language introduction to the lambda calculus — the tiny language where everything is a function and computation is just substitution — taught, tutored, drilled, and graded entirely by AI, with built-in academic-integrity enforcement. No prior math or coding required. Every idea is explained intuitively in plain words rather than heavy formulas: how a function with a placeholder computes by substitution, how renaming variables avoids confusion, how to build numbers and booleans out of pure functions, how recursion appears out of nowhere, and why this little language is exactly as powerful as any computer.

---

## ✨ Features

- **One unit, 8 topics** — a complete plain-language syllabus: what the lambda calculus is · application and substitution · bound and free variables · Church numerals · booleans, logic, and choice · recursion and the Y combinator · lambda calculus equals Turing machines · from lambda to real languages (the capstone).
- **Three-depth lessons** — every lesson reads at **Short / Medium / Long** length, AI-rewritten while keeping the same examples and learning objectives.
- **Section-scoped AI tutor** — ask about the exact paragraph you're reading; answers stream back token-by-token, grounded in that lecture section.
- **Adaptive practice** — generated problem sets that get harder on a streak and ease off after a miss; per-session difficulty persists. Questions ask you to reason through concrete cases in plain words, never to recite definitions.
- **AI-graded assignments** — two homework sets, a timed unit test, and a cumulative final, each scored for semantic equivalence with a written rationale and a rolled-up percent score.
- **Two-layer AI-authorship detection** — every submission is screened by a static text classifier (GPTZero) **and** a diachronic keystroke-pattern detector, each with a human-readable verdict.
- **Diagnostic reasoning checks** — two ungraded instruments (Lambda Calculus subject reasoning and General Reasoning), each offered in three formats and three lengths, at four points in the journey (before, one-third, two-thirds, and after the course). They are unlimited practice with fresh questions every attempt and never affect the grade (coursework is 100%).
- **Live analytics** — dashboard KPIs (attempts, accuracy, streak), per-topic mastery, and a recent-activity feed.
- **Operator diagnostics** — one-click self-tests that verify the entire stack (database, OpenAI, GPTZero, detection, and the practice/grade loop) before you trust a session.

---

## 🏗️ Architecture

This is a [pnpm](https://pnpm.io/) workspace monorepo. The course runs as several artifacts plus shared libraries:

```
artifacts/
  qr-course/        # React + Vite frontend (the student app)
  api-server/       # Express API: lessons, tutor, practice, grading, detection, diagnostics
  course-video/     # Animated walkthrough video (Framer Motion)
lib/
  db/               # Drizzle ORM schema + Postgres connection
  api-spec/         # OpenAPI contract → generated React Query hooks + Zod validators
```

**Contract-first:** a single OpenAPI document is the source of truth. React Query hooks (client) and Zod validators (server) are generated from it, so request/response shapes can't drift.

**Tech stack:** React, Vite, TypeScript, Tailwind, Express, Drizzle ORM, PostgreSQL (Neon), Clerk (auth), OpenAI (tutoring/grading), GPTZero (AI detection), Framer Motion (video).

---

## 🔑 Configuration

The app reads the following secrets/environment variables (managed in the Replit **Secrets** pane):

| Key | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (an external Neon database) |
| `OPENAI_API_KEY` | OpenAI key for the tutor, practice generation, and grading |
| `OPENAI_BASE_URL` | OpenAI-compatible base URL |
| `GPTZERO_API_KEY` | GPTZero key for static AI-authorship detection |
| `CLERK_SECRET_KEY` / `CLERK_PUBLISHABLE_KEY` | Clerk authentication (server + client) |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key exposed to the frontend |
| `SESSION_SECRET` | Server session signing |

> If `GPTZERO_API_KEY` is absent, AI detection silently falls back to an LLM scorer plus a structural heuristic — submissions never block.

---

## 🚀 Running

The app runs through Replit **workflows** (not `pnpm dev` at the root). Each artifact has its own workflow that supplies the `PORT` and base-path it needs.

Typical local checks:

```bash
# Typecheck a package
pnpm --filter @workspace/api-server run typecheck
pnpm --filter @workspace/qr-course run typecheck

# Apply the database schema (Drizzle) — required once on a fresh database
pnpm --filter @workspace/db run push

# Regenerate API hooks/validators from the OpenAPI spec
pnpm --filter @workspace/api-spec run codegen
```

The API server seeds the course content on startup and self-heals when the content version changes, so the database is populated automatically once `DATABASE_URL` is set **and the schema has been pushed**. The schema push (`pnpm --filter @workspace/db run push`) creates the tables; the boot-time seed only fills in rows.

### Authentication

Sign-in uses **Clerk** with email/password and social SSO (including **Sign in with Google**). Social providers are toggled from the workspace **Auth** pane → **Configure** tab → **SSO providers** — enabling Google there makes it appear on the sign-in screen automatically; no code change is required. For a branded Google consent screen in production, add your own Google OAuth Client ID/Secret under **Custom credentials**.

---

## 🩺 Diagnostics

Open the **Diagnostics** page in the app (or hit the API directly) to run:

- **System diagnostic** (`GET /api/diagnostics/system`) — environment, database round-trip, course-seed integrity, OpenAI chat + JSON mode, the detection pipeline, an AI-positive control sample, and GPTZero connectivity.
- **Synthetic-student diagnostic** (`POST /api/diagnostics/synthetic-run`) — spins up a fake student, runs a practice session, takes and submits a full assignment, and verifies grading + detection + analytics all reflect the run.

---

## 📚 Who it's for

- **Middle schoolers & curious adults** — a complete, plain-language intro to the lambda calculus with on-demand tutoring and adaptive practice.
- **Instructors & curriculum designers** — a working reference for AI-taught, AI-graded, AI-detection-screened coursework.
- **Academic-integrity researchers** — a live testbed for layered AI-authorship detection (text classification + keystroke behavior).
- **Product & engineering teams** — a reference implementation of contract-first full-stack architecture, streaming AI UX, and self-diagnostic tooling.

---

*Baby Lambda Calculus — where the curriculum, the tutor, the grader, and the integrity check all live in one room.*
