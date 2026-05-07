/**
 * Pulls together a quiz pool from the chapter challenges + extras.
 * Used by daily challenge and boss-rush modes.
 */

import { CHALLENGES, MCQQuestion } from "./challenges";

export type QuizQuestion = MCQQuestion & {
  chapterId: number;
  chapterTitle: string;
};

const EXTRA_QUESTIONS: QuizQuestion[] = [
  // Ch 0 — what is a GPT
  {
    chapterId: 0,
    chapterTitle: "What is a GPT?",
    prompt: "the cat sat on the ___",
    options: ["mat", "Mongolia", "synthesizer", "credit"],
    correctIdx: 0,
    rationale:
      "Models love high-frequency continuations. 'mat' is overwhelmingly likely from training data.",
  },
  {
    chapterId: 0,
    chapterTitle: "What is a GPT?",
    prompt: "I'd like a cup of ___",
    options: ["staircase", "Tuesday", "tea", "regret"],
    correctIdx: 2,
    rationale: "Common phrasing wins.",
  },
  {
    chapterId: 0,
    chapterTitle: "What is a GPT?",
    prompt: "Once upon a ___",
    options: ["time", "duck", "spreadsheet", "PR review"],
    correctIdx: 0,
    rationale: "Almost a single token in spirit.",
  },
  // Ch 4 — positional encoding
  {
    chapterId: 4,
    chapterTitle: "Positional encoding",
    prompt:
      "If we strip positional info, which two sentences look identical to the model?",
    options: [
      "'dog bites man' vs 'man bites dog'",
      "'hello' vs 'goodbye'",
      "'cat' vs 'CAT'",
      "'1+1' vs '2+2'",
    ],
    correctIdx: 0,
    rationale:
      "Without position the model just sees a bag of tokens.",
  },
  {
    chapterId: 4,
    chapterTitle: "Positional encoding",
    prompt: "RoPE encodes position by…",
    options: [
      "Adding a position vector",
      "Rotating each token's vector by an angle that depends on its position",
      "Sorting tokens alphabetically",
      "A separate sub-network",
    ],
    correctIdx: 1,
    rationale: "RoPE is a rotation. Geometry, not a separate signal.",
  },
  // Ch 7 — full GPT
  {
    chapterId: 7,
    chapterTitle: "Full GPT",
    prompt: "The very first thing that happens to your text:",
    options: ["Tokenized", "Embedded", "Multiplied", "Normalized"],
    correctIdx: 0,
    rationale: "Text → tokens before anything else.",
  },
  {
    chapterId: 7,
    chapterTitle: "Full GPT",
    prompt: "The very last thing before sampling:",
    options: ["Tokenizer", "Softmax over vocab", "Backprop", "RoPE"],
    correctIdx: 1,
    rationale: "Output head → logits → softmax.",
  },
  {
    chapterId: 7,
    chapterTitle: "Full GPT",
    prompt: "If you stack 12 blocks, the residual stream is updated…",
    options: ["Once", "12 times", "24 times", "Never"],
    correctIdx: 2,
    rationale: "Each block writes twice (after attn, after MLP).",
  },
  // Ch 9 — inference
  {
    chapterId: 9,
    chapterTitle: "Inference",
    prompt: "Setting temperature to 0 means…",
    options: [
      "The model freezes",
      "Always pick the single most-likely token",
      "Always sample randomly",
      "Disable the model",
    ],
    correctIdx: 1,
    rationale: "Temperature 0 collapses to argmax.",
  },
  {
    chapterId: 9,
    chapterTitle: "Inference",
    prompt: "Top-p (nucleus) sampling keeps tokens until…",
    options: [
      "Their cumulative probability hits p",
      "There are exactly p tokens",
      "p seconds have passed",
      "The model says stop",
    ],
    correctIdx: 0,
    rationale: "Top-p adapts to the shape of the distribution.",
  },
  {
    chapterId: 9,
    chapterTitle: "Inference",
    prompt: "Higher temperature makes the model…",
    options: ["More cautious", "More chaotic / creative", "Faster", "Smaller"],
    correctIdx: 1,
    rationale: "Temperature flattens softmax — wilder samples.",
  },
  // Ch 10 — capstone
  {
    chapterId: 10,
    chapterTitle: "Capstone",
    prompt: "Tokens are…",
    options: ["Letters", "Sub-word IDs", "Sentences", "Pixels"],
    correctIdx: 1,
  },
  {
    chapterId: 10,
    chapterTitle: "Capstone",
    prompt: "Embeddings turn IDs into…",
    options: ["Other IDs", "Vectors in space", "Sentences", "Random noise"],
    correctIdx: 1,
  },
  {
    chapterId: 10,
    chapterTitle: "Capstone",
    prompt: "Attention is the only place where…",
    options: [
      "Tokens talk to each other",
      "Weights are stored",
      "Position is encoded",
      "We compute loss",
    ],
    correctIdx: 0,
  },
  {
    chapterId: 10,
    chapterTitle: "Capstone",
    prompt: "A 'block' contains…",
    options: [
      "One layer of MLP only",
      "Attention + MLP + residuals",
      "The whole model",
      "Just a tokenizer",
    ],
    correctIdx: 1,
  },
  {
    chapterId: 10,
    chapterTitle: "Capstone",
    prompt: "Generating text is just…",
    options: [
      "One forward pass",
      "Sampling next-token, in a loop",
      "Calling an API",
      "Copy-pasting from training data",
    ],
    correctIdx: 1,
  },
  // Generic extras
  {
    chapterId: 2,
    chapterTitle: "Tokenization",
    prompt: "A 'token' in a modern GPT is most often:",
    options: ["A whole word", "A sub-word chunk", "A single letter", "A sentence"],
    correctIdx: 1,
    rationale:
      "Sub-word tokenization (BPE) gets a great trade-off — common words = one token, rare ones split.",
  },
  {
    chapterId: 3,
    chapterTitle: "Embeddings",
    prompt: "In an embedding space, distance between two tokens roughly means:",
    options: [
      "How often they appear",
      "Their semantic similarity",
      "Their alphabetic order",
      "Their length in characters",
    ],
    correctIdx: 1,
    rationale: "Closeness in vector space ≈ closeness in meaning.",
  },
  {
    chapterId: 5,
    chapterTitle: "Attention",
    prompt: "Causal masking in attention prevents tokens from:",
    options: [
      "Looking at themselves",
      "Looking at future tokens",
      "Being trained",
      "Being normalized",
    ],
    correctIdx: 1,
    rationale: "Decoder-only LMs can't peek at the answer they're trying to predict.",
  },
  {
    chapterId: 6,
    chapterTitle: "Transformer block",
    prompt: "The residual stream is what flows…",
    options: [
      "Only into attention",
      "Through every block, accumulating",
      "Only at the end",
      "Backwards in time",
    ],
    correctIdx: 1,
    rationale:
      "Each block reads from the residual stream and writes back additively. It's the model's bus.",
  },
  {
    chapterId: 8,
    chapterTitle: "Training",
    prompt: "Cross-entropy loss is small when:",
    options: [
      "The model assigns high probability to the correct next token",
      "The model is uncertain",
      "The dataset is small",
      "The vocabulary is small",
    ],
    correctIdx: 0,
    rationale: "Loss = -log p(correct). Confident + correct = tiny loss.",
  },
];

export function buildQuizPool(): QuizQuestion[] {
  const pool: QuizQuestion[] = [...EXTRA_QUESTIONS];
  for (const c of CHALLENGES) {
    if (c.kind === "loss-curve") {
      for (const r of c.rounds) {
        pool.push({
          chapterId: c.chapterId,
          chapterTitle: "Training",
          prompt: r.question,
          options: r.options,
          correctIdx: r.correctIdx,
          rationale: "Reading the curve diagnoses the cause.",
        });
      }
    }
  }
  return pool;
}

function chapterTitleFor(id: number): string {
  // Avoid importing chapters here to keep the pool standalone.
  const map: Record<number, string> = {
    0: "What is a GPT?",
    1: "Architecture",
    2: "Tokenization",
    3: "Embeddings",
    4: "Positional encoding",
    5: "Attention",
    6: "Transformer block",
    7: "Full GPT",
    8: "Training",
    9: "Inference",
    10: "Hatch it",
  };
  return map[id] ?? "Unknown";
}

/** Mulberry32 PRNG — small, fast, deterministic from a seed. */
export function rng(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickQuestions(
  n: number,
  seed: number,
  pool?: QuizQuestion[]
): QuizQuestion[] {
  const all = pool ?? buildQuizPool();
  const rand = rng(seed);
  const arr = [...all];
  // Fisher-Yates with seeded RNG
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(n, arr.length));
}

export function dailySeed(date = new Date()): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}
