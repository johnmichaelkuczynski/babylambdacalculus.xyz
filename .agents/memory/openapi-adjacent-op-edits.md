---
name: OpenAPI adjacent-operation edits
description: Editing an openapi.yaml operation that sits next to another op can silently orphan a response `content` block and flip a generated client return type.
---

When inserting a new path/operation into `lib/api-spec/openapi.yaml` immediately before an existing operation, an `edit` whose `old_string` stops at `description: OK` (and does not include the following `content:` block) leaves that `content:` block orphaned. It detaches from its original operation and re-attaches after whatever you inserted — so one operation silently LOSES its response schema and the adjacent one gets a duplicate.

**Why:** This is contract-first — after `pnpm --filter @workspace/api-spec run codegen`, a stripped response schema changes the generated client return type (e.g. `clearLectureRewrite` became `Promise<void>` instead of `Promise<Lecture>`) even though the server still returns the JSON. Typechecks can still pass; the drift is only caught by reviewing generated return types or by an architect review.

**How to apply:** When editing an op near another op in openapi.yaml, include the FULL responses block (through the `$ref`) in `old_string`. After any openapi edit + codegen, grep the generated client for the affected `operationId = async` line and confirm its `Promise<...>` return type matches what the server actually sends.
