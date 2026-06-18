---
name: Tutor starter-question style
description: Hard product constraint on how lecture "Ask the tutor" starter questions must be generated.
---

Starter questions for the lecture tutor must ALWAYS be concrete-case application questions: each one names a specific person/act/situation and asks the student to analyze, judge, classify, or predict about THAT case.

**Forbidden:** definition questions ("What is X?", "Define X"), abstract comparison/distinction questions ("What's the difference between X and Y?", "How do X and Y differ/relate?"), terminology/"what is it called" questions, and anything answerable without referring to a specific case.

**Why:** The user was emphatic and repeated this multiple times — abstract/definition questions just test memorized definitions, which they consider worthless. Understanding must be tested by application to examples.

**How to apply:** Enforced in the GET `/tutor/suggestions/:lectureId` route (api-server `routes/tutor.ts`) via (1) a strong generation prompt with good/bad examples, (2) a server-side `isAbstract` regex guard that drops abstract questions, and (3) a bounded refill loop that regenerates until 6 concrete questions survive. Keep the regex precise to avoid false-positives on valid case questions (e.g. don't blanket-block "What should Alex do…"). Suggestions are generated fresh per request (no DB cache) and served `Cache-Control: no-store`; the frontend fetch uses a cache-busting param.
