"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WidgetFrame, Tag } from "./shared";

const SEED_OUTPUTS = [
  "perched in a cave",
  "warming its breath",
  "watching the sun",
  "humming softly",
  "ready to fly",
];

export function IntroWidget({ onComplete }: { onComplete: () => void }) {
  const [prompt, setPrompt] = useState("Once upon a time, a small dragon");
  const [steps, setSteps] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  async function generate() {
    setRunning(true);
    setSteps([]);
    const tail =
      SEED_OUTPUTS[Math.floor(Math.random() * SEED_OUTPUTS.length)].split(" ");
    for (let i = 0; i < tail.length; i++) {
      await new Promise((r) => setTimeout(r, 380));
      setSteps((s) => [...s, tail[i]]);
    }
    setRunning(false);
  }

  return (
    <WidgetFrame
      onComplete={onComplete}
      caption="Type something. The model guesses one token, then guesses again, and again."
    >
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
        {/* Input */}
        <div>
          <Tag>prompt</Tag>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="mt-2 w-full rounded-card bg-bg-soft/80 border border-line/60 p-4 text-ink font-sans text-sm focus:border-ember/60 outline-none resize-none"
          />
        </div>

        {/* Black box */}
        <div className="flex flex-col items-center">
          <motion.div
            animate={{
              boxShadow: running
                ? [
                    "0 0 0 0 rgba(255,138,60,0.5)",
                    "0 0 30px 8px rgba(255,138,60,0.4)",
                    "0 0 0 0 rgba(255,138,60,0.5)",
                  ]
                : "0 0 0 0 rgba(255,138,60,0)",
            }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="w-32 h-32 rounded-card border-2 border-ember/40 bg-gradient-to-br from-bg-elev to-bg-soft flex items-center justify-center font-mono text-xs text-ember-soft text-center px-3"
          >
            GPT
            <br />
            (the box)
          </motion.div>
          <button
            onClick={generate}
            disabled={running}
            className="mt-4 rounded-pill bg-ember text-bg px-4 py-1.5 text-sm font-medium hover:bg-ember-soft disabled:opacity-50"
          >
            {running ? "predicting…" : "predict next ↓"}
          </button>
        </div>

        {/* Output */}
        <div>
          <Tag>output (one token at a time)</Tag>
          <div className="mt-2 rounded-card bg-bg-soft/80 border border-line/60 p-4 min-h-[112px] text-sm">
            <span className="text-ink-mute">{prompt}</span>{" "}
            <AnimatePresence>
              {steps.map((s, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-ember"
                >
                  {s}{" "}
                </motion.span>
              ))}
            </AnimatePresence>
            {running && (
              <span className="inline-block w-2 h-4 align-middle bg-ember/60 animate-pulse" />
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-ink-mute leading-relaxed">
        That's it. That's a GPT. It eats a sequence of tokens, returns a
        probability for what the next token should be, you pick one, and you
        feed the whole thing back in. Looped, that's the entire thing.
      </div>
    </WidgetFrame>
  );
}
