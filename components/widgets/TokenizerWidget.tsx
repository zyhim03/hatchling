"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { WidgetFrame, Tag } from "./shared";

// Tiny BPE-flavored tokenizer. Not real BPE, but it captures the feel:
// common words/affixes get one chunk, rare ones get split.
const VOCAB = [
  " the",
  " a",
  " an",
  " of",
  " and",
  " is",
  " was",
  " in",
  " to",
  " it",
  " on",
  " at",
  " by",
  " for",
  " with",
  " that",
  " this",
  " but",
  " not",
  " he",
  " she",
  " they",
  " we",
  " you",
  " I",
  " dragon",
  " egg",
  " fire",
  " sky",
  " cave",
  "ing",
  "ed",
  "ly",
  "er",
  "est",
  "tion",
  "ness",
  "ful",
  "less",
  "able",
  "Once",
  "upon",
  "time",
  "small",
  "model",
  "token",
  "language",
  ".",
  ",",
  "!",
  "?",
  ";",
  ":",
];

type Token = { text: string; id: number; kind: "word" | "sub" | "byte" };

function tokenize(text: string): Token[] {
  if (!text) return [];
  const result: Token[] = [];
  let i = 0;
  while (i < text.length) {
    let matched: string | null = null;
    for (const v of VOCAB) {
      if (text.startsWith(v, i)) {
        if (!matched || v.length > matched.length) matched = v;
      }
    }
    if (matched) {
      result.push({
        text: matched,
        id: hashId(matched),
        kind: matched.length > 2 ? "word" : "sub",
      });
      i += matched.length;
    } else {
      result.push({
        text: text[i],
        id: hashId(text[i]),
        kind: "byte",
      });
      i += 1;
    }
  }
  return result;
}

function hashId(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 50257;
}

const KIND_COLOR: Record<Token["kind"], string> = {
  word: "border-ember/60 bg-ember/10 text-ember",
  sub: "border-violet/60 bg-violet/10 text-violet",
  byte: "border-line bg-bg-soft text-ink-mute",
};

const SAMPLES = [
  "Once upon a time, a small dragon",
  "Tokenization is the gateway to language.",
  "Hatchling!",
  "supercalifragilistic",
];

export function TokenizerWidget({ onComplete }: { onComplete: () => void }) {
  const [text, setText] = useState(SAMPLES[0]);
  const tokens = useMemo(() => tokenize(text), [text]);

  return (
    <WidgetFrame
      onComplete={onComplete}
      caption="Common words become single tokens. Rare ones get split. The model only ever sees the IDs."
    >
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Tag>your text</Tag>
            <div className="flex gap-1.5">
              {SAMPLES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setText(s)}
                  className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-dim hover:text-ember transition border border-line/40 rounded-pill px-2 py-0.5"
                >
                  sample {i + 1}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            className="w-full rounded-card bg-bg-soft/80 border border-line/60 p-4 text-ink font-sans text-sm focus:border-ember/60 outline-none resize-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Tag>tokens ({tokens.length})</Tag>
            <div className="flex gap-3 text-[10px] font-mono uppercase tracking-[0.12em] text-ink-dim">
              <Legend cls="bg-ember" label="word" />
              <Legend cls="bg-violet" label="sub" />
              <Legend cls="bg-line" label="byte" />
            </div>
          </div>
          <div className="rounded-card border border-line/60 bg-bg-soft/40 p-4 min-h-[80px] flex flex-wrap gap-1.5">
            {tokens.map((t, i) => (
              <motion.div
                key={`${i}-${t.text}`}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-md border px-2 py-1 text-sm font-mono ${
                  KIND_COLOR[t.kind]
                }`}
                title={`id ${t.id} · ${t.kind}`}
              >
                <span className="whitespace-pre">
                  {t.text === " " ? "·" : t.text.replace(/^ /, "·")}
                </span>
                <span className="ml-1.5 text-[9px] opacity-60">{t.id}</span>
              </motion.div>
            ))}
            {tokens.length === 0 && (
              <span className="text-ink-dim text-sm">
                Type something above…
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Stat label="Tokens" value={`${tokens.length}`} />
          <Stat
            label="Compression"
            value={text ? `${(text.length / Math.max(tokens.length, 1)).toFixed(2)} chars/tok` : "—"}
          />
          <Stat
            label="Vocab size"
            value="50,257"
            sub="GPT-2 default"
          />
        </div>
      </div>
    </WidgetFrame>
  );
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={`w-2 h-2 rounded-sm ${cls}`} />
      {label}
    </span>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-card border border-line/40 bg-bg-soft/40 p-4">
      <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim">
        {label}
      </div>
      <div className="font-display text-xl text-ink mt-1">{value}</div>
      {sub && (
        <div className="text-xs text-ink-dim font-mono mt-0.5">{sub}</div>
      )}
    </div>
  );
}
