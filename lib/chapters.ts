export type Stage = "egg" | "crack" | "hatch" | "wing" | "fledge" | "soar";

export type Chapter = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  hook: string;
  concept: string;
  takeaway: string;
  xp: number;
  stage: Stage;
  widget:
    | "intro"
    | "architecture"
    | "tokenizer"
    | "embeddings"
    | "positional"
    | "attention"
    | "block"
    | "fullModel"
    | "training"
    | "inference"
    | "hatch";
  accent: "ember" | "yolk" | "cyan" | "violet" | "mint" | "rose";
};

export const CHAPTERS: Chapter[] = [
  {
    id: 0,
    slug: "what-is-a-gpt",
    title: "What is a GPT?",
    subtitle: "The shape of the beast",
    hook: "Before you build one, you have to see one.",
    concept:
      "A GPT is a function that takes a sequence of tokens and predicts the next one. Repeat that prediction loop and you get text. Everything else is plumbing around that single trick.",
    takeaway: "GPT = next-token guesser, called over and over.",
    xp: 50,
    stage: "egg",
    widget: "intro",
    accent: "ember",
  },
  {
    id: 1,
    slug: "architecture",
    title: "Meet the parts",
    subtitle: "An x-ray of the machine",
    hook: "Eight components. Each one earns a level.",
    concept:
      "A modern decoder-only Transformer is a small, fixed set of moving parts: tokenizer, embeddings, positional info, attention, MLP, residual stream, normalization, and an output head. You'll unlock each one.",
    takeaway: "The model is small. The repetition is what makes it powerful.",
    xp: 50,
    stage: "egg",
    widget: "architecture",
    accent: "violet",
  },
  {
    id: 2,
    slug: "tokenization",
    title: "Words into numbers",
    subtitle: "Tokenization",
    hook: "Models don't read letters. They read IDs.",
    concept:
      "BPE breaks text into sub-word chunks called tokens. Common words get one token; rare words get split. This is the only place language meets math.",
    takeaway: "Text becomes a list of integers. That list is all the model ever sees.",
    xp: 100,
    stage: "crack",
    widget: "tokenizer",
    accent: "ember",
  },
  {
    id: 3,
    slug: "embeddings",
    title: "Numbers into meaning",
    subtitle: "Embedding lookup",
    hook: "Each token becomes a point in space.",
    concept:
      "Every token ID indexes into a learned vector. Similar tokens land near each other in this high-dimensional space. This is where 'meaning' first appears.",
    takeaway: "Tokens are points. Distance is similarity.",
    xp: 100,
    stage: "crack",
    widget: "embeddings",
    accent: "cyan",
  },
  {
    id: 4,
    slug: "positional-encoding",
    title: "Order matters",
    subtitle: "Positional information",
    hook: "Without position, the model can't tell 'dog bites man' from 'man bites dog'.",
    concept:
      "RoPE rotates each token's vector by an angle that depends on its position. Closer positions rotate by similar angles, distant ones by different angles. The model reads geometry as order.",
    takeaway: "Position is encoded as rotation, not as a separate signal.",
    xp: 120,
    stage: "hatch",
    widget: "positional",
    accent: "yolk",
  },
  {
    id: 5,
    slug: "attention",
    title: "Looking at what matters",
    subtitle: "Self-attention",
    hook: "Every token gets to ask: who else here is relevant to me?",
    concept:
      "Attention computes a weight from every token to every previous token. The output for each position is a weighted blend of the others. This is the only place tokens talk to each other.",
    takeaway: "Attention is routing. Tokens pull information from the tokens that matter.",
    xp: 200,
    stage: "wing",
    widget: "attention",
    accent: "ember",
  },
  {
    id: 6,
    slug: "transformer-block",
    title: "Stacking wisdom",
    subtitle: "The Transformer block",
    hook: "Attention + MLP + residual. Repeat N times.",
    concept:
      "One block routes information (attention), then thinks about it (MLP), with a residual stream carrying everything forward. Stack twelve of them and the model has time to reason.",
    takeaway: "Depth gives the model room to plan. Each block refines the residual stream.",
    xp: 150,
    stage: "wing",
    widget: "block",
    accent: "violet",
  },
  {
    id: 7,
    slug: "full-gpt",
    title: "The full beast",
    subtitle: "End-to-end forward pass",
    hook: "Watch a token flow from input to logits.",
    concept:
      "Tokenize → embed → add position → N blocks → final norm → unembed → softmax. That's a forward pass. Everything in this game collapses into that one path.",
    takeaway: "The whole model is a single function you can hold in your head.",
    xp: 150,
    stage: "fledge",
    widget: "fullModel",
    accent: "mint",
  },
  {
    id: 8,
    slug: "training",
    title: "Teaching your model",
    subtitle: "The training loop",
    hook: "Wrong guess → adjust weights → less wrong next time.",
    concept:
      "Cross-entropy loss measures how surprised the model was. Backprop computes how to nudge each weight to be less surprised. AdamW + cosine warmup makes the nudges stable.",
    takeaway: "Training is a long, careful descent down a loss landscape.",
    xp: 200,
    stage: "fledge",
    widget: "training",
    accent: "rose",
  },
  {
    id: 9,
    slug: "inference",
    title: "Ask it anything",
    subtitle: "Sampling and generation",
    hook: "The same forward pass, run in a loop.",
    concept:
      "At inference time you feed the prompt, take the model's distribution over the next token, sample one, append it, and repeat. Temperature, top-k, and top-p shape that sample.",
    takeaway: "Generation is just sampling from a distribution, over and over.",
    xp: 150,
    stage: "soar",
    widget: "inference",
    accent: "cyan",
  },
  {
    id: 10,
    slug: "hatch-it",
    title: "Hatch it",
    subtitle: "Final boss",
    hook: "Run it end-to-end. Watch your model come alive.",
    concept:
      "You've built every piece. Now train a tiny model live, watch the loss curve, then prompt it. The hatchling soars.",
    takeaway: "You don't just understand a GPT. You built one.",
    xp: 300,
    stage: "soar",
    widget: "hatch",
    accent: "ember",
  },
];

export const TOTAL_XP = CHAPTERS.reduce((sum, c) => sum + c.xp, 0);

export function chapterBySlug(slug: string) {
  return CHAPTERS.find((c) => c.slug === slug);
}

export function chapterById(id: number) {
  return CHAPTERS.find((c) => c.id === id);
}

export function nextChapter(id: number) {
  return CHAPTERS.find((c) => c.id === id + 1);
}

export function prevChapter(id: number) {
  return CHAPTERS.find((c) => c.id === id - 1);
}

export const STAGE_LABEL: Record<Stage, string> = {
  egg: "Egg",
  crack: "First crack",
  hatch: "Hatched",
  wing: "Wings forming",
  fledge: "Fledgling",
  soar: "Soaring",
};

export const STAGE_FOR_PROGRESS = (completed: number): Stage => {
  if (completed >= 10) return "soar";
  if (completed >= 8) return "fledge";
  if (completed >= 6) return "wing";
  if (completed >= 4) return "hatch";
  if (completed >= 2) return "crack";
  return "egg";
};
