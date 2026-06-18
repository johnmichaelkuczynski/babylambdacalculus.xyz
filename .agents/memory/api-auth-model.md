---
name: API auth model (single-user)
description: How the Ethics 101 API treats authentication/authorization — important before adding "protected" or "admin" endpoints.
---

# API is single-user with no per-route server authz

The api-server mounts `clerkMiddleware` (attaches auth context) but **routes do not gate on it** — no `userId` check, and submit/grade endpoints don't identify a user. The whole API is effectively callable without a session; Clerk gating lives only on the frontend (wouter `protectedComponent`).

**Why:** Ethics 101 is a single-user, self-paced course. The account owner is simultaneously the student and the "administrator." There is no second party to protect against, so detection/grading are self-imposed tooling, not a trust boundary.

**How to apply:**
- "Admin mode" is intentionally a client-side `localStorage` flag (`lib/adminMode.ts`); `skipDetection` on submit and `/api/admin/grader-lab` are not server-authz'd by design — consistent with every other endpoint.
- Do NOT assume any endpoint is protected server-side. If a future task genuinely needs a trust boundary (multi-user, cost abuse), that requires adding per-route Clerk authz across the whole API — a deliberate, in-scope architectural change, not a one-endpoint patch.
