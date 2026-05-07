"use client";

import { useEffect, useState } from "react";
import { motion, Reorder } from "framer-motion";
import { ChallengeShell, ResultBanner } from "./Shell";

type Tile = {
  id: string; // unique
  word: string;
  truePosition: number; // 0..N-1
};

export function PositionPuzzleRunner({
  title,
  tagline,
  prompt,
  tokens,
  reveal,
  onPass,
  onAttempt,
}: {
  title: string;
  tagline: string;
  prompt: string;
  tokens: string[]; // correct order
  reveal: string;
  onPass: (stars: number, perfect: boolean) => void;
  onAttempt: () => void;
}) {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [done, setDone] = useState(false);
  const [tries, setTries] = useState(0);

  useEffect(() => {
    const ids = tokens.map((w, i) => ({
      id: `${w}-${i}`,
      word: w,
      truePosition: i,
    }));
    setTiles(shuffle(ids));
  }, [tokens]);

  function check() {
    setTries((t) => t + 1);
    const correct = tiles.every((t, i) => t.truePosition === i);
    if (correct) {
      setDone(true);
      onAttempt();
    }
  }

  function retry() {
    setTiles(
      shuffle(
        tokens.map((w, i) => ({
          id: `${w}-${i}`,
          word: w,
          truePosition: i,
        }))
      )
    );
    setTries(0);
    setDone(false);
  }

  const stars = tries <= 1 ? 3 : tries === 2 ? 2 : 1;
  const perfect = tries <= 1;
  const correct = tiles.every((t, i) => t.truePosition === i);

  // RoPE-like phase: theta = position / 10000^0
  const phase = (pos: number) => (pos / Math.max(tokens.length - 1, 1)) * Math.PI * 1.6;

  return (
    <ChallengeShell
      title={title}
      tagline={tagline}
      progressLabel={tries > 0 ? `tries: ${tries}` : "drag to reorder"}
      stars={done ? stars : 0}
      done={done}
    >
      {!done ? (
        <div>
          <p className="text-sm text-ink-mute mb-4">{prompt}</p>

          <Reorder.Group
            axis="x"
            values={tiles}
            onReorder={setTiles}
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${tokens.length}, minmax(0, 1fr))`,
            }}
          >
            {tiles.map((t) => {
              const ph = phase(t.truePosition);
              return (
                <Reorder.Item
                  key={t.id}
                  value={t}
                  whileDrag={{ scale: 1.06, zIndex: 5 }}
                  className="cursor-grab active:cursor-grabbing rounded-card border-2 border-line/60 bg-bg-elev/80 p-3 hover:border-ember/40"
                >
                  <PhaseDial phase={ph} />
                  <div className="font-mono text-sm text-center text-ink mt-2 truncate">
                    {t.word}
                  </div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>

          <div className="mt-5 grid grid-cols-[1fr_auto] gap-3 items-center text-xs font-mono">
            <div className="text-ink-dim">
              each tile carries a unique{" "}
              <span className="text-ember">phase angle</span>. lower phase = earlier position.
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={check}
              className="rounded-pill bg-ember text-bg px-5 py-2 text-sm font-medium hover:bg-ember-soft"
            >
              check order →
            </motion.button>
          </div>

          {tries > 0 && !correct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-sm text-rose"
            >
              not quite — at least one tile is in the wrong slot.
            </motion.div>
          )}
        </div>
      ) : (
        <div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-card border border-mint/40 bg-mint/5 p-5 mb-4"
          >
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-mint mb-2">
              reconstructed
            </div>
            <div className="font-serif-display text-xl text-ink">
              {tiles.map((t) => t.word).join(" ")}
            </div>
          </motion.div>
          <ResultBanner
            perfect={perfect}
            stars={stars}
            rationale={reveal}
            onRetry={retry}
            onContinue={() => onPass(stars, perfect)}
          />
        </div>
      )}
    </ChallengeShell>
  );
}

function PhaseDial({ phase }: { phase: number }) {
  const x = Math.cos(phase);
  const y = -Math.sin(phase);
  return (
    <svg viewBox="-1.4 -1.4 2.8 2.8" className="w-12 h-12 mx-auto block">
      <circle
        cx="0"
        cy="0"
        r="1"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="0.06"
      />
      <line
        x1="-1.2"
        x2="1.2"
        y1="0"
        y2="0"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="0.04"
      />
      <line
        y1="-1.2"
        y2="1.2"
        x1="0"
        x2="0"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="0.04"
      />
      <line
        x1="0"
        y1="0"
        x2={x}
        y2={y}
        stroke="#ff8a3c"
        strokeWidth="0.18"
        strokeLinecap="round"
      />
      <circle cx={x} cy={y} r="0.18" fill="#ff8a3c" />
    </svg>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
