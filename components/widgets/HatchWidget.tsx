"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WidgetFrame, Tag } from "./shared";
import { Mascot } from "@/components/game/Mascot";

type Phase = "idle" | "warmup" | "training" | "generating" | "done";

const STORY_CHUNKS = [
  "soared",
  " above",
  " the",
  " quiet",
  " forest,",
  " its",
  " wings",
  " catching",
  " the",
  " first",
  " light",
  " of",
  " morning.",
];

export function HatchWidget({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState<string[]>([]);

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | null = null;
    if (phase === "warmup") {
      setProgress(0);
      id = setInterval(() => {
        setProgress((p) => {
          if (p >= 1) {
            clearInterval(id!);
            setPhase("training");
            return 1;
          }
          return p + 0.04;
        });
      }, 60);
    } else if (phase === "training") {
      setProgress(0);
      id = setInterval(() => {
        setProgress((p) => {
          if (p >= 1) {
            clearInterval(id!);
            setPhase("generating");
            return 1;
          }
          return p + 0.013;
        });
      }, 50);
    } else if (phase === "generating") {
      setOutput([]);
      let i = 0;
      id = setInterval(() => {
        if (i >= STORY_CHUNKS.length) {
          clearInterval(id!);
          setPhase("done");
          return;
        }
        setOutput((o) => [...o, STORY_CHUNKS[i]]);
        i++;
      }, 230);
    }
    return () => {
      if (id) clearInterval(id);
    };
  }, [phase]);

  function start() {
    setOutput([]);
    setPhase("warmup");
  }

  return (
    <WidgetFrame
      onComplete={onComplete}
      caption="The final boss. Train, then prompt. Watch your hatchling soar."
      unlocked={phase === "done"}
      cta={phase === "done" ? "Mark complete · soar" : "Run the model first"}
    >
      <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
        {/* Mascot stage by phase */}
        <div className="flex flex-col items-center gap-3">
          <Mascot
            stage={
              phase === "idle"
                ? "fledge"
                : phase === "done"
                ? "soar"
                : "fledge"
            }
            size={200}
          />
          <div className="text-xs font-mono text-ink-dim">
            {phase === "idle" && "ready"}
            {phase === "warmup" && "warming up..."}
            {phase === "training" && "training..."}
            {phase === "generating" && "generating..."}
            {phase === "done" && "soaring."}
          </div>
        </div>

        <div className="space-y-4 w-full">
          {/* Steps */}
          <PhaseStep
            label="Warm up the optimizer"
            active={phase === "warmup"}
            done={
              phase === "training" ||
              phase === "generating" ||
              phase === "done"
            }
            progress={
              phase === "warmup"
                ? progress
                : ["training", "generating", "done"].includes(phase)
                ? 1
                : 0
            }
          />
          <PhaseStep
            label="Train for 1,000 steps"
            active={phase === "training"}
            done={phase === "generating" || phase === "done"}
            progress={
              phase === "training"
                ? progress
                : ["generating", "done"].includes(phase)
                ? 1
                : 0
            }
          />
          <PhaseStep
            label="Generate from prompt"
            active={phase === "generating"}
            done={phase === "done"}
            progress={
              phase === "generating"
                ? Math.min(1, output.length / STORY_CHUNKS.length)
                : phase === "done"
                ? 1
                : 0
            }
          />

          <div>
            <Tag>prompt</Tag>
            <div className="mt-2 rounded-card bg-bg-soft/80 border border-line/60 p-3 font-mono text-sm">
              <span className="text-ink-mute">
                "Once upon a time, a small dragon"
              </span>
              <AnimatePresence>
                {output.map((t, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-ember"
                  >
                    {t}
                  </motion.span>
                ))}
              </AnimatePresence>
              {phase === "generating" && (
                <span className="inline-block w-2 h-4 align-middle bg-ember/60 animate-pulse ml-0.5" />
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={start}
              disabled={phase !== "idle" && phase !== "done"}
              className="rounded-pill bg-ember text-bg px-5 py-2 text-sm font-medium hover:bg-ember-soft disabled:opacity-50"
            >
              {phase === "idle"
                ? "hatch the dragon ↑"
                : phase === "done"
                ? "run again"
                : "running…"}
            </motion.button>
          </div>

          {phase === "done" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-card border border-mint/40 bg-mint/5 p-4 text-sm"
            >
              <span className="text-mint font-mono uppercase tracking-[0.18em] text-[10px]">
                ✓ complete
              </span>
              <p className="text-ink mt-2">
                You built a tokenizer, embeddings, positional info, attention,
                MLPs, blocks, training, and inference. You didn't read about a
                GPT — you trained one.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </WidgetFrame>
  );
}

function PhaseStep({
  label,
  active,
  done,
  progress,
}: {
  label: string;
  active: boolean;
  done: boolean;
  progress: number;
}) {
  return (
    <div
      className={`rounded-card border px-4 py-3 transition ${
        active
          ? "border-ember bg-ember/5"
          : done
          ? "border-mint/40 bg-mint/5"
          : "border-line/40 bg-bg-soft/40"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs ${
            done
              ? "bg-mint/20 text-mint"
              : active
              ? "bg-ember text-bg"
              : "bg-bg-elev text-ink-dim"
          }`}
        >
          {done ? "✓" : active ? "•" : ""}
        </div>
        <div className="font-display text-ink flex-1">{label}</div>
        <div className="text-xs font-mono text-ink-dim">
          {(progress * 100).toFixed(0)}%
        </div>
      </div>
      <div className="mt-2 h-1 rounded-full bg-bg-elev overflow-hidden">
        <motion.div
          animate={{ width: `${progress * 100}%` }}
          className={`h-full ${
            done ? "bg-mint" : active ? "bg-ember" : "bg-line"
          }`}
        />
      </div>
    </div>
  );
}
