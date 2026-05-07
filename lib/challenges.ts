/**
 * Per-chapter challenges. Each chapter has its OWN game mechanic so the path
 * doesn't feel like a quiz with skins. Daily/Boss-rush use the quizPool, which
 * still draws from MCQ-style questions — but the chapter UIs are varied.
 *
 * Scoring contract for every kind:
 *   3 stars: perfect first try
 *   2 stars: 1 mistake / partial credit
 *   1 star: completed with multiple mistakes / minimum bar
 */

export type MCQQuestion = {
  prompt: string;
  options: string[];
  correctIdx: number;
  rationale?: string;
};

/* Reused mini-stage types so the gauntlet can compose earlier mechanics. */
export type SplitMini = {
  kind: "split";
  sentence: string;
  correctSplits: number[];
};
export type ImposterMini = {
  kind: "imposter";
  words: string[];
  imposterIdx: number;
  theme: string;
};
export type AttentionMini = {
  kind: "attention";
  sentence: string;
  pronounIdx: number;
  targetIdx: number;
};
export type LossMini = {
  kind: "loss";
  curve: "good" | "diverging" | "stuck" | "noisy";
  question: string;
  options: string[];
  correctIdx: number;
};
export type GauntletStage = SplitMini | ImposterMini | AttentionMini | LossMini;

export type Challenge =
  | {
      chapterId: number;
      kind: "build";
      title: string;
      tagline: string;
      starter: string;
      rounds: {
        prompt: string; // shown above the picks
        options: { token: string; agreement: number }[];
      }[];
      reveal: string; // a final epilogue hint
    }
  | {
      chapterId: number;
      kind: "order";
      title: string;
      tagline: string;
      prompt: string;
      items: string[];
      rationale: string;
    }
  | {
      chapterId: number;
      kind: "split";
      title: string;
      tagline: string;
      prompt: string;
      sentence: string;
      correctSplits: number[];
      tolerance?: number;
      rationale: string;
    }
  | {
      chapterId: number;
      kind: "imposter";
      title: string;
      tagline: string;
      rounds: { words: string[]; imposterIdx: number; theme: string }[];
    }
  | {
      chapterId: number;
      kind: "position-puzzle";
      title: string;
      tagline: string;
      prompt: string;
      tokens: string[]; // in correct (final) order
      reveal: string;
    }
  | {
      chapterId: number;
      kind: "attention-target";
      title: string;
      tagline: string;
      rounds: { sentence: string; pronounIdx: number; targetIdx: number }[];
    }
  | {
      chapterId: number;
      kind: "find-gap";
      title: string;
      tagline: string;
      pieces: string[]; // canonical 8-piece architecture in order
      rounds: {
        missingIdx: number;
        options: string[]; // 4, one is the canonical name
        correctIdx: number;
        explanation: string;
      }[];
    }
  | {
      chapterId: number;
      kind: "loss-curve";
      title: string;
      tagline: string;
      rounds: {
        kind: "good" | "diverging" | "stuck" | "noisy";
        question: string;
        options: string[];
        correctIdx: number;
      }[];
    }
  | {
      chapterId: number;
      kind: "temp-match";
      title: string;
      tagline: string;
      buckets: { id: string; label: string; sub: string }[]; // e.g. low/med/high
      samples: { text: string; correctBucketId: string }[];
      rationale: string;
    }
  | {
      chapterId: number;
      kind: "gauntlet";
      title: string;
      tagline: string;
      stages: GauntletStage[];
    };

const ARCHITECTURE_PIECES = [
  "Tokenizer",
  "Embedding",
  "Position",
  "Block × N",
  "Attention",
  "MLP",
  "Final norm",
  "Output head",
];

export const CHALLENGES: Challenge[] = [
  {
    chapterId: 0,
    kind: "build",
    title: "You are the model now",
    tagline:
      "Pick a next token. Then another. Then another. That's all a GPT does.",
    starter: "Once upon a time, a small dragon",
    rounds: [
      {
        prompt: "what verb did the dragon do?",
        options: [
          { token: " soared", agreement: 0.92 },
          { token: " whispered", agreement: 0.55 },
          { token: " buffered", agreement: 0.06 },
          { token: " yodeled", agreement: 0.12 },
        ],
      },
      {
        prompt: "where? high or low?",
        options: [
          { token: " above", agreement: 0.88 },
          { token: " under", agreement: 0.4 },
          { token: " sideways", agreement: 0.18 },
          { token: " adjacent-to", agreement: 0.05 },
        ],
      },
      {
        prompt: "above what kind of place?",
        options: [
          { token: " the forest", agreement: 0.81 },
          { token: " a database", agreement: 0.07 },
          { token: " the meadow", agreement: 0.74 },
          { token: " a kanban", agreement: 0.04 },
        ],
      },
      {
        prompt: "what was the time of day?",
        options: [
          { token: " at dawn", agreement: 0.79 },
          { token: " at standup", agreement: 0.04 },
          { token: " at dusk", agreement: 0.71 },
          { token: " at retro", agreement: 0.05 },
        ],
      },
      {
        prompt: "and what punctuation closes the thought?",
        options: [
          { token: ".", agreement: 0.86 },
          { token: "!", agreement: 0.62 },
          { token: ";", agreement: 0.18 },
          { token: " 🙂", agreement: 0.1 },
        ],
      },
    ],
    reveal:
      "That's the entire model. Each token you picked, GPT does too — by reading every previous token and scoring every candidate.",
  },
  {
    chapterId: 1,
    kind: "order",
    title: "Stack the architecture",
    tagline: "Drag the parts into the order data flows through them.",
    prompt: "From raw text on the left to a predicted token on the right:",
    items: [
      "Tokenizer",
      "Embedding",
      "Position",
      "Block × N",
      "Final norm",
      "Output head",
    ],
    rationale:
      "Text → IDs → vectors → position → blocks → norm → logits.",
  },
  {
    chapterId: 2,
    kind: "split",
    title: "Slice it",
    tagline: "Click between characters where the tokenizer probably splits.",
    prompt: "Place 5 cuts in this sentence:",
    sentence: "Once upon a time a small dragon",
    correctSplits: [4, 9, 11, 16, 18, 24],
    tolerance: 1,
    rationale:
      "Common words become single tokens; spaces and rare strings get their own.",
  },
  {
    chapterId: 3,
    kind: "imposter",
    title: "Spot the imposter",
    tagline: "Four words live close in embedding space. One doesn't belong.",
    rounds: [
      {
        words: ["dragon", "wyvern", "phoenix", "spreadsheet"],
        imposterIdx: 3,
        theme: "mythical creatures",
      },
      {
        words: ["king", "queen", "throne", "yogurt"],
        imposterIdx: 3,
        theme: "royalty",
      },
      {
        words: ["fire", "flame", "ember", "calculator"],
        imposterIdx: 3,
        theme: "fire",
      },
    ],
  },
  {
    chapterId: 4,
    kind: "position-puzzle",
    title: "Without position, just bag-of-tokens",
    tagline:
      "Six tokens, scrambled. Each carries a little sin/cos fingerprint. Drag them back into order.",
    prompt:
      "Without position, all six say the same thing to the model. Reorder by their phase.",
    tokens: ["the", "dragon", "ate", "the", "egg", "today"],
    reveal:
      "Every position carries a unique angle (sin/cos). The model learns to read this geometry as order.",
  },
  {
    chapterId: 5,
    kind: "attention-target",
    title: "What is it looking at?",
    tagline:
      "Click the earlier word the bold pronoun should attend to most strongly.",
    rounds: [
      {
        sentence: "The dragon ate the egg because it was hungry",
        pronounIdx: 7,
        targetIdx: 1,
      },
      {
        sentence: "I poured water into the cup because it was empty",
        pronounIdx: 7,
        targetIdx: 5,
      },
      {
        sentence: "She gave the book to her sister because she liked it",
        pronounIdx: 8,
        targetIdx: 6,
      },
    ],
  },
  {
    chapterId: 6,
    kind: "order",
    title: "Inside one block",
    tagline: "Drag the six steps into the order they happen.",
    prompt: "Each block does these in order:",
    items: [
      "RMSNorm",
      "Self-attention",
      "Add residual",
      "RMSNorm",
      "MLP (SwiGLU)",
      "Add residual",
    ],
    rationale: "Pre-norm sandwiches: norm → mix → add, twice.",
  },
  {
    chapterId: 7,
    kind: "find-gap",
    title: "Plug the gap",
    tagline:
      "An x-rayed architecture is missing one part. Pick what belongs there.",
    pieces: ARCHITECTURE_PIECES,
    rounds: [
      {
        missingIdx: 0,
        options: ["Final norm", "Tokenizer", "Block × N", "Output head"],
        correctIdx: 1,
        explanation:
          "Without the tokenizer, raw text never enters the model. It's the front door.",
      },
      {
        missingIdx: 2,
        options: ["Position", "MLP", "Output head", "Embedding"],
        correctIdx: 0,
        explanation:
          "Without position, the model treats your sentence as a bag of words.",
      },
      {
        missingIdx: 7,
        options: ["Tokenizer", "Position", "Output head", "Embedding"],
        correctIdx: 2,
        explanation:
          "The output head turns the final residual into a probability over the vocabulary.",
      },
    ],
  },
  {
    chapterId: 8,
    kind: "loss-curve",
    title: "Diagnose the curve",
    tagline: "Match each loss curve to what's happening.",
    rounds: [
      {
        kind: "diverging",
        question: "Loss is shooting up over time. Most likely cause:",
        options: [
          "Learning rate too high",
          "Batch size too small",
          "Model is fine, just patience",
          "Vocab too large",
        ],
        correctIdx: 0,
      },
      {
        kind: "stuck",
        question: "Loss is flat and never goes down. Most likely cause:",
        options: [
          "Learning rate too low",
          "Too many parameters",
          "Wrong tokenizer",
          "Wrong color theme",
        ],
        correctIdx: 0,
      },
      {
        kind: "good",
        question: "Loss drops smoothly and plateaus. Verdict:",
        options: ["Diverging", "Healthy training", "Overfitting", "Underfitting"],
        correctIdx: 1,
      },
    ],
  },
  {
    chapterId: 9,
    kind: "temp-match",
    title: "Read the temperature",
    tagline:
      "Three samples. Three temperatures. Match each output to the dial that produced it.",
    buckets: [
      { id: "low", label: "T = 0.2", sub: "low · safe" },
      { id: "med", label: "T = 0.8", sub: "balanced" },
      { id: "high", label: "T = 1.6", sub: "high · chaotic" },
    ],
    samples: [
      {
        text:
          "The dragon flew over the forest. The dragon flew over the forest. The dragon flew over the forest.",
        correctBucketId: "low",
      },
      {
        text:
          "The dragon glided above the misty pines, scanning for the silver river it remembered from yesterday.",
        correctBucketId: "med",
      },
      {
        text:
          "The dragon sneezed into a thesaurus and yodeled at clouds shaped like grandma's filing cabinet.",
        correctBucketId: "high",
      },
    ],
    rationale:
      "Low T collapses to the safest token (boring + repeats). High T flattens the distribution (creative + nonsense). Middle is the sweet spot.",
  },
  {
    chapterId: 10,
    kind: "gauntlet",
    title: "The Hatch",
    tagline: "Four mini-trials, one per concept. No retries, max 4 stars.",
    stages: [
      {
        kind: "split",
        sentence: "the dragon flew",
        correctSplits: [3, 4, 11, 12],
      },
      {
        kind: "imposter",
        words: ["embedding", "vector", "tensor", "umbrella"],
        imposterIdx: 3,
        theme: "ML primitives",
      },
      {
        kind: "attention",
        sentence: "The egg cracked because it was warm",
        pronounIdx: 5,
        targetIdx: 1,
      },
      {
        kind: "loss",
        curve: "diverging",
        question:
          "Loss is climbing. What do you do?",
        options: [
          "Lower the learning rate",
          "Add more layers",
          "Train longer",
          "Switch tokenizers",
        ],
        correctIdx: 0,
      },
    ],
  },
];

export function challengeFor(chapterId: number) {
  return CHALLENGES.find((c) => c.chapterId === chapterId);
}
