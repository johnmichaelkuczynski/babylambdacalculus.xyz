---
name: Subject conversion blind spots
description: Non-obvious places that still carry the old course subject after a rebrand
---

When converting the course to a new subject (e.g. Evolutionary → Criminal Psychology), the obvious copy is in `artifacts/*/src/.../video_scenes/SceneN.tsx`. The easily-missed spots that strand old branding:

- `artifacts/<video-artifact>/index.html` — `<title>` plus `og:title`/`og:description` and `twitter:title`/`twitter:description` meta still name the old subject.
- `artifacts/<video-artifact>/YOUTUBE_DESCRIPTION.md` — a full per-artifact description (title options, topic list, hashtags, chapters) themed to the old subject.

**Why:** these files don't render in the app preview and don't show up in a `SceneN.tsx` text grep, so a scene-only conversion passes visual checks while metadata/docs keep the old subject.

**How to apply:** after editing scenes, run a repo-wide sweep for old-subject terms across the whole artifact dir (not just scenes), and check `index.html` + any `*DESCRIPTION*.md`. Keep one canonical YouTube description (repo-root `youtube-description.md`) and treat artifact-local copies as synced mirrors.

Two more easily-missed spots:

- **ALL sibling video/demo artifacts, not just the headline promo.** A subject rebrand must cover every `video`-kind artifact (e.g. `course-promo`, `qr-course-demo`, `diagnostics-demo`) plus their `.replit-artifact/artifact.toml` `title` (canvas/preview labels read from there). Update toml titles via `verifyAndReplaceArtifactToml` (temp `artifact.edit.toml` → validate), never edit the toml in place.
- **Demo videos are intentionally partial screencasts.** The `qr-course-demo` only ever shows a subset of topics (e.g. lectures 1.1–1.5 with a "6 Lectures" label) — that is original format, not a conversion bug. Per the user's "convert in place, keep format/length intact" preference, do NOT expand demo scenes to list every course topic; only re-theme the existing copy. A code review may flag this as "missing topics 1.6–1.8" — that's over-applying the main-app's topic count to a demo and should be declined.

- **`artifact.toml` titles hide from ripgrep because `.replit-artifact/` is a hidden dir.** `rg` skips dot-directories by default, so a repo-wide old-subject grep can return "CLEAN" while all four `artifacts/*/.replit-artifact/artifact.toml` `title` fields still carry the old subject. Always run the branding sweep with `rg --hidden` (and `--glob '!.git/**'`), or explicitly check each `artifact.toml`.

- **The walkthrough VIDEO bakes app screenshots as pixels — grep can NEVER catch them.** The `course-video` scenes embed `public/screens/*.jpg` (landing, dashboard, lecture, practice, assignments, grades, analytics, diagnostics, reasoning) captured from the running app. After ANY branding/subject rename, these jpgs still show the OLD name (sidebar wordmark + hero copy) even though every `.tsx`/`.html`/`.md` greps clean — the user sees the old name "in the video". You MUST regenerate them. Capture with the `screenshot` tool at viewport `[1280, 720]`, `save_to` the exact `artifacts/course-video/public/screens/<name>.jpg`, `overwrite: true`. Landing is the only public route; the other 8 are behind a Clerk `protectedComponent` guard — temporarily replace that guard's body with `return <Component {...props} />` (the API has no server authz, so data still loads signed-out), screenshot, then REVERT the guard. Routes: `/dashboard`,`/analytics`,`/grades`,`/assignments`,`/diagnostics`,`/reasoning`,`/lectures/1`,`/practice/topic/1`.

- **Backend LLM-failure FALLBACK prompts evade subject grep.** Generator routes (e.g. `practice.ts`) have a `catch {}` branch with a hardcoded fallback prompt/answer. These use generic scenario wording (a friend, a real case) rather than subject nouns, so a grep for old-subject terms misses them — yet they're user-facing when the AI provider fails. After a subject conversion, audit every generator's catch/fallback branch for an on-subject concrete scenario, not just the main prompt.
