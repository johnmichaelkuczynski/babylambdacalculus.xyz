// ---------------------------------------------------------------------------
// Original content for the embedded diagnostic reasoning assessments.
//
// Two instruments, each offered at FOUR time-points (phases) so a student can
// gauge themselves before, during, and after the course:
//   - subject  — Lambda Calculus subject-specific reasoning. Realistic short
//     cases about the course material (the lambda calculus); the best-supported
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
      "Intro level: answerable by a thoughtful newcomer reasoning carefully, BEFORE any lessons. Do not assume prior course knowledge or technical terms. No heavy formal derivations — reward plain-language reasoning.",
    topicFocus:
      "What the lambda calculus is and how to think about it: that it is a tiny, complete model of computation built from nothing but functions (no numbers, no data, no commands), where the only moves are naming a variable, defining a function, and applying a function to an argument; that surprisingly everything else — numbers, true/false, data, and repetition — can be ENCODED as functions rather than built in; and that it needs no machine at all, just functions transforming functions, which is exactly why it underlies functional programming and the very definition of what is computable.",
  },
  third: {
    level:
      "Early course level: covers roughly the first third of the unit. Plain language, short realistic cases, no heavy formal derivations.",
    topicFocus:
      "Topics 1.1-1.3: what the lambda calculus is (a language of only functions, built from variables, abstraction λx. body, and application f x); application and substitution (computation is rewriting by beta reduction — when a function meets an argument you substitute the argument for the parameter — repeated until normal form, the answer, though some expressions never stop); and bound vs. free variables (a bound variable is the local name a function introduces and its name is arbitrary; a free variable comes from outside; careless substitution can cause variable capture, fixed by alpha renaming the bound variable).",
  },
  twothirds: {
    level:
      "Mid course level: covers roughly the first two-thirds of the unit. Realistic short cases requiring a step of reasoning, no heavy formal derivations.",
    topicFocus:
      "Topics 1.1-1.6: what the lambda calculus is, application and beta reduction, and bound vs. free variables, PLUS Church numerals (a number is encoded as how many times a function is applied: zero is λf. λx. x, two is λf. λx. f (f x); arithmetic becomes manipulating repetition — the deep lesson that data can be encoded as behavior), booleans and logic (TRUE picks the first of two options λa. λb. a and FALSE the second λa. λb. b, so if-then-else comes for free by applying the condition to the two branches, and AND/OR/NOT and pairs are built by wiring choosers), and the Y combinator (a nameless function can't call itself, so you pass the function to itself; the Y combinator automates this self-application — a fixed-point combinator — to give recursion with no names).",
  },
  after: {
    level:
      "End-of-course level: covers the whole unit. Integrative short cases that apply more than one idea, no heavy formal derivations.",
    topicFocus:
      "The full unit, topics 1.1-1.8: what the lambda calculus is, beta reduction, bound/free variables, Church numerals, booleans and logic, and the Y combinator, PLUS the equivalence with Turing machines (two utterly different models — a tape-and-head machine and pure functions — can simulate each other, so they have exactly the same power; the Church–Turing thesis defines 'computable' as what they can do; and the halting problem is a provable limit, since no program can decide whether an arbitrary computation halts) and from lambda to real languages (real languages are the lambda calculus plus conveniences — names, loops, native numbers/booleans/types as sugar over substitution — with Lisp, ML, Haskell, and the first-class functions in mainstream languages descending directly from it; the deepest takeaway is computation as transformation of inputs through functions).",
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
      ? "Answer each question about the lambda calculus — these reward careful reasoning about realistic cases (no heavy formal derivations), not memorized facts"
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
// SUBJECT — Lambda Calculus blueprint cases (best answer keyed FIRST)
// ===========================================================================

const SUBJECT_BEFORE: DiagItem[] = [
  {
    prompt:
      "A friend says, 'Computation needs a machine — chips, memory, and instructions being executed; you could never capture it with just math.' How would someone who understands what this course is about most likely respond?",
    options: [
      "Not really — the lambda calculus shows that all of computation can be captured by functions alone, with no machine at all, which is exactly why it's studied as the essence of computing",
      "That's correct; without hardware there is no computation to speak of",
      "The lambda calculus is just a slow way of describing a physical computer",
      "It's true, because math can only describe numbers, never processes",
    ],
    modelAnswer:
      "The lambda calculus is a complete model of computation built from nothing but functions — no machine, memory, or instructions — so computation turns out to be expressible as pure functions transforming functions, which is why it's taken as the essence of computing.",
  },
  {
    prompt:
      "In the lambda calculus 'everything is a function.' Which statement best captures what that means?",
    options: [
      "There is only one kind of thing — functions that take functions and return functions — and things like numbers and true/false are built from them rather than given",
      "It means every function must return a number as its result",
      "It means the language has functions plus a few built-in numbers and commands",
      "It means functions are just a convenient shortcut for writing arithmetic",
    ],
    modelAnswer:
      "The lambda calculus has only one kind of thing, the function; there are no built-in numbers, booleans, or data, so everything else must be encoded out of functions — that is what 'everything is a function' means.",
  },
  {
    prompt:
      "Why would anyone study a 'language' stripped down to almost nothing — just variables, defining a function, and applying one?",
    options: [
      "Because a system small enough to reason about completely lets you prove what computation can and cannot do — and, surprisingly, it turns out to be as powerful as any computer",
      "Because smaller languages are always easier to type quickly",
      "Because it is only a historical curiosity with no real consequences",
      "Because removing features is the only way to make a language run faster",
    ],
    modelAnswer:
      "Stripping computation down to its essence makes it possible to reason about it completely and prove what is and isn't computable; the striking payoff is that this tiny system is exactly as powerful as any computer.",
  },
];

const SUBJECT_THIRD: DiagItem[] = [
  {
    prompt:
      "The identity function λx. x is applied to some argument a. A student says the result is 'just λx. x again.' Using beta reduction, what's the best correction?",
    options: [
      "It reduces to a — beta reduction substitutes the argument for the parameter, and the identity function hands back whatever it is given",
      "It stays λx. x, because applying a function never changes it",
      "It reduces to x, the leftover parameter name",
      "There is no answer, since the lambda calculus can't apply functions",
    ],
    modelAnswer:
      "Applying λx. x to a triggers beta reduction: you substitute a for every x in the body, which is just x, so the whole thing becomes a — the identity function returns its input unchanged.",
    skillArea: "analysis",
  },
  {
    prompt:
      "In the expression λx. (x + y), one variable is bound and the other is free. Which statement reasons about this correctly?",
    options: [
      "x is bound (the local name the function introduces, whose name is arbitrary) while y is free (it refers to something from outside the function)",
      "Both x and y are bound, because they both appear inside the function",
      "Both are free, since neither has a value assigned yet",
      "y is bound and x is free, because y is written second",
    ],
    modelAnswer:
      "The x is bound — it is the placeholder the λ introduces and its name could be changed freely — while y is free, since nothing in the function introduces it, so it must refer to something in the surrounding context.",
    skillArea: "inference",
  },
  {
    prompt:
      "Someone says, 'Running a lambda calculus program must mean executing instructions on a processor, like any other program.' Given the course, why is that misleading?",
    options: [
      "Because there is no processor — computation is rewriting by beta reduction, substituting arguments into functions step by step until no function meets an argument (normal form)",
      "Because lambda calculus programs can't actually compute anything at all",
      "Because the lambda calculus runs only on specially built hardware",
      "Because it always requires translating the program into numbers first",
    ],
    modelAnswer:
      "The lambda calculus has no machine or instructions; 'running' an expression means repeatedly applying beta reduction — substituting each argument for its parameter — until the expression reaches normal form, which is the answer.",
    skillArea: "evaluation",
  },
];

const SUBJECT_TWOTHIRDS: DiagItem[] = [
  {
    prompt:
      "The Church numeral for two is λf. λx. f (f x), and zero is λf. λx. x. A student asks what makes the first one 'two.' The best answer is:",
    options: [
      "A Church numeral encodes a number as how many times it applies a function f to a starting value x — so 'two' applies f exactly twice, and zero applies it not at all",
      "It is two because it has two λ symbols in front",
      "It is two because the letter x appears twice in the expression",
      "There's nothing numeric about it; the name 'two' is arbitrary",
    ],
    modelAnswer:
      "Church numerals represent a number by repetition: the numeral n applies a function f to x exactly n times, so λf. λx. f (f x) is 'two' because f is applied twice, while zero applies it zero times — number becomes a count of applications.",
    skillArea: "analysis",
  },
  {
    prompt:
      "In the lambda calculus, TRUE is λa. λb. a and FALSE is λa. λb. b. Why does this make 'if-then-else' come almost for free?",
    options: [
      "Because a boolean is a chooser — give it the then-branch and the else-branch and TRUE returns the first while FALSE returns the second, which is exactly what if-then-else does",
      "Because every boolean must first be converted into a Church numeral",
      "Because TRUE and FALSE are really just the numbers one and zero in disguise",
      "Because the lambda calculus has a built-in if statement these stand for",
    ],
    modelAnswer:
      "Encoding TRUE and FALSE as functions that pick the first or second of two arguments means a condition is its own selector: applying it to the two branches yields the chosen one, so if-then-else is just applying the boolean to the branches.",
    skillArea: "inference",
  },
  {
    prompt:
      "A factorial function has no name, so it can't call itself to recurse. A friend concludes recursion is impossible in the lambda calculus. Why is that wrong?",
    options: [
      "Because you can pass the function to itself as an argument, and the Y combinator automates exactly this self-application to produce recursion with no names at all",
      "Because the lambda calculus secretly allows you to name functions after all",
      "Because recursion is replaced by simply writing the function out infinitely many times",
      "Because only built-in loops, not functions, can repeat in the lambda calculus",
    ],
    modelAnswer:
      "A nameless function can still recurse by receiving itself as an argument; the Y combinator is a fixed-point combinator that wires up this self-application automatically, so recursion arises with no names — defeating the 'it can't call itself' objection.",
    skillArea: "evaluation",
  },
];

const SUBJECT_AFTER: DiagItem[] = [
  {
    prompt:
      "A friend reasons, 'The lambda calculus is so tiny — just functions — that it must be weaker than a real computer with memory and instructions.' Drawing on the unit, the strongest correction is:",
    options: [
      "Not so — the lambda calculus and Turing machines can each simulate the other, so despite looking utterly different they have exactly the same computational power",
      "That's right; pure functions can never match a machine with memory",
      "It's actually stronger, since it can solve problems no computer can",
      "There's no way to compare two such different systems at all",
    ],
    modelAnswer:
      "Two very different models — a tape-and-head Turing machine and pure functions — can each emulate the other, so they compute exactly the same things; the lambda calculus's small size doesn't limit its power, which is the heart of the Church–Turing thesis.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "A friend insists, 'With enough cleverness, someone could write one program that decides whether any given program will eventually halt.' Drawing on the unit, the strongest correction is:",
    options: [
      "Not possible — the halting problem is provably unsolvable, so no single program can decide for every possible program whether it halts",
      "That's right; a sufficiently advanced program could always tell",
      "It's only impossible because today's computers are too slow",
      "Halting can be decided, but only for programs written in the lambda calculus",
    ],
    modelAnswer:
      "Because the lambda calculus and Turing machines are equivalent, the halting problem applies to both: it is provably impossible to write a program that decides, for every program, whether it eventually halts — a fundamental limit, not a matter of cleverness or speed.",
    skillArea: "inference",
  },
  {
    prompt:
      "A friend says, 'The lambda calculus is just an abstract toy with no connection to the real languages programmers actually use.' Drawing on the unit, the strongest reply is:",
    options: [
      "Real languages are essentially the lambda calculus plus conveniences — names, loops, native numbers and types as sugar over substitution — and Lisp, ML, Haskell, and first-class functions everywhere descend directly from it",
      "She's right; modern languages owe nothing to the lambda calculus",
      "It matters only to mathematicians, never to working programmers",
      "The connection is purely coincidental and not worth studying",
    ],
    modelAnswer:
      "The lambda calculus is the backbone of real languages: features like names, loops, and built-in numbers are conveniences layered over function application and substitution, and whole families (Lisp, ML, Haskell) plus first-class functions in mainstream languages trace straight back to it.",
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
      baseTitle: `Lambda Calculus Check — ${PHASE_LABEL[phase]}`,
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
