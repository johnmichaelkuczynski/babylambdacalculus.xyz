---
name: Course answer-key QC diagnostic
description: How the OpenAI answer-key quality-control diagnostic must judge keys for a course grounded in a specific source text
---

# Answer-key quality-control diagnostic — grounding rule

**Rule:** An LLM-based answer-key QC/legitimacy check for this course MUST judge each key against the course's own lecture content, not against the model's generic/mainstream knowledge. AND the grounding scope must match the assessment scope: **homework** is judged against its own topic's lecture (`problemsTable.topicId` → `lecturesTable.body`), but **cumulative assessments (`kind` in test/midterm/final)** must be judged against ALL lectures in the unit (`weekNumber`), not the single topic the problem is tagged to.

**Why (generic-knowledge trap):** The curriculum is grounded in a specific source text whose framework/terminology can diverge from mainstream treatments. Judged against generic knowledge, correct course-specific keys get false-flagged at high confidence (polarity-confused yes/no, mainstream-vs-course terminology mismatches, etc.).

**Why (scope trap):** A Final/test key legitimately reuses an example taught in a *sibling* topic. Single-topic grounding then false-flags it as "not taught in this lecture." Real case: a data-analytics Final key cited the **John Snow cholera water-pump** example (taught in one topic's lecture); the Final question was tagged to a different topic whose lecture uses **Florence Nightingale**, so the judge flagged the key "not in this lecture" at 97%. Fix = ground cumulative keys in the whole unit's combined lecture text.

**How to apply:**
- Feed the relevant lecture material into BOTH the blind re-derivation phase and the judging phase, and instruct the model to use the course's definitions/terminology/examples, not outside theory.
- For cumulative kinds, build a per-unit combined lecture text (each lecture truncated, concatenated with titles, with an overall char cap) and instruct the judge that an example taught in ANY provided lecture counts as taught. Fall back to topic lecture if the unit map is empty.
- Keep the QC rubric aligned with the grader's semantic-equivalence philosophy (accept any correct on-topic short answer; flag only genuinely defective keys). An over-strict rubric causes nondeterministic false flags on sound keys — do NOT respond by whack-a-mole editing the keys.
- Two-phase design (blind re-derive, then judge) is intentional: it stops the judge from rubber-stamping the key. Watch yes/no and negated prompts for polarity errors.
