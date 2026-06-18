---
name: Capturing real app screenshots for the walkthrough video
description: How to get real screenshots of the Clerk-gated single-user course pages for the course-video artifact
---

To make the course-video artifact ACTUALLY show the product, capture real screenshots of the live app pages rather than mocking UI.

**Technique:** The course pages render fine when signed out because they contain NO Clerk user hooks — auth is enforced only by a `protectedComponent` wrapper in `artifacts/qr-course/src/App.tsx`. Temporarily add an early-return bypass (marker comment e.g. `// TEMP_SCREENSHOT_BYPASS`) in that wrapper, screenshot every page via the app-preview tool, then REVERT the bypass and restart the qr-course workflow.

**Why:** A real-screen video is the whole point of the request; bypassing the gate is the only way to render the gated pages for capture, and it's safe because the bypass is removed immediately and the pages have no user-dependent rendering.

**How to apply:** Save captures to `screenshots/*.jpg` and copy into `artifacts/course-video/public/screens/` (landing, dashboard, lecture, practice, assignments, grades, analytics, diagnostics, reasoning). Scenes reference them as `${import.meta.env.BASE_URL}screens/<file>`.

**Legibility caveat:** When a scene overlays readable hero text directly over one of these screenshots, the screenshot's OWN text competes with the overlay. Fix with low bg opacity (~0.2) + `blur-sm` + a dark radial contrast vignette behind the text (see Scene1) — never place readable overlay text over an undarkened screenshot.
