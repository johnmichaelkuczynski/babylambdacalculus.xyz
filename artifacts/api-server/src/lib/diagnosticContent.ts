// ---------------------------------------------------------------------------
// Original content for the embedded diagnostic reasoning assessments.
//
// Two instruments, each offered at FOUR time-points (phases) so a student can
// gauge themselves before, during, and after the course:
//   - subject  — Finite Math subject-specific reasoning. Realistic short
//     cases about the course material (finite math); the best-supported
//     answer is keyed first.
//   - general  — General Reasoning. Genuine reasoning items spanning analysis,
//     inference, evaluation, deduction, and induction (NOT a "docility"/agree-
//     with-authority test).
//
// Each (instrument, phase) is offered in THREE selectable answer formats that
// share the same kind of questions:
//   - mcq     — pick the single best option.
//   - hybrid  — pick the best option AND (optionally) write a short note.
//   - written — no options shown; write a short answer in your own words.
//
// These diagnostics are UNGRADED practice: takeable anytime, unlimited times,
// and they never affect the course grade. Every time a test is started, fresh
// questions are generated (see reasoning.ts) so questions never repeat. The
// items below are the structural BLUEPRINT (style + fallback) for that
// generation, grounded per phase by GEN_SPECS.
//
// All items are ORIGINAL. For every item the correct option is written FIRST;
// at seed time options are rotated so the correct answer lands at a varied
// index (see seedDiagnostics.ts). `modelAnswer` is the ideal short written
// response used to grade the written/hybrid formats.
// ---------------------------------------------------------------------------

export type SkillArea =
  | "analysis"
  | "inference"
  | "evaluation"
  | "deduction"
  | "induction";

export type Instrument = "subject" | "general";

export type Phase = "before" | "third" | "twothirds" | "after";

export type DiagFormat = "mcq" | "hybrid" | "written";

// A single unified diagnostic item. The correct option is listed FIRST and is
// rotated to a random index at seed time. `modelAnswer` is the reference answer
// for grading the written/hybrid formats.
export type DiagItem = {
  prompt: string;
  options: string[];
  modelAnswer: string;
  skillArea?: SkillArea;
};

export type DiagnosticSeed = {
  instrument: Instrument;
  phase: Phase;
  format: DiagFormat;
  title: string;
  subtitle: string;
  instructions: string;
  items: DiagItem[];
};

// ===========================================================================
// Phase metadata
// ===========================================================================

export const PHASE_ORDER: Phase[] = ["before", "third", "twothirds", "after"];

export const PHASE_LABEL: Record<Phase, string> = {
  before: "Before the course",
  third: "One-third of the way through",
  twothirds: "Two-thirds of the way through",
  after: "After the course",
};

// ===========================================================================
// Per-(instrument, phase) generation specs
// Used by reasoning.ts to generate fresh, never-repeating questions grounded in
// the right scope for the chosen time-point. `topicFocus` describes WHAT to ask
// about; `level` nudges difficulty for the time-point.
// ===========================================================================

export type GenSpec = { topicFocus: string; level: string };

const SUBJECT_SPECS: Record<Phase, GenSpec> = {
  before: {
    level:
      "Intro level: answerable by a thoughtful newcomer reasoning carefully, BEFORE any lessons. Do not assume prior course knowledge or technical terms. No heavy calculations — reward plain-language reasoning.",
    topicFocus:
      "What finite math is and how to think about it: that it is a toolkit of practical tools for questions about finite, countable, bounded situations (how many ways can something happen, how likely is it, what's the best choice given limits, how does money grow) rather than the infinite or continuous world of calculus; that its questions are about things you could in principle finish counting (cards in a deck, people in a room, routes among a few cities); and that it needs only arithmetic and careful reasoning, no calculus, which is exactly why it is the math most used in business and everyday life.",
  },
  third: {
    level:
      "Early course level: covers roughly the first third of the unit. Plain language, short realistic cases, no heavy calculations.",
    topicFocus:
      "Topics 1.1-1.3: what finite math is (a toolkit for countable, bounded questions, no calculus); sets and logic (a set is a well-defined collection; union is the 'or', intersection the 'and', complement the 'not'; a Venn diagram avoids double-counting by adding two groups and subtracting their overlap; and-or-not and if-then logic); and the art of counting (the multiplication principle; permutations count arrangements where ORDER MATTERS, combinations count selections where order does NOT, with always fewer combinations — the deciding test is whether rearranging the same items creates something new).",
  },
  twothirds: {
    level:
      "Mid course level: covers roughly the first two-thirds of the unit. Realistic short cases requiring a step of reasoning, no heavy calculations.",
    topicFocus:
      "Topics 1.1-1.6: what finite math is, sets and logic, and counting (permutations vs. combinations), PLUS probability (a number from 0 to 1, favorable outcomes over total when equally likely; 'or' adds chances and subtracts overlap, independent 'and' multiplies; conditional probability is how a likelihood changes given new information; expected value is the probability-weighted average over many repeats), matrices (a grid of numbers in rows and columns; addition combines matching entries; a system of equations becomes a matrix solved by a fixed mechanical procedure), and linear programming (an objective plus constraints carve out a feasible region, and the corner principle says the best answer is always at a corner, so only finitely many corners need checking).",
  },
  after: {
    level:
      "End-of-course level: covers the whole unit. Integrative short cases that apply more than one idea, no heavy calculations.",
    topicFocus:
      "The full unit, topics 1.1-1.8: what finite math is, sets and logic, counting, probability, matrices, and linear programming, PLUS the math of money (simple interest is paid only on the original amount; compound interest pays interest on interest, so money grows exponentially and early saving wins because the later high-balance years add the most; loans charge compound interest and regular payments cover interest first; an annuity is a stream of equal payments) and putting finite math to work (it is a toolbox whose tools combine on real problems — e.g. counting + probability + the math of money to price insurance — and the deepest takeaway is a habit of making messy decisions precise enough to become countable, measurable, and solvable).",
  },
};

const GENERAL_SPECS: Record<Phase, GenSpec> = {
  before: {
    level: "Everyday, accessible reasoning. One step of inference per item.",
    topicFocus:
      "General reasoning on everyday, neutral topics: identifying assumptions and conclusions, what evidence does and does not support, judging the strength of sources, valid vs. invalid deduction, and the strength of generalizations.",
  },
  third: {
    level: "Everyday reasoning, slightly more demanding than the baseline.",
    topicFocus:
      "General reasoning on everyday, neutral topics: assumptions/conclusions, supported inferences, source quality, deductive validity, and inductive strength.",
  },
  twothirds: {
    level: "Moderately demanding reasoning, sometimes two steps.",
    topicFocus:
      "General reasoning on everyday, neutral topics: assumptions/conclusions, supported inferences, source quality, deductive validity, and inductive strength.",
  },
  after: {
    level: "More demanding, multi-step reasoning where appropriate.",
    topicFocus:
      "General reasoning on everyday, neutral topics: assumptions/conclusions, supported inferences, source quality, deductive validity, and inductive strength.",
  },
};

export function genSpecFor(instrument: Instrument, phase: Phase): GenSpec {
  return instrument === "subject"
    ? SUBJECT_SPECS[phase]
    : GENERAL_SPECS[phase];
}

// ===========================================================================
// Format-specific instructions
// ===========================================================================

const FORMAT_LABEL: Record<DiagFormat, string> = {
  mcq: "Multiple Choice",
  hybrid: "Hybrid",
  written: "Written",
};

function instructionsFor(instrument: Instrument, format: DiagFormat): string {
  const subject =
    instrument === "subject"
      ? "Answer each question about finite math — these reward careful reasoning about realistic cases (no heavy calculations), not memorized facts"
      : "Answer each reasoning question — these measure how you think, not what you recall";
  const body =
    format === "mcq"
      ? `${subject} by selecting the single best option.`
      : format === "hybrid"
        ? `${subject} by selecting the best option. You can add a quick note on your reasoning if you like — it's optional and a few words is plenty.`
        : `${subject}. No answer options are shown — just jot a brief answer in your own words. One or two sentences is plenty; there's no need to write a lot.`;
  return `${body} This is ungraded practice — take it anytime, as many times as you like; it never affects your course grade. Submitting shows your results with written feedback.`;
}

// ===========================================================================
// SUBJECT — Finite Math blueprint cases (best answer keyed FIRST)
// ===========================================================================

const SUBJECT_BEFORE: DiagItem[] = [
  {
    prompt:
      "A friend says, 'Math only becomes useful once you reach calculus — everything before that is just arithmetic.' How would someone who understands what this course is about most likely respond?",
    options: [
      "Not really — finite math answers a huge range of practical questions (how many ways, how likely, what's the best choice) using only careful reasoning, no calculus",
      "That's correct; nothing useful happens in math before calculus",
      "Finite math is just calculus taught more slowly",
      "It's true, because finite math is only about memorizing definitions",
    ],
    modelAnswer:
      "Finite math is a toolkit for countable, everyday questions — counting possibilities, measuring chance, optimizing under limits, handling money — and it needs only arithmetic and clear thinking, so plenty of the most useful math arrives well before calculus.",
  },
  {
    prompt:
      "Which of these questions is the kind of thing finite math is built to answer?",
    options: [
      "How many different 4-person teams can be formed from a group of ten people?",
      "What is the exact slope of a curve at a single instant?",
      "What is the area under a curve that stretches on forever?",
      "What value does an endless running total approach?",
    ],
    modelAnswer:
      "Finite math handles countable, bounded situations like 'how many ways can a team be chosen?' — questions you could in principle finish counting — rather than the curves, instants, and endless processes that belong to calculus.",
  },
  {
    prompt:
      "Which statement best captures what makes finite math 'finite'?",
    options: [
      "It studies countable, bounded situations you could in principle finish counting, rather than the infinite or continuous",
      "It only allows you to use small numbers",
      "It is finite because every problem has exactly one possible answer",
      "It avoids math entirely and is really just common sense",
    ],
    modelAnswer:
      "'Finite' means the subject deliberately stays where things can be listed, counted, and compared — decks of cards, groups of people, a few routes — instead of the endless or continuous world that calculus is built for.",
  },
];

const SUBJECT_THIRD: DiagItem[] = [
  {
    prompt:
      "A club reports 20 members signed up for the hike and 15 for the kayak trip, and someone concludes 35 different members signed up for something. Using sets, the best reasoning is:",
    options: [
      "It may be fewer than 35, because members who signed up for both get counted twice unless you subtract the overlap",
      "It must be exactly 35, since you just add the two groups",
      "It must be more than 35, because some people sign up twice",
      "There's no way to say anything without listing every member",
    ],
    modelAnswer:
      "Adding the two groups double-counts anyone in both (the intersection); the union is found by adding the groups and subtracting the overlap, so the true count is 35 minus however many did both — at most 35, and usually fewer.",
    skillArea: "analysis",
  },
  {
    prompt:
      "A coach will pick which 5 of 12 players start, and separately set the batting order of those 5. Which best describes the difference?",
    options: [
      "Choosing who starts is a combination (order doesn't matter); setting the batting order is a permutation (order matters), with more possibilities",
      "Both are permutations, since players are involved either way",
      "Both are combinations, because the same players appear in each",
      "Choosing who starts is a permutation and the batting order is a combination",
    ],
    modelAnswer:
      "Picking the five is a combination — the same group is the same roster in any order — while ordering them is a permutation, since rearranging makes a different lineup; because each group can be reordered many ways, the batting-order question has more possibilities.",
    skillArea: "inference",
  },
  {
    prompt:
      "Someone says, 'Counting is trivial — you just count.' Given the course, why is that misleading?",
    options: [
      "Because once possibilities are too many to list, you need techniques like the multiplication principle and must decide whether order matters",
      "Because counting is actually impossible for groups larger than ten",
      "Because counting always requires calculus once the numbers get big",
      "Because the answer is always simply the number of items you started with",
    ],
    modelAnswer:
      "When outcomes are too numerous to list, you reason with the multiplication principle and decide whether order matters (permutation) or not (combination); getting that one judgment wrong over- or under-counts badly, so 'just count' hides a real skill.",
    skillArea: "evaluation",
  },
];

const SUBJECT_TWOTHIRDS: DiagItem[] = [
  {
    prompt:
      "You flip a fair coin twice and a friend says, 'The chance of at least one head is 1/2 + 1/2 = 1, so it's certain.' What's the best correction?",
    options: [
      "You can't just add — the flips are independent, so find the chance of no heads (1/2 × 1/2 = 1/4) and subtract from 1, giving 3/4",
      "That's right; two flips guarantee at least one head",
      "You should multiply 1/2 by 1/2 to get the chance of at least one head",
      "The chance is exactly 1/2, the same as a single flip",
    ],
    modelAnswer:
      "Adding chances would push probabilities past 1; instead, for independent events you multiply to get the chance of two tails (1/4), so the chance of at least one head is 1 − 1/4 = 3/4, not a certainty.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "A bakery wants the most profit but has limited flour, oven time, and labor. Why does linear programming say you only need to check the 'corners'?",
    options: [
      "Because the best value of the objective always occurs at a corner of the feasible region, so a few corner points cover every case",
      "Because the corners are simply easier to draw than the middle",
      "Because the middle of the region is forbidden by the constraints",
      "Because profit is always largest at the very center of the options",
    ],
    modelAnswer:
      "The constraints carve out a feasible region, and the corner principle guarantees the optimum sits at a corner where boundaries meet — so instead of testing endless plans you evaluate the objective at the handful of corners and pick the best.",
    skillArea: "inference",
  },
  {
    prompt:
      "A café wants both to combine this month's drink sales with last month's and to solve for prices from a couple of receipts. How do matrices help?",
    options: [
      "A matrix stores the numbers in a structured grid, so addition combines matching entries in one step and a system of equations can be solved by a fixed procedure",
      "Matrices can add numbers but are useless for solving equations",
      "Matrices only help when there is exactly one number to track",
      "You must use calculus, since matrices can't handle real data",
    ],
    modelAnswer:
      "A matrix is a grid where each position has a fixed meaning, so adding two matrices combines matching entries at once, and packing a system of equations into a matrix lets you solve the whole thing with one organized, mechanical procedure.",
    skillArea: "analysis",
  },
];

const SUBJECT_AFTER: DiagItem[] = [
  {
    prompt:
      "Two friends save the same total, but one starts ten years earlier in a compounding account. Why can the early starter end up with far more?",
    options: [
      "Because compound interest pays interest on interest, and the extra early years give the money more time to multiply — and the late, high-balance years add the most",
      "Because the early starter must have chosen a higher interest rate",
      "Because simple interest always beats compound interest over time",
      "It can't — equal total contributions always grow to the same amount",
    ],
    modelAnswer:
      "Compounding grows money on itself and accelerates, so the largest gains come late when the balance is biggest; the early starter's money spends more years compounding, so even with the same total contributed it grows into a larger sum.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "A friend insists, 'A test that's 99% accurate means a positive result is almost certainly correct.' Drawing on the unit, the strongest correction is:",
    options: [
      "Not necessarily — for a rare condition the conditional probability of being sick given a positive can be low, because false positives can outnumber true ones",
      "That's right; 99% accuracy always means a positive is 99% likely to be correct",
      "It's impossible to say anything about the result either way",
      "A positive result is meaningless because tests are never accurate",
    ],
    modelAnswer:
      "What a positive means is a conditional probability that depends on how common the condition is; when a disease is rare, the many false positives among the healthy majority can swamp the few true positives, so a positive can be far from certain.",
    skillArea: "inference",
  },
  {
    prompt:
      "A friend says, 'Finite math is just a grab-bag of unrelated tricks — it doesn't add up to anything real.' Drawing on the unit, the strongest reply is:",
    options: [
      "It's a toolbox whose tools combine on real problems — e.g. counting and probability find a claim's chance, then the math of money values the payouts",
      "She's right; the topics never connect to each other",
      "It only matters inside a classroom, never in real life",
      "The tools are useful only one at a time, never together",
    ],
    modelAnswer:
      "Finite math's power is in combining tools: pricing insurance uses counting and probability for the chance of a claim and the math of money to value future payouts, with sets and logic organizing the categories — unified by a habit of making messy decisions countable and solvable.",
    skillArea: "evaluation",
  },
];

// ===========================================================================
// GENERAL — reasoning blueprint (analysis / inference / evaluation /
// deduction / induction). Shared across phases; difficulty is nudged per phase
// at generation time (see GEN_SPECS.level).
// ===========================================================================

const GENERAL_BLUEPRINT: DiagItem[] = [
  {
    prompt:
      "Consider: 'All students who studied passed the exam. Maria studied. So Maria passed.' Which unstated assumption does the argument rely on?",
    options: [
      "Maria is among the students the first statement describes.",
      "Studying is the only way to pass the exam.",
      "Maria always studies for her exams.",
      "The exam was unusually difficult.",
    ],
    modelAnswer:
      "It assumes Maria is one of the students covered by 'all students who studied' — that her studying puts her in the group described.",
    skillArea: "analysis",
  },
  {
    prompt:
      "A survey finds 70% of people who exercise daily report good sleep, versus 30% of those who never exercise. Which conclusion is best supported?",
    options: [
      "People who exercise daily are more likely to report good sleep than those who never exercise.",
      "Exercise guarantees good sleep for everyone.",
      "Poor sleep is what causes people to stop exercising.",
      "Anyone who wants good sleep must exercise daily.",
    ],
    modelAnswer:
      "Only that daily exercisers are more likely to report good sleep — an association, not a guarantee or a proven cause.",
    skillArea: "inference",
  },
  {
    prompt: "Which source would most strengthen the claim 'this medication is safe'?",
    options: [
      "A large, peer-reviewed clinical trial.",
      "A testimonial from one satisfied customer.",
      "An advertisement produced by the manufacturer.",
      "A popular wellness blog post.",
    ],
    modelAnswer:
      "A large, peer-reviewed clinical trial — independent, systematic evidence is far stronger than a testimonial, an ad, or a blog.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "'If it rained, the streets are wet. The streets are not wet.' What necessarily follows?",
    options: [
      "It did not rain.",
      "It rained.",
      "The streets are dry for some other reason.",
      "Nothing at all follows.",
    ],
    modelAnswer:
      "It did not rain — if rain would have made the streets wet and they are not wet, then it cannot have rained.",
    skillArea: "deduction",
  },
  {
    prompt:
      "Plants given a new fertilizer grew taller than otherwise identical plants without it, all else held equal. The best-supported conclusion is:",
    options: [
      "The fertilizer probably caused the extra growth.",
      "Taller plants attract more fertilizer.",
      "Fertilizer is required for any plant growth at all.",
      "The result was pure coincidence.",
    ],
    modelAnswer:
      "Because everything else was held equal, the fertilizer probably caused the extra growth.",
    skillArea: "induction",
  },
  {
    prompt:
      "A report notes that ice-cream sales and drowning deaths rise in the same months. A careful reader should infer that:",
    options: [
      "Both may be linked to a third factor, such as hot weather.",
      "Eating ice cream causes drowning.",
      "Drowning incidents cause ice-cream sales.",
      "The data must simply be mistaken.",
    ],
    modelAnswer:
      "That both probably rise because of a shared third factor such as hot weather — correlation doesn't mean one causes the other.",
    skillArea: "inference",
  },
];

// ===========================================================================
// Seed expansion — each (instrument, phase) in all three formats
// ===========================================================================

type BaseContent = {
  instrument: Instrument;
  phase: Phase;
  baseTitle: string;
  items: DiagItem[];
};

const BASE_CONTENT: BaseContent[] = PHASE_ORDER.flatMap((phase) => {
  const subjectItems: Record<Phase, DiagItem[]> = {
    before: SUBJECT_BEFORE,
    third: SUBJECT_THIRD,
    twothirds: SUBJECT_TWOTHIRDS,
    after: SUBJECT_AFTER,
  };
  return [
    {
      instrument: "subject" as const,
      phase,
      baseTitle: `Finite Math Check — ${PHASE_LABEL[phase]}`,
      items: subjectItems[phase],
    },
    {
      instrument: "general" as const,
      phase,
      baseTitle: `General Reasoning Check — ${PHASE_LABEL[phase]}`,
      items: GENERAL_BLUEPRINT,
    },
  ];
});

const FORMATS: DiagFormat[] = ["mcq", "hybrid", "written"];

export const DIAGNOSTIC_SEED: DiagnosticSeed[] = BASE_CONTENT.flatMap((base) =>
  FORMATS.map((format) => ({
    instrument: base.instrument,
    phase: base.phase,
    format,
    title: `${base.baseTitle} · ${FORMAT_LABEL[format]}`,
    subtitle: PHASE_LABEL[base.phase],
    instructions: instructionsFor(base.instrument, format),
    items: base.items,
  })),
);
