import { db } from "@workspace/db";
import {
  topicsTable,
  lecturesTable,
  assignmentsTable,
  problemsTable,
  seedMetaTable,
} from "@workspace/db";
import { eq, sql, and, like, notInArray } from "drizzle-orm";
import { logger } from "./logger";

// Content version of the seeded curriculum. BUMP THIS whenever the TOPICS or
// ASSIGNMENTS content below changes. On boot, seedIfEmpty compares this against
// the value stored in seed_meta; a mismatch forces a full re-seed, so content
// edits self-heal in every environment (including a republished production)
// without a manual database wipe.
const SEED_CONTENT_VERSION = "2026-06-18-baby-lambda-calculus-v1";

type SeedTopic = {
  slug: string;
  title: string;
  weekNumber: number;
  blurb: string;
  lectureTitle: string;
  body: string;
};

const TOPICS: SeedTopic[] = [
  // Unit 1 — Baby Lambda Calculus: everything is a function
  {
    slug: "what-lambda-calculus-is",
    title: "What the lambda calculus is",
    weekNumber: 1,
    blurb: "The lambda calculus is the smallest complete model of computation — a tiny language where there are no numbers, no data, and no commands, only functions.",
    lectureTitle: "1.1 What the lambda calculus is: everything is a function",
    body: `# What the lambda calculus is

Most people meet computing as machines — chips, memory, instructions being carried out one after another. The **lambda calculus** comes at it from the opposite direction. Invented by the logician Alonzo Church in the 1930s, before any real computers existed, it asks a startling question: how little do you need to capture *all* of computation? The answer turns out to be almost nothing — just **functions**. No numbers, no text, no loops, no commands. From that one idea, everything else can be built, and that radical minimalism is the whole point of this course.

## Everything is a function

In the lambda calculus there is exactly one kind of thing: a **function**. There are no built-in numbers, no true or false, no lists — only functions that take a function as input and hand back a function as output. This sounds impossibly bare, like trying to build a house with only hammers and no wood. The surprise of the entire subject is that it is enough: numbers, logic, data structures, and even unlimited repetition can all be *encoded* as functions. Learning to see functions as the raw material of everything is the single shift this course asks of you.

## The three building blocks

The whole language has just three pieces. A **variable** is a name, like *x*. An **abstraction** is how you *define* a function: \`λx. body\` means "the function that takes an input called *x* and returns *body*." An **application** is how you *use* a function: writing \`f x\` means "apply the function *f* to the input *x*." That's it — variables, abstraction, application. Every lambda calculus expression, no matter how clever, is built only from those three moves, which is why the language is small enough to write its entire grammar on a napkin.

## Functions are first-class

The reason so little can do so much is that functions here are **first-class**: a function can be passed to another function, returned from one, and handed around exactly like any other value — because functions are the *only* value. A function that takes another function as its input and returns a new function is completely ordinary. This freedom to treat functions as data is what lets you stack them up to mimic numbers, choices, and structures that the language never built in directly.

## Why so minimal

It's natural to ask why anyone would strip a language down this far. The reason is *understanding*: a model small enough to reason about completely lets you prove what computation can and cannot do, with no clutter to hide behind. The lambda calculus is to programming what a single clean experiment is to science — it isolates the essence. And the punchline, which the rest of the course builds toward, is that this stripped-down toy is exactly as powerful as any computer ever built. Nothing more is needed.

## In the real world

The lambda calculus is not a museum piece. Every time you write a "lambda" or anonymous function in Python, JavaScript, or almost any modern language, you are using Church's idea directly. Whole languages — Lisp, Haskell, ML — are built straight on it, and the "functions as values" style it pioneered has spread into nearly all programming. It also underlies how compilers reason about code and how theorists define what "computable" even means. For something with no numbers in it, the lambda calculus quietly shapes an enormous amount of the software you use every day.`,
  },
  {
    slug: "application-and-substitution",
    title: "Application and substitution",
    weekNumber: 1,
    blurb: "Computation in the lambda calculus isn't 'running' anything — it's rewriting, plugging an argument into a function's body over and over until nothing is left to simplify.",
    lectureTitle: "1.2 Application and substitution: computation as rewriting",
    body: `# Application and substitution

In an ordinary computer, "running a program" means a processor stepping through instructions. The lambda calculus has no processor and no instructions. Instead, **computation is rewriting**: you take an expression and repeatedly simplify it by plugging arguments into functions, exactly the way you'd simplify an arithmetic expression by hand. There's really only one rule, and once you've seen it, you've seen how every lambda calculus program "runs."

## Application: feeding a function its input

Writing \`f x\` means *apply* the function \`f\` to the input \`x\`. If \`f\` is a defined function — an abstraction like \`λx. body\` — then applying it means handing it a specific input to work on. Think of an abstraction as a recipe with a blank ("take some *x* and do this to it") and application as filling that blank with an actual ingredient. Nothing happens until a function meets an argument; application is the moment a definition is finally put to use.

## Beta reduction: the one rule

The single rule of computation is called **beta reduction**, and it's just substitution. When a function \`λx. body\` is applied to an argument, you take the body and replace every \`x\` in it with that argument. So \`(λx. x)\` applied to *a* simply becomes *a* — the identity function hands back whatever you give it. \`(λx. f x)\` applied to *a* becomes \`f a\`. That's the whole engine: find a function meeting an argument, and substitute the argument in for the parameter. Every computation, however elaborate, is just this move repeated.

## Computation as a sequence of rewrites

A real expression usually needs *many* substitutions, done one after another. Each beta reduction produces a new, usually simpler, expression, and you keep going — find the next place where a function meets an argument, substitute, repeat. It's like simplifying \`(3 + 4) × 2\` to \`7 × 2\` to \`14\`: a chain of small, mechanical steps, each one legal and each one bringing you closer to an answer. A lambda calculus "program" is just an expression, and "running" it is walking that chain of rewrites.

## Normal form: the answer, and when there isn't one

When no function is left meeting an argument, there's nothing more to substitute — the expression is in **normal form**, and that's your answer. But here's the subtle part: not every expression reaches one. Some can be rewritten forever, never settling down, looping endlessly the way \`(λx. x x)(λx. x x)\` reduces to itself again and again. That possibility of never stopping isn't a bug; it's the very thing that makes the language powerful enough to express endless loops, a theme that returns when we reach recursion.

## In the real world

This "evaluate by rewriting" idea is exactly how functional languages run your code: an expression is simplified step by step until it can't be reduced further. Compilers and interpreters lean on substitution to inline functions and optimize programs. Even the way a spreadsheet recalculates, or an algebra system simplifies a formula, echoes beta reduction. And the fact that some expressions never reach normal form is the lambda calculus's first hint of the deepest result in all of computing — that some programs simply never halt.`,
  },
  {
    slug: "bound-and-free",
    title: "Bound and free variables",
    weekNumber: 1,
    blurb: "Variables come in two kinds — bound by a function or free from outside — and confusing them quietly corrupts substitution, which is why renaming is a genuine skill, not a triviality.",
    lectureTitle: "1.3 Bound and free: variables, renaming, and why it matters",
    body: `# Bound and free variables

Substitution sounds simple — "replace *x* with the argument" — but there's a trap hiding in it that can silently give wrong answers. The trap comes from the fact that the same name can mean different things in different places. Sorting out which is which is what **bound** and **free** variables are about, and handling them correctly is one of those quiet skills that separates a working idea from a broken one.

## Bound variables: introduced by a function

A variable is **bound** when it's the input name a function introduces. In \`λx. (x + 1)\` the *x* is bound: it's a local placeholder that only means something inside that function's body, like the *x* in "let *x* be the number you're given." Its actual name doesn't matter at all — \`λx. (x + 1)\` and \`λy. (y + 1)\` are the very same function. A bound variable is private to its function, a temporary label with no meaning outside it.

## Free variables: coming from outside

A variable is **free** when it is *not* introduced by an enclosing function — it refers to something from the surrounding context. In \`λx. (x + y)\`, the *x* is bound but the *y* is free: the function says nothing about what *y* is, so *y* must mean something defined elsewhere. Free variables are the expression's connections to the outside world. The same name can even be bound in one part of an expression and free in another, which is exactly where confusion creeps in.

## Variable capture: the trap

Now the danger. Suppose you substitute the argument *y* into \`λy. (x y)\` in place of *x*. Done naively, you'd get \`λy. (y y)\` — and disaster: the *y* you brought in *from outside* (a free variable) has been accidentally "captured" by the function's own bound *y*, as if it were the local one. The meaning is now completely wrong. This **variable capture** is the subtle bug substitution must avoid; it's the lambda calculus version of two unrelated people sharing a name and getting mixed up.

## Alpha renaming: the fix

The cure is simple and powerful: a bound variable's name is arbitrary, so you may **rename** it freely before substituting, as long as you change it everywhere consistently. This is called **alpha conversion**. Before dropping a free *y* into \`λy. (x y)\`, first rename the bound one — say to \`λz. (x z)\` — and now the substitution gives \`λz. (y z)\`, with no collision. Renaming bound variables to dodge capture is a routine, mechanical safety step, and recognizing *when* it's needed is the real skill this topic teaches.

## In the real world

This is exactly the idea of **scope** in every programming language: a variable declared inside a function is local (bound) and doesn't clash with one of the same name outside (free). Compilers rename variables behind the scenes for precisely this reason, and "hygienic" macro systems exist specifically to prevent accidental capture when code is generated. Anytime you've worried whether two variables with the same name might collide, or been grateful that a loop's counter doesn't leak out, you've met bound-versus-free reasoning in the wild.`,
  },
  {
    slug: "church-numerals",
    title: "Church numerals",
    weekNumber: 1,
    blurb: "The lambda calculus has no numbers built in — yet you can represent every counting number, and do arithmetic on them, using nothing but functions that repeat.",
    lectureTitle: "1.4 Building numbers from nothing: Church numerals",
    body: `# Church numerals

Here's where the lambda calculus first shows off. We said the language has *no numbers* — only functions. So how can it possibly do arithmetic? The answer, due to Church himself, is one of the most beautiful tricks in all of computing: represent a number not as a symbol, but as an *action repeated a certain number of times*. These function-encodings of numbers are called **Church numerals**, and they conjure counting out of pure functions.

## Numbers as repetition

The key idea: a number is **how many times you do something**. Picture a function \`f\` and a starting value \`x\`. The number three means "apply \`f\` three times": \`f (f (f x))\`. The number one means "apply \`f\` once": \`f x\`. So a Church numeral is a function that takes a function \`f\` and a value \`x\`, and applies \`f\` to \`x\` that many times. The number *is* the repetition — counting becomes "how many applications," which is something functions can express perfectly.

## Zero, one, two...

This gives a clean ladder. **Zero** is "apply \`f\` no times at all" — just hand back \`x\` untouched: \`λf. λx. x\`. **One** applies it once: \`λf. λx. f x\`. **Two** applies it twice: \`λf. λx. f (f x)\`. Each numeral has exactly the same shape, differing only in how many \`f\`s are stacked up. Notice that *zero* looks suspiciously like a function that ignores its first input — a hint of how numbers and logic will turn out to be related later on.

## Arithmetic on functions

Because numbers are now repetition, *arithmetic* becomes manipulating repetition. The **successor** function — add one — takes a numeral and wraps one more \`f\` around it. **Addition** of two numbers means "do the first amount of repeating, then the second": you compose the repetitions. **Multiplication** repeats a repetition. None of this needs a number line; it's all just functions arranging how many times other functions run. Once you accept "a number is its amount of doing," ordinary arithmetic falls out as bookkeeping on functions.

## Something from nothing

Step back and appreciate what just happened. Starting from a language with *literally no numbers*, we built the entire counting system — and the operations on it — out of functions alone. This is the lambda calculus's signature move: a thing you thought had to be *given* turns out to be *constructible* from something simpler. It's a small miracle of reduction, and it's the template for the next two topics, where logic and even recursion get conjured the very same way.

## In the real world

The deep lesson — that **data can be encoded as behavior** — runs through computer science. It's why a single uniform mechanism (functions) can stand in for many different kinds of data, an idea used in functional programming, in type theory, and in how compilers represent values. "Church encoding" is still taught and occasionally used to model data structures as functions. More broadly, the realization that numbers needn't be primitive — that they can be *built* — reshaped how logicians and computer scientists think about the foundations of mathematics itself.`,
  },
  {
    slug: "booleans-and-logic",
    title: "Booleans, logic, and choice",
    weekNumber: 1,
    blurb: "True and false, if-then-else, and the logic gates AND, OR, and NOT all emerge from pure functions — once you see true and false as 'choosers,' decision-making writes itself.",
    lectureTitle: "1.5 Booleans, logic, and choice from pure functions",
    body: `# Booleans, logic, and choice

We built numbers from nothing; now we'll build **logic** the same way. A program isn't much use if it can't make a *choice* — do this if something is true, otherwise do that. But the lambda calculus has no \`true\`, no \`false\`, and no \`if\` statement. As with numbers, the fix is to find functions that *behave* like truth and choice. The encoding is so natural that "making a decision" turns out to be the most function-like thing imaginable.

## True and false as choosers

The trick is to define true and false by what they *do*: choose between two options. **TRUE** is the function that, given two things, picks the **first**: \`λa. λb. a\`. **FALSE** is the function that picks the **second**: \`λa. λb. b\`. That's the entire definition. A boolean isn't a flag here; it's an *active chooser* that selects one of two alternatives handed to it. Once you see true and false this way, the rest of logic almost designs itself.

## If-then-else for free

Because true and false already choose between two options, the **if-then-else** you'd normally have to invent comes for free. To compute "if *C* then *T* else *E*," you just apply *C* to *T* and *E*. If *C* is TRUE, it picks *T*; if *C* is FALSE, it picks *E*. There's no special branching construct at all — selection is simply what a boolean *is*. This is the elegant payoff of defining truth by behavior: the decision mechanism is baked right into the values.

## AND, OR, NOT

The logic gates follow by wiring choosers together. **NOT** takes a boolean and swaps its two choices, turning a first-picker into a second-picker. **AND** of two booleans returns the second only if the first is true (otherwise it short-circuits to false), and **OR** returns true if the first is true and otherwise defers to the second. Each is just a small function that routes its inputs through the choose-first / choose-second behavior. The familiar truth tables emerge entirely from how the choosers are combined.

## Pairs and data structures

The same choosing trick bundles data together. A **pair** of two values can be stored as a function that "holds" both and waits for a chooser to ask for one — hand it TRUE to get the first, FALSE to get the second. From pairs you can build lists, records, and trees, all as functions. So the lambda calculus reaches data structures the way it reached numbers and booleans: not by adding a feature, but by noticing that a cleverly arranged function already behaves exactly like the thing you wanted.

## In the real world

Every \`if\` statement, every boolean expression, every \`&&\` and \`||\` in the code you write is this idea in concrete form. The notion that a value can *carry its own behavior* — that true "knows" how to choose — anticipates objects and first-class functions across modern languages. And the realization that data structures are just bundled-up access functions underlies functional data design and even how some languages implement records and variants. Decision-making, the heart of every program, was lurking inside plain functions all along.`,
  },
  {
    slug: "y-combinator",
    title: "Recursion and the Y combinator",
    weekNumber: 1,
    blurb: "A function with no name can't call itself by name — yet the lambda calculus achieves unlimited repetition anyway, through a mind-bending construction called the Y combinator.",
    lectureTitle: "1.6 Recursion from nowhere: the Y combinator",
    body: `# Recursion and the Y combinator

By now the lambda calculus can count and decide. But real computation needs to *repeat* — to keep going until some condition is met. In ordinary languages you'd write a loop, or have a function call itself by name. The lambda calculus has neither loops nor names: every function is anonymous. So how can a nameless function possibly repeat itself? The answer is the **Y combinator**, one of the most famous and dizzying ideas in computer science, and it pulls recursion out of thin air.

## The problem: a nameless function can't call itself

Recursion normally relies on a name: "factorial of *n* is *n* times factorial of *n−1*" works because *factorial* can refer to *factorial*. But a lambda abstraction has no name for itself — it's just \`λn. ...\` with nothing to call back to. The moment you try to write a function that repeats, you reach for its own name and find there isn't one. This isn't a small inconvenience; it looks like a wall, because repetition seems to *require* self-reference.

## The trick: pass yourself to yourself

The way through is sneaky but simple to state: if a function can't know its own name, then **give it itself as an argument**. Write the function so that its first input is "a copy of itself to call," and then arrange to hand it that copy at the right moment. Self-reference becomes ordinary application — the function reaches its "self" not by name, but because someone passed it in. Recursion stops being about names and becomes about *feeding a function to itself*.

## The Y combinator

The **Y combinator** is the single function that automates this trick. You hand it a function that's been written in the "expects a copy of itself" style, and Y arranges for that function to be applied to itself, again and again, exactly as the computation unfolds. It manufactures the endless self-application that recursion needs, with no names anywhere. Written out, Y looks cryptic — a small knot of variables applied to each other — but all it's doing is the "pass yourself to yourself" move, set up to repeat on demand.

## Fixed points

Underneath, Y computes what mathematicians call a **fixed point**: a value that a function leaves unchanged. A recursive definition is really an equation — "*factorial* is the function that, given *factorial*, behaves like factorial" — and its solution is a fixed point of that equation. The Y combinator is a *fixed-point combinator*: a universal tool that solves "find the function equal to its own unrolling." That's the deep reason it works — recursion *is* a fixed-point problem, and Y is the machine that solves it.

## In the real world

Every loop and every recursive function you've ever written is this idea made comfortable. Languages give you names and loops so you never *have* to build recursion from scratch — but underneath, self-reference is exactly what's happening. Fixed-point thinking shows up in how compilers analyze programs, how spreadsheets resolve circular-looking definitions, and how certain elegant algorithms are specified. And the startup accelerator named "Y Combinator" took its name from this very construction — a nod to building something powerful out of pure self-reference.`,
  },
  {
    slug: "lambda-equals-turing",
    title: "Lambda calculus equals Turing machines",
    weekNumber: 1,
    blurb: "Two utterly different models of computation — Church's functions and Turing's tape machine — turn out to have exactly the same power, a coincidence so deep it defines what 'computable' means.",
    lectureTitle: "1.7 The punchline: lambda calculus equals Turing machines",
    body: `# Lambda calculus equals Turing machines

Now for the payoff the whole course has been pointing at. In the 1930s, two people set out to pin down what it means for something to be *computable*. Alan Turing imagined an abstract machine reading and writing symbols on a tape. Alonzo Church built the lambda calculus of pure functions. The two models could hardly look more different — yet they turned out to be **exactly equally powerful**. Anything one can compute, the other can too. That stunning agreement is the punchline, and it changed how we understand computation forever.

## Two models, the same power

A **Turing machine** is all mechanism: a tape, a head shuffling left and right, states, and rules for rewriting symbols. The **lambda calculus** is all mathematics: functions and substitution, with no machine at all. One feels like hardware, the other like algebra. Despite that, you can translate any Turing machine into a lambda expression that does the same thing, and any lambda expression into a Turing machine — each can perfectly simulate the other. Two completely independent attempts to capture "computation" landed on the identical notion of power.

## The Church–Turing thesis

That coincidence led to a bold claim, the **Church–Turing thesis**: *anything that can be computed by any effective procedure at all can be computed by these models.* It's not a theorem you can prove — it's a claim about the very meaning of "computable" — but every model of computation ever invented since (real computers included) has turned out to be no more powerful than a Turing machine or the lambda calculus. So when we say something is "computable," we really mean "expressible in the lambda calculus," which is the same as "runnable on a Turing machine."

## Anything computable, computable here

The practical upshot is sweeping: the tiny lambda calculus — variables, abstraction, application, and nothing else — can compute *anything any computer can*. Your laptop, with all its speed and memory, can solve no problem that the lambda calculus cannot also solve in principle. The difference is efficiency and convenience, not raw capability. This is what people mean by **Turing-complete**: a system powerful enough to express every computation. The whole sprawling world of software rests on a foundation small enough to fit in this one unit.

## The limits: what nothing can compute

Equivalence cuts both ways, and it reveals hard *limits*. Because some lambda expressions never reach a normal form — they reduce forever — there's no general way to predict, in advance, whether an arbitrary computation will ever stop. This is the famous **halting problem**, and it's genuinely *unsolvable*: no program, in any language, can correctly decide it for all inputs. So the same theory that shows the lambda calculus can do everything computable also draws a sharp line around what computation can *never* do — and that line is the same for every computer that will ever exist.

## In the real world

These ideas are the bedrock of the theory of computation taught in every computer science program. "Turing-complete" is a real, everyday yardstick — people use it to argue about whether a language, a spreadsheet, or even a board game is powerful enough to compute anything. The halting problem's unsolvability explains why no tool can perfectly detect all infinite loops or prove all programs correct. And the Church–Turing thesis quietly underwrites the whole field's confidence that what runs on one computer can, in principle, run on any other.`,
  },
  {
    slug: "lambda-to-real-languages",
    title: "From lambda to real languages (capstone)",
    weekNumber: 1,
    blurb: "Each topic built one piece — functions, rewriting, numbers, logic, recursion — and the capstone shows how those pieces grew into the real programming languages we use today.",
    lectureTitle: "1.8 From lambda to real languages (Capstone)",
    body: `# From lambda to real languages (capstone)

We've now assembled the whole picture: a language with nothing but functions (1.1), computation as rewriting (1.2), the care variables demand (1.3), numbers built from repetition (1.4), logic and choice from choosers (1.5), recursion conjured by self-application (1.6), and the proof that this tiny system is as powerful as any computer (1.7). The capstone idea is simple and worth carrying with you: the lambda calculus isn't a curiosity off to the side — it's the **direct ancestor** of the languages programmers actually use, and you can trace a clear line from it to them.

## Pulling the course together

In one sentence, here's the whole journey: **functions** are the only material; **beta reduction** is how they compute; **bound-and-free** discipline keeps substitution honest; **Church numerals** show data can be encoded as behavior; **booleans and choosers** give us logic and decisions; **the Y combinator** gives us unlimited repetition; and the **Church–Turing equivalence** proves that's already everything computation can be. Each topic added one capability, and together they reach the full power of computing from a starting point of almost nothing.

## From pure lambda to real features

Real languages don't make you encode numbers as repeated function calls — but underneath, they're the lambda calculus with conveniences added. **Names** let you call a function without passing it to itself; **loops** package the recursion the Y combinator showed was always possible; **built-in numbers, booleans, and data types** replace the Church encodings with fast, native versions; **types** add a safety net that rules out nonsense before you run it. Every one of these is a comfort layered on top of the core — sugar over substitution — not a new kind of power.

## A way of thinking, not just syntax

Step back and the deepest takeaway isn't any single encoding — it's a *way of seeing computation*. The lambda calculus teaches you that a program is a **transformation**: inputs flowing through functions, being rewritten into outputs, with no hidden state required. That functional mindset — build small functions, compose them, avoid tangled mutable state — is a powerful discipline far beyond any one language. Learning to think "what function transforms this into that?" is a habit that makes code clearer wherever you write it.

## Why this idea is everywhere

Functional programming, once exotic, has gone mainstream precisely because of these foundations. Lisp, ML, and Haskell descend straight from the lambda calculus, and "first-class functions," lambdas, \`map\`/\`filter\`, and immutable data have since spread into Python, JavaScript, Java, C#, Rust, and nearly every modern language. The reason is practical: function-centered code is often easier to reason about, test, and run in parallel. The ideas in this little unit aren't historical trivia — they're why so much current software is shaped the way it is.

## In the real world

Put it all together and the lambda calculus is the quiet foundation under a huge amount of computing. The anonymous functions you write, the recursive algorithms you run, the type checkers that catch your mistakes, and the whole functional style now woven through everyday languages all trace back to Church's three little rules. The one habit worth carrying out of this course is this: when computation feels mysterious, remember it can all be reduced to functions taking functions and handing back functions — because, provably, that's all it ever was.`,
  },
];

type SeedAssignment = {
  kind: "homework" | "test" | "midterm" | "final";
  title: string;
  weekNumber: number;
  isTimed: boolean;
  timeLimitMinutes: number | null;
  instructions: string;
  problems: Array<{
    topicSlug: string;
    prompt: string;
    correctAnswer: string;
    explanation: string;
    hint?: string;
  }>;
};

const ASSIGNMENTS: SeedAssignment[] = [
  {
    kind: "homework",
    title: "Homework 1.1 — Functions, reduction, variables, and numbers",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions:
      "Untimed practice covering sections 1.1–1.4. Answer each question in a few sentences (about 3–5) in your own words. You don't need to write out heavy formal derivations — just explain the reasoning clearly. One-word answers won't receive credit.",
    problems: [
      {
        topicSlug: "what-lambda-calculus-is",
        prompt:
          "A friend says, 'A programming language with no numbers, no data, and no commands — only functions — couldn't possibly do anything useful.' Using what the lambda calculus is, explain why this intuition is wrong and what it means that 'everything is a function.' (3–5 sentences.)",
        correctAnswer:
          "The lambda calculus really does have only functions — built from three pieces: variables, abstraction (defining a function with λx. body), and application (using one, f x) — yet that is enough to express all of computation. The trick is that things we normally treat as primitive, like numbers, true/false, and data structures, can all be *encoded* as functions rather than built in. Functions here are first-class: they can be passed to and returned from other functions, which is what lets them be stacked up to imitate everything else. So 'everything is a function' isn't a limitation; it's the surprising claim, proven later in the course, that functions alone are as powerful as any computer.",
        explanation:
          "Full credit: explains the language has only functions (variables/abstraction/application), that other things are encoded rather than built in, notes functions are first-class, and that this minimal system is fully powerful.",
      },
      {
        topicSlug: "application-and-substitution",
        prompt:
          "Someone asks, 'If the lambda calculus has no processor and no instructions, what does it even mean to *run* a program?' Explain how computation happens through beta reduction, and what it means for an expression to reach normal form. (3–5 sentences.)",
        correctAnswer:
          "Running a program in the lambda calculus means *rewriting* an expression, not executing instructions on a chip. The single rule is beta reduction: whenever a function λx. body meets an argument, you substitute that argument in for every x in the body, producing a simpler expression. You apply this rule over and over — each step like simplifying an arithmetic expression — until there's no function left meeting an argument, and that final expression is the normal form, i.e. the answer. Importantly, some expressions never reach a normal form because they can be rewritten forever, which is exactly what lets the language express endless loops.",
        explanation:
          "Full credit: describes computation as rewriting via beta reduction (substitute the argument for the parameter), repeated until normal form (the answer), and notes some expressions never terminate.",
        hint: "What is the one rule of computation, and what does it do when a function meets an argument? When do you stop?",
      },
      {
        topicSlug: "bound-and-free",
        prompt:
          "In the expression λx. (x + y), one variable is bound and the other is free. Explain the difference, why substituting carelessly can cause 'variable capture,' and how alpha renaming fixes it. (3–5 sentences.)",
        correctAnswer:
          "In λx. (x + y) the x is bound — it's the local placeholder the function introduces, meaningful only inside the body — while y is free, referring to something from the surrounding context. The danger comes when you substitute a free variable into a function whose bound variable shares that name: the incoming free variable gets accidentally 'captured' by the local one, silently changing the meaning. Alpha renaming fixes this: because a bound variable's name is arbitrary, you may rename it consistently (say x to z) before substituting, so the incoming free variable no longer collides. Recognizing when renaming is needed is the real skill, since naive substitution can otherwise produce wrong answers.",
        explanation:
          "Full credit: distinguishes bound (introduced by the function, local) from free (from outside), explains variable capture as a free variable being caught by a same-named bound one, and that alpha renaming the bound variable avoids it.",
      },
      {
        topicSlug: "church-numerals",
        prompt:
          "The lambda calculus has no numbers built in, yet Church numerals represent them anyway. Explain the core idea behind representing a number as a function, and how 'zero' and 'two' differ. (3–5 sentences.)",
        correctAnswer:
          "A Church numeral represents a number as *how many times a function is applied* — the number is the amount of repetition. Each numeral is a function that takes a function f and a starting value x and applies f to x that many times. So zero applies f no times at all and just returns x untouched (λf. λx. x), while two applies f twice, giving f (f x) (λf. λx. f (f x)). Every numeral has the same shape and differs only in how many f's are stacked, so arithmetic becomes manipulating repetition — the deeper lesson being that data can be encoded as behavior.",
        explanation:
          "Full credit: explains a number = number of times a function is applied, that a numeral takes f and x and repeats f, and correctly contrasts zero (returns x, no applications) with two (applies f twice).",
      },
    ],
  },
  {
    kind: "homework",
    title: "Homework 1.2 — Logic, recursion, equivalence, and the big picture",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions:
      "Untimed practice covering sections 1.5–1.8. Answer each question in a few sentences (about 3–5) in your own words. No formal derivations are required — explain your reasoning. One-word answers won't receive credit.",
    problems: [
      {
        topicSlug: "booleans-and-logic",
        prompt:
          "In the lambda calculus, TRUE is defined as the function that picks the first of two options and FALSE as the one that picks the second. Explain how this definition gives you if-then-else 'for free,' without any special branching construct. (3–5 sentences.)",
        correctAnswer:
          "Because true and false are defined by what they *do* — choosing between two options — the decision mechanism is already built into the values themselves. TRUE (λa. λb. a) selects its first argument and FALSE (λa. λb. b) selects its second. So to compute 'if C then T else E,' you simply apply C to T and E: if C is TRUE it returns T, and if C is FALSE it returns E. There's no need to invent a separate if-statement, because selecting one of two alternatives is exactly what a boolean *is* in this encoding.",
        explanation:
          "Full credit: explains booleans are 'choosers' (TRUE picks first, FALSE picks second), and that applying the condition to the two branches performs the selection, so if-then-else needs no special construct.",
      },
      {
        topicSlug: "y-combinator",
        prompt:
          "Every function in the lambda calculus is anonymous, so a function can't call itself by name. Explain how recursion is achieved anyway, and what the Y combinator does. (3–5 sentences.)",
        correctAnswer:
          "Recursion normally needs a name so a function can refer to itself, but lambda functions have no names. The trick is to *pass the function itself in as an argument*, so it reaches its 'self' through ordinary application rather than by name. The Y combinator is the single function that automates this: you hand it a function written in the 'expects a copy of itself' style, and Y arranges for that function to be applied to itself repeatedly as the computation unfolds. Underneath, Y computes a fixed point — a value the function leaves unchanged — which is the precise mathematical sense in which a recursive definition is 'solved.'",
        explanation:
          "Full credit: explains nameless functions can't self-reference, the fix is passing the function to itself, and that the Y combinator automates this self-application (a fixed-point combinator).",
        hint: "If a function can't know its own name, what could you give it as an argument so it can still call 'itself'?",
      },
      {
        topicSlug: "lambda-equals-turing",
        prompt:
          "Turing machines and the lambda calculus look completely different — one is a tape-and-head machine, the other is pure functions. Explain what it means that they have exactly the same power, and what the Church–Turing thesis claims. (3–5 sentences.)",
        correctAnswer:
          "Although a Turing machine is all mechanism (a tape, a head, states and rules) and the lambda calculus is all mathematics (functions and substitution), each can perfectly simulate the other, so anything one can compute the other can compute too. Their equal power means neither is stronger; they capture the very same notion of computation despite looking nothing alike. The Church–Turing thesis takes this further, claiming that *any* effective procedure whatsoever can be carried out by these models — so 'computable' just means 'expressible in the lambda calculus' (equivalently, runnable on a Turing machine). It isn't a provable theorem but a claim about the meaning of computation, and no more powerful model has ever been found.",
        explanation:
          "Full credit: explains the two models can simulate each other (equal power despite looking different), and states the Church–Turing thesis defines 'computable' as what these models can do.",
      },
      {
        topicSlug: "lambda-to-real-languages",
        prompt:
          "A skeptic says, 'The lambda calculus is just an abstract toy — it has nothing to do with the languages people actually program in.' Using ideas from across the course, push back by explaining how real languages descend from it. (3–5 sentences.)",
        correctAnswer:
          "Real languages are essentially the lambda calculus with conveniences layered on top, not something fundamentally different. Names let you avoid passing a function to itself, loops package the recursion the Y combinator showed was always possible, and built-in numbers, booleans, and types replace the Church encodings with fast native versions — all sugar over substitution, adding comfort but no new power. You can trace a direct line from the lambda calculus to Lisp, ML, and Haskell, and its 'first-class functions' style now appears in Python, JavaScript, Java, and most modern languages. So it's far more than a toy: it's the ancestor whose ideas — functions as values, recursion, transformation over mutable state — shape the software we write today.",
        explanation:
          "Full credit: frames real languages as the lambda calculus plus conveniences (names, loops, native data/types as sugar), gives concrete descendants (Lisp/ML/Haskell, lambdas in mainstream languages), and notes the functional mindset.",
      },
    ],
  },
  {
    kind: "test",
    title: "Unit Test — Baby Lambda Calculus: Everything Is a Function",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 30,
    instructions:
      "Timed. 30 minutes. Covers sections 1.1–1.8. Answer each question in a few sentences (about 4–6) in your own words. No formal derivations are required. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      {
        topicSlug: "what-lambda-calculus-is",
        prompt:
          "Explain what the lambda calculus is. Cover its three building blocks, what it means that 'everything is a function,' why functions being first-class matters, and why such a minimal system is studied at all. (4–6 sentences.)",
        correctAnswer:
          "The lambda calculus is the smallest complete model of computation, built by Alonzo Church, in which the only kind of thing is a function. It has exactly three building blocks: variables (names like x), abstraction (defining a function, λx. body), and application (using a function, f x). 'Everything is a function' means there are no built-in numbers, booleans, or data — those are all *encoded* as functions instead. Functions are first-class, meaning they can be passed to and returned from other functions, which is what allows them to be combined to imitate everything the language lacks. It's studied because a system this small can be reasoned about completely, letting us prove what computation can and cannot do — and, remarkably, it's as powerful as any computer.",
        explanation:
          "Full credit: lists variables/abstraction/application, explains everything is encoded as functions, notes first-class functions enable the encodings, and gives a reason for studying such a minimal model.",
      },
      {
        topicSlug: "application-and-substitution",
        prompt:
          "Explain how computation works in the lambda calculus. Cover what application is, the rule of beta reduction, how a computation proceeds, and what normal form is (including that some expressions never reach it). (4–6 sentences.)",
        correctAnswer:
          "Computation is rewriting, not executing instructions. Application, written f x, means handing the function f a specific argument x to work on. The single rule is beta reduction: when a function λx. body meets an argument, you substitute that argument for every x in the body, yielding a simpler expression. A computation proceeds by applying this rule repeatedly — each step like simplifying an arithmetic expression — until no function is left meeting an argument, at which point the expression is in normal form and that is the answer. Crucially, some expressions can be rewritten forever and never reach a normal form, which is what lets the language express endless loops.",
        explanation:
          "Full credit: defines application, states beta reduction (substitute argument for parameter), describes repeated rewriting to normal form (the answer), and notes non-terminating expressions.",
      },
      {
        topicSlug: "bound-and-free",
        prompt:
          "Explain bound and free variables and why the distinction matters. Cover what makes a variable bound versus free, what variable capture is, and how alpha renaming prevents it. (4–6 sentences.)",
        correctAnswer:
          "A variable is bound when it is the local input name a function introduces — like the x in λx. (x + 1), meaningful only inside that body — and its name is arbitrary, so λx.(x+1) and λy.(y+1) are the same function. A variable is free when it isn't introduced by an enclosing function and instead refers to something from the surrounding context, like y in λx. (x + y). The distinction matters because of variable capture: if you substitute a free variable into a function whose bound variable has the same name, the incoming variable gets wrongly 'caught' by the local one, silently changing the meaning. Alpha renaming prevents this — since a bound variable's name doesn't matter, you rename it consistently before substituting so no collision occurs. Recognizing when renaming is needed is the real skill, since careless substitution otherwise gives wrong results.",
        explanation:
          "Full credit: distinguishes bound (local, function-introduced, name arbitrary) from free (from outside), explains variable capture, and that alpha renaming the bound variable avoids it.",
      },
      {
        topicSlug: "church-numerals",
        prompt:
          "Explain how Church numerals represent numbers using only functions. Cover the core idea, how zero and two are encoded, how arithmetic is done, and the deeper lesson it illustrates. (4–6 sentences.)",
        correctAnswer:
          "A Church numeral encodes a number as how many times a function is applied — the number *is* the amount of repetition. Each numeral is a function taking a function f and a value x and applying f to x that many times: zero applies f no times and returns x (λf. λx. x), while two applies f twice, f (f x) (λf. λx. f (f x)). Arithmetic becomes manipulating repetition: the successor wraps one more f around a numeral, addition does the first amount of repeating then the second, and multiplication repeats a repetition. None of this needs a number line — it's all functions arranging how often other functions run. The deeper lesson is that data can be encoded as behavior, the lambda calculus's signature move of building something thought to be primitive out of functions alone.",
        explanation:
          "Full credit: explains number = times f is applied, contrasts zero (returns x) and two (applies f twice), describes arithmetic as manipulating repetition, and notes the 'data as behavior' lesson.",
      },
      {
        topicSlug: "booleans-and-logic",
        prompt:
          "Explain how logic and choice are built from pure functions. Cover how true and false are defined, how if-then-else follows, how a logic gate like NOT works, and how data such as a pair can be encoded. (4–6 sentences.)",
        correctAnswer:
          "True and false are defined by what they do — choose between two options: TRUE picks the first (λa. λb. a) and FALSE picks the second (λa. λb. b). Because of this, if-then-else comes for free: to compute 'if C then T else E,' you apply C to T and E, and the boolean selects the right branch, so no special branching construct is needed. Logic gates are built by wiring choosers together — NOT, for instance, swaps a boolean's two choices, turning a first-picker into a second-picker, and AND/OR route their inputs through the same choosing behavior to reproduce the truth tables. Data structures follow the same trick: a pair is a function that holds two values and, given a chooser, returns the first (with TRUE) or the second (with FALSE), and from pairs you can build lists and trees. So decision-making and data both fall out of cleverly arranged functions rather than new features.",
        explanation:
          "Full credit: defines TRUE/FALSE as choosers, explains if-then-else as applying the condition to the branches, describes a gate like NOT, and how a pair is encoded as a function.",
      },
      {
        topicSlug: "y-combinator",
        prompt:
          "Explain how recursion is achieved in the lambda calculus. Cover why a nameless function can't call itself, the 'pass yourself to yourself' trick, what the Y combinator does, and the fixed-point idea underneath. (4–6 sentences.)",
        correctAnswer:
          "Recursion normally relies on a function's name so it can refer to itself, but every lambda function is anonymous and has no name to call back to. The way through is to pass the function itself in as an argument, so it reaches its 'self' through ordinary application rather than by name. The Y combinator automates this: given a function written in the 'expects a copy of itself' style, Y arranges for it to be applied to itself again and again as the computation unfolds, manufacturing the self-application recursion needs with no names anywhere. Underneath, Y computes a fixed point — a value a function leaves unchanged — because a recursive definition is really an equation whose solution is a function equal to its own unrolling. That's the deep reason it works: recursion is a fixed-point problem, and the Y combinator is the universal tool that solves it.",
        explanation:
          "Full credit: explains nameless functions can't self-reference, the fix of passing the function to itself, what the Y combinator automates, and the fixed-point idea underneath.",
      },
      {
        topicSlug: "lambda-equals-turing",
        prompt:
          "Explain the equivalence between the lambda calculus and Turing machines. Cover how different the two models look, what equal power means, the Church–Turing thesis, and the limit the halting problem reveals. (4–6 sentences.)",
        correctAnswer:
          "A Turing machine is pure mechanism — a tape, a head, states and rewrite rules — while the lambda calculus is pure mathematics, functions and substitution with no machine at all, so they look nothing alike. Yet each can perfectly simulate the other, meaning they have exactly the same power: anything one can compute, so can the other. The Church–Turing thesis generalizes this, claiming that any effective procedure whatsoever can be carried out by these models, so 'computable' just means expressible in the lambda calculus (equivalently runnable on a Turing machine) — a claim about the meaning of computation that no more powerful model has ever overturned. This also reveals a hard limit: because some lambda expressions reduce forever, there's no general way to decide in advance whether an arbitrary computation halts. That halting problem is genuinely unsolvable for every computer, so the theory that shows what computation *can* do also draws the line on what it never can.",
        explanation:
          "Full credit: contrasts the two models, explains equal power via mutual simulation, states the Church–Turing thesis, and notes the halting problem as an absolute limit.",
      },
      {
        topicSlug: "lambda-to-real-languages",
        prompt:
          "Pull the course together: explain how the lambda calculus grew into the real programming languages we use. Name several pieces built across the course and give concrete examples of its influence. (4–6 sentences.)",
        correctAnswer:
          "Across the course we built computation from almost nothing: functions as the only material, beta reduction as how they compute, the care variables demand, Church numerals for data, choosers for logic, the Y combinator for recursion, and the Church–Turing equivalence proving that's all of computation. Real languages are essentially this core with conveniences layered on: names let you avoid passing a function to itself, loops package recursion, and built-in numbers, booleans, and types replace the Church encodings with fast native versions — sugar over substitution, not new power. You can trace a direct line to Lisp, ML, and Haskell, and the 'first-class functions' style now appears in Python, JavaScript, Java, and most modern languages through lambdas, map/filter, and immutable data. The lasting takeaway is a way of thinking — a program is a transformation of inputs through functions, favoring composition over tangled mutable state — which is why so much current software is shaped the way it is.",
        explanation:
          "Full credit: names several course pieces, frames real languages as the lambda calculus plus conveniences (names/loops/native data as sugar), gives concrete descendants/influences, and notes the functional way of thinking.",
      },
    ],
  },
  {
    kind: "final",
    title: "Final — Baby Lambda Calculus: Everything Is a Function",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 45,
    instructions:
      "Timed cumulative final. 45 minutes. Covers the whole course (sections 1.1–1.8). Answer each question in a paragraph (about 5–7 sentences) in your own words. No formal derivations are required. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      {
        topicSlug: "lambda-to-real-languages",
        prompt:
          "Using ideas from across the whole course, trace how the lambda calculus builds the full power of computation starting from almost nothing. Show how at least four different ideas fit together (for example: functions, beta reduction, bound-and-free, Church numerals, booleans, the Y combinator, the Church–Turing equivalence). (5–7 sentences.)",
        correctAnswer:
          "It starts with the barest possible material: functions, built from just variables, abstraction, and application, with nothing else given. Beta reduction then supplies computation — repeatedly substituting arguments into function bodies until the expression can't be simplified further — while the discipline of bound versus free variables, with alpha renaming, keeps that substitution from silently corrupting meaning through variable capture. From there, encoding shows the material is enough: Church numerals build numbers as repeated application, and choosers build booleans (TRUE picks the first option, FALSE the second), giving arithmetic, logic, and if-then-else with no new features. The Y combinator adds the last missing capability, unlimited recursion, by passing a function to itself to reach a fixed point, so loops and endless processes become expressible. Finally the Church–Turing equivalence proves the payoff: this tiny system has exactly the same power as a Turing machine, meaning it can compute anything any computer can. Put together, the course takes 'only functions' and reaches all of computation, each idea handing the next its starting point.",
        explanation:
          "Full credit: traces a coherent path through at least four ideas (e.g. functions → beta reduction → bound/free → Church numerals/booleans → Y combinator → Church–Turing), correctly describing each one's role and how they connect.",
      },
      {
        topicSlug: "application-and-substitution",
        prompt:
          "Someone says, 'Beta reduction is trivial — it's just find-and-replace; there's nothing to understand.' Using the course's ideas, argue why substitution is a real and subtle skill, using a concrete example where doing it carelessly goes wrong. (5–7 sentences.)",
        correctAnswer:
          "Beta reduction looks like find-and-replace — substitute the argument for the parameter — but the subtlety is in *which* names you're allowed to touch. The trap is variable capture: a function's bound variable is a local placeholder, while a free variable refers to something outside, and naively replacing names can cause an incoming free variable to be wrongly caught by a same-named bound one. For example, substituting a free y into λy. (x y) in place of x would naively give λy. (y y), in which the y brought in from outside has been captured by the function's own bound y, changing the meaning entirely. The fix is alpha renaming: because a bound variable's name is arbitrary, you first rename it — say λz. (x z) — and then the substitution safely gives λz. (y z) with no collision. So substitution is not blind text replacement; it requires recognizing bound versus free and renaming when needed. Get that wrong and the rewrite silently produces a wrong answer, which is exactly why it's a genuine skill rather than mechanical find-and-replace.",
        explanation:
          "Full credit: explains beta reduction is substitution but not blind text replacement, gives a concrete variable-capture example, and shows alpha renaming as the fix, concluding substitution is a real skill.",
      },
      {
        topicSlug: "church-numerals",
        prompt:
          "A friend insists, 'You obviously can't build numbers out of functions — numbers have to be a basic, given thing.' Using the course's ideas about Church numerals, explain why this confident intuition is wrong. Use a concrete example. (5–7 sentences.)",
        correctAnswer:
          "The intuition feels safe but the lambda calculus shows numbers needn't be primitive at all — they can be constructed from functions. The key idea is to represent a number as *how many times a function is applied*, so the number becomes an amount of repetition rather than a symbol. Concretely, a Church numeral takes a function f and a value x: zero applies f no times and just returns x (λf. λx. x), one applies f once (λf. λx. f x), and three applies it three times, f (f (f x)). Arithmetic then becomes manipulating repetition — the successor wraps one more f around a numeral, and addition does the first amount of repeating followed by the second — so ordinary counting and adding fall out with no number line anywhere. This works because functions are first-class and can be stacked and composed freely. The deeper lesson is that data can be encoded as behavior, so the thing the friend assumed had to be 'given' turns out to be buildable from something simpler.",
        explanation:
          "Full credit: explains a number is encoded as the count of function applications, gives a concrete example (e.g. zero returns x, three applies f three times), describes arithmetic as manipulating repetition, and notes 'data as behavior.'",
      },
      {
        topicSlug: "y-combinator",
        prompt:
          "A programmer says, 'Recursion is impossible without a way for a function to refer to itself by name — and lambda functions have no names, so the lambda calculus simply can't do recursion.' Using the course's ideas, explain why they're wrong and how recursion is actually achieved. Use a concrete example. (5–7 sentences.)",
        correctAnswer:
          "The programmer is right that lambda functions are anonymous and can't call themselves by name, but wrong that this blocks recursion. The way around it is to *pass the function itself in as an argument*, so it reaches its 'self' through ordinary application instead of a name. Consider factorial: written normally it says 'factorial of n is n times factorial of n−1,' which needs the name factorial — so instead you write a version whose first input is 'a copy of itself to call,' and then arrange to hand it that copy. The Y combinator automates exactly this, taking such a self-expecting function and applying it to itself repeatedly as the computation unfolds, manufacturing the recursion with no names anywhere. Underneath, Y computes a fixed point — a function equal to its own unrolling — which is the precise sense in which the recursive equation is solved. So recursion is achieved not through self-naming but through self-application, and the Y combinator is the universal tool that makes it work.",
        explanation:
          "Full credit: concedes lambda functions are nameless, explains the 'pass yourself to yourself' fix with a concrete example (e.g. factorial), describes what the Y combinator automates, and the fixed-point idea.",
      },
      {
        topicSlug: "lambda-equals-turing",
        prompt:
          "A friend says, 'The lambda calculus is so tiny it must be far weaker than a real computer, and surely a clever enough program could detect every infinite loop.' Using the course's ideas about the Church–Turing equivalence and the halting problem, explain why both claims are wrong. Use a concrete example. (5–7 sentences.)",
        correctAnswer:
          "Both claims underestimate what the tiny system means. Despite having only variables, abstraction, and application, the lambda calculus can perfectly simulate a Turing machine and vice versa, so it has exactly the same power as any computer — your laptop can solve no problem the lambda calculus can't also solve in principle, the difference being only speed and convenience. The Church–Turing thesis captures this: 'computable' just means expressible in the lambda calculus, and no more powerful model has ever been found, so being 'tiny' says nothing about being weak. The same equivalence also reveals a hard limit: because some lambda expressions reduce forever — like (λx. x x)(λx. x x), which rewrites to itself endlessly — there is no general way to decide in advance whether an arbitrary program halts. That halting problem is provably unsolvable for *every* computer, so no clever program can detect all infinite loops. The theory that shows the lambda calculus can do everything computable is the very same theory that draws this absolute line on what it can never do.",
        explanation:
          "Full credit: explains equal power via mutual simulation / Church–Turing thesis (tiny but fully powerful), and the halting problem as a provable limit for all computers (no program can detect all infinite loops), with a concrete example.",
      },
    ],
  },
];

type SeedPrimer = SeedTopic;

const REASONING_PRIMERS: SeedPrimer[] = [
  {
    slug: "reasoning-primer-subject",
    title: "How to reason about lambda-calculus cases",
    weekNumber: 1,
    blurb:
      "Diagnostic primer: applying the course's ideas to concrete situations about functions, reduction, encoding, recursion, and computability.",
    lectureTitle: "Primer: How to reason about lambda-calculus cases",
    body: `# How to reason about lambda-calculus cases

This short primer prepares you for the **Lambda Calculus** diagnostic. That check is *ungraded practice* — it never affects your course grade. It is drawn from the eight topics of this unit and asks you to *apply* what you have learned to a specific situation, not to recite a definition.

## It tests application, not memorization

A diagnostic question gives you a small, concrete scene — a function meeting an argument that needs reducing, a substitution where a name might be captured, a number or boolean encoded as a function, a recursion with no name to call, a claim about what is or isn't computable — and asks what the course's ideas tell you about it. Knowing the words "beta reduction" or "Church numeral" is not enough; the question wants you to recognize *which* idea fits and *why* it matters here.

## What the questions reward

- **Reaching for the right idea** — match the situation to the concept that fits it: functions and application, computation by beta reduction, bound-versus-free care, encoding data as functions, choosers for logic, the Y combinator for recursion, or the Church–Turing equivalence for computability.
- **Using evidence from the scene** — point to the detail that decides it (does a function meet an argument? is a variable bound or free? does this never reach normal form? is a function being passed to itself?), rather than answering from a general impression.
- **Avoiding the lazy guess** — the lambda calculus replaces reflexes like "substitution is just find-and-replace" or "something this small must be weak" with careful reasoning. The best answers resist those reflexes and stay grounded in what the situation actually says.

## How to do this activity well

1. **Read the situation first**, then ask which topic it belongs to.
2. **Find the detail that decides it** — the application step, the bound-or-free variable, the encoding, the self-reference, the limit — that makes one answer better than another.
3. For written items, **give the core idea in a sentence or two** — clear and correct beats long and padded.

Take it as often as you like; the questions are freshly generated every time, and there is no penalty for any answer.`,
  },
  {
    slug: "reasoning-primer-general",
    title: "Core reasoning skills",
    weekNumber: 1,
    blurb:
      "Diagnostic primer: analysis, inference, evaluation, deduction, and induction.",
    lectureTitle: "Primer: Core reasoning skills",
    body: `# Core reasoning skills

This short primer prepares you for the **General Reasoning** diagnostic — an *ungraded* check that tests five genuine reasoning skills. These are the same skills you use to decide what a set of facts really shows, so they matter directly for thinking clearly about the lambda calculus.

## The five skills

- **Analysis** — break an argument into parts: find its **point** (the conclusion), the **reasons** given for it, and any hidden assumption it leans on. Ask: "What is this trying to convince me of, and what does it take for granted?"
- **Inference** — work out what *follows* from what you're told, and how strongly. Tell apart what *must* be true, what is *likely*, and what is only *possible*.
- **Evaluation** — judge how much the reasons actually support the point. Notice when evidence is beside the point, a source isn't trustworthy, or a step doesn't really connect.
- **Deduction** — reasoning where true starting facts *guarantee* the conclusion. If the starting facts are true, the conclusion can't be false. Watch for sneaky forms that only *look* airtight.
- **Induction** — reasoning from a few examples to a *probable* general rule or prediction. Strong induction uses many fair examples; weak induction over-generalizes from too few.

## A recurring trap: things that move together

Most wrong answers are statements that *sound* reasonable but are **not actually backed up by what you were told**. The discipline this check rewards is the same one careful formal thinking demands: keep apart what the facts **show**, what you're **assuming**, and what only *sounds* right. Two things happening together does not prove one causes the other.

## How to do this activity well

1. Find the **point** (conclusion) first, then the reasons.
2. Ask which of the five skills the question is testing (a hidden-assumption question is analysis; a "what follows" question is inference or deduction; a "how good is this reasoning" question is evaluation).
3. Pick the option that follows **only** from what you were given — not the one that merely sounds true or appealing.

Take it as often as you like; the questions are freshly generated every time, and it never affects your grade.`,
  },
];

// Insert any teaching-to-the-test primer lectures whose slug is not yet present.
// Safe to run on every boot: it only adds what is missing.
export async function seedReasoningPrimersIfMissing(): Promise<void> {
  const currentSlugs = REASONING_PRIMERS.map((p) => p.slug);
  // Remove any obsolete primer topics from earlier diagnostic models (their
  // lectures cascade-delete), so renamed/retired primers self-heal instead of
  // stranding stale content in existing or republished databases.
  const stale = await db
    .delete(topicsTable)
    .where(
      and(
        like(topicsTable.slug, "reasoning-primer-%"),
        notInArray(topicsTable.slug, currentSlugs),
      ),
    )
    .returning({ slug: topicsTable.slug });
  if (stale.length > 0) {
    logger.info(
      { removed: stale.map((s) => s.slug) },
      "Reasoning primers: removed obsolete primers",
    );
  }
  let added = 0;
  for (let i = 0; i < REASONING_PRIMERS.length; i++) {
    const t = REASONING_PRIMERS[i]!;
    const existing = await db
      .select({ id: topicsTable.id })
      .from(topicsTable)
      .where(eq(topicsTable.slug, t.slug));
    if (existing.length > 0) continue;
    const [inserted] = await db
      .insert(topicsTable)
      .values({
        slug: t.slug,
        title: t.title,
        weekNumber: t.weekNumber,
        blurb: t.blurb,
        position: 900 + i,
      })
      .returning();
    if (!inserted) throw new Error(`Failed to insert primer ${t.slug}`);
    await db.insert(lecturesTable).values({
      topicId: inserted.id,
      weekNumber: t.weekNumber,
      title: t.lectureTitle,
      body: t.body,
    });
    added += 1;
  }
  if (added > 0) {
    logger.info({ added }, "Reasoning primers seeded");
  } else {
    logger.info("Reasoning primers: already present, skipping");
  }
}

export async function seedIfEmpty(): Promise<void> {
  // The course was migrated to the Baby Lambda Calculus syllabus. Detect the
  // marker topic; if present and the content version matches, the content is
  // current and we skip. This makes the seed self-healing across environments: a
  // database that still holds older content (e.g. a previous curriculum) is
  // detected and replaced on boot.
  const markerTopic = await db
    .select({ id: topicsTable.id })
    .from(topicsTable)
    .where(eq(topicsTable.slug, "what-lambda-calculus-is"));
  // Read the stored content version. Tolerate the seed_meta table not yet
  // existing (e.g. a boot that races ahead of schema migration): treat that as
  // "no version recorded", which forces a reseed once the table is present.
  let currentVersion: string | null = null;
  try {
    const storedVersion = await db
      .select({ value: seedMetaTable.value })
      .from(seedMetaTable)
      .where(eq(seedMetaTable.key, "content_version"));
    currentVersion = storedVersion[0]?.value ?? null;
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "Seed: seed_meta unavailable, treating version as unset");
    currentVersion = null;
  }
  if (markerTopic.length > 0 && currentVersion === SEED_CONTENT_VERSION) {
    logger.info("Seed: course content present and current, skipping");
    return;
  }
  if (markerTopic.length > 0) {
    logger.warn(
      { storedVersion: currentVersion, expected: SEED_CONTENT_VERSION },
      "Seed: course content present but out of date — re-seeding with the current curriculum",
    );
  }

  // No current content. Either the database is empty (fresh) or it still holds
  // an older curriculum. Do the (optional) wipe and the full reseed in a SINGLE
  // transaction so the marker topic only ever becomes visible once the entire
  // curriculum has committed. A crash mid-seed rolls back, so the next boot
  // retries instead of leaving partial content that the marker check would
  // wrongly treat as healthy. TRUNCATE also takes an ACCESS EXCLUSIVE lock, so
  // concurrent readers never observe a half-empty course during the replace
  // window. The diagnostic tables are truncated here too so the (non
  // version-gated) diagnostic seed repopulates them with the current content on
  // the same boot.
  await db.transaction(async (tx) => {
    const existing = await tx.execute(sql`select count(*)::int as n from topics`);
    const row = (existing.rows[0] ?? {}) as { n?: number };
    if ((row.n ?? 0) > 0) {
      logger.warn(
        "Seed: stale course content detected — replacing with the Baby Lambda Calculus curriculum",
      );
      await tx.execute(
        sql`TRUNCATE TABLE answers, attempts, practice_attempts, practice_problems, practice_sessions, problems, assignments, lectures, topics, diagnostic_responses, diagnostic_attempts, diagnostic_items, diagnostic_assessments RESTART IDENTITY CASCADE`,
      );
    } else {
      logger.info("Seed: populating course content");
    }

    // Topics + lectures
    const slugToTopicId = new Map<string, number>();
    for (let i = 0; i < TOPICS.length; i++) {
      const t = TOPICS[i]!;
      const [inserted] = await tx
        .insert(topicsTable)
        .values({
          slug: t.slug,
          title: t.title,
          weekNumber: t.weekNumber,
          blurb: t.blurb,
          position: i,
        })
        .returning();
      if (!inserted) throw new Error(`Failed to insert topic ${t.slug}`);
      slugToTopicId.set(t.slug, inserted.id);
      await tx.insert(lecturesTable).values({
        topicId: inserted.id,
        weekNumber: t.weekNumber,
        title: t.lectureTitle,
        body: t.body,
      });
    }

    // Assignments + problems
    for (let i = 0; i < ASSIGNMENTS.length; i++) {
      const a = ASSIGNMENTS[i]!;
      const [inserted] = await tx
        .insert(assignmentsTable)
        .values({
          kind: a.kind,
          title: a.title,
          weekNumber: a.weekNumber,
          position: i,
          isTimed: a.isTimed,
          timeLimitMinutes: a.timeLimitMinutes,
          instructions: a.instructions,
        })
        .returning();
      if (!inserted) throw new Error(`Failed to insert assignment ${a.title}`);
      for (let p = 0; p < a.problems.length; p++) {
        const prob = a.problems[p]!;
        const topicId = slugToTopicId.get(prob.topicSlug);
        if (!topicId) throw new Error(`Unknown topic slug ${prob.topicSlug}`);
        await tx.insert(problemsTable).values({
          assignmentId: inserted.id,
          topicId,
          position: p,
          prompt: prob.prompt,
          correctAnswer: prob.correctAnswer,
          explanation: prob.explanation,
          hint: prob.hint ?? null,
        });
      }
    }

    // Stamp the content version last, inside the same transaction, so the
    // marker check on the next boot only treats the course as "current" once
    // the entire curriculum has committed.
    await tx
      .insert(seedMetaTable)
      .values({ key: "content_version", value: SEED_CONTENT_VERSION })
      .onConflictDoUpdate({
        target: seedMetaTable.key,
        set: { value: SEED_CONTENT_VERSION, updatedAt: new Date() },
      });
  });

  logger.info(
    { topics: TOPICS.length, assignments: ASSIGNMENTS.length, version: SEED_CONTENT_VERSION },
    "Seed complete",
  );
}
