---
name: Course naming + audience mandate
description: Hard user rules on how the AI course must be named and positioned — never childish, exact YouTube title format, adult audience.
---

# Naming + audience mandate

Strong, emphatic user mandate governing how the course brand is named and pitched.

## The app name must be literal/utilitarian — never goofy, cute, or childish
- If a name is "Baby X" or "X for Children", rename to "Basic X" (e.g. "Baby Lambda
  Calculus" → "Basic Lambda Calculus"). Prefer the plainest possible name
  ("Data Analytics", "Formal Logic", "Ethics", "Basic AI").
- The words **"Baby"** and **"children"/"kids"** must appear **NOWHERE** — not in copy,
  not in the video, not in README, not even in exported asset filenames (old
  `BABY-...mp4` exports must be renamed) — UNLESS the actual subject matter references
  them (e.g. developmental psychology).

## Audience is adults, usually researchers
Positioning is adults taking up a new discipline — graduate students, researchers,
faculty — plus instructors and academic-integrity researchers. Never "middle
schoolers / curious students / grown-ups".

## Never lead with "no math / no coding / kid-friendly"
Do not sell the course on what it lacks. README/description/video must showcase the
**wealth of substantial content**. "It assumes no prior exposure" is acceptable framing;
"No prior math! No jargon!" is not. The video must show real functionality, not be goofy.

## YouTube description app title — exact format
The app title line in the YouTube description MUST be exactly: `X — AI-Powered Course`
(em dash, no extra descriptors). e.g. `Basic Lambda Calculus — AI-Powered Course`.
Do not append blurbs like "— an AI-Powered course that teaches and grades!".

**Why:** Repeated, angry user mandate; the user considers childish/"no-math" framing as
slander of substantial work.
**How to apply:** On any rebrand, sweep content AND filenames AND `.replit-artifact/`
toml titles (rg skips dot-dirs; use `--hidden` or check each toml). Keep the one-line
YouTube title in the mandated format.
