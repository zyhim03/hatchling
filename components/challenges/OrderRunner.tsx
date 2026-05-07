"use client";

import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { ChallengeShell, ResultBanner } from "./Shell";

export function OrderRunner({
  title,
  tagline,
  prompt,
  items, // correct order
  rationale,
  onPass,
  onAttempt,
}: {
  title: string;
  tagline: string;
  prompt: string;
  items: string[];
  rationale: string;
  onPass: (stars: number, perfect: boolean) => void;
  onAttempt: () => void;
}) {
  const [order, setOrder] = useState(() => shuffle(items));
  const [done, setDone] = useState(false);
  const [tries, setTries] = useState(0);

  function check() {
    setTries((t) => t + 1);
    const correct = order.every((v, i) => v === items[i]);
    if (correct) {
      setDone(true);
      onAttempt();
    }
  }

  function retry() {
    setOrder(shuffle(items));
    setDone(false);
    setTries(0);
  }

  const stars = tries <= 1 ? 3 : tries === 2 ? 2 : 1;
  const perfect = tries <= 1;
  const correct = order.every((v, i) => v === items[i]);

  return (
    <ChallengeShell
      title={title}
      tagline={tagline}
      progressLabel={`tries: ${tries}`}
      stars={done ? stars : 0}
      done={done}
    >
      {!done ? (
        <div>
          <div className="text-sm text-ink-mute mb-4">{prompt}</div>
          <Reorder.Group
            axis="y"
            values={order}
            onReorder={setOrder}
            className="space-y-2"
          >
            {order.map((item, idx) => (
              <Reorder.Item
                key={item}
                value={item}
                className="cursor-grab active:cursor-grabbing rounded-card border-2 border-line/60 bg-bg-elev/80 px-4 py-3 flex items-center gap-3 hover:border-ember/40 transition"
                whileDrag={{ scale: 1.03, borderColor: "#ff8a3c" }}
              >
                <div className="w-6 h-6 rounded-full bg-ember/20 text-ember font-mono text-xs flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 font-display text-ink">{item}</div>
                <div className="text-ink-dim text-sm">⋮⋮</div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="text-xs font-mono text-ink-dim">
              drag to reorder · check when ready
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={check}
              className="rounded-pill bg-ember text-bg px-5 py-2 text-sm font-medium hover:bg-ember-soft"
            >
              check answer →
            </motion.button>
          </div>

          {tries > 0 && !correct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-sm text-rose"
            >
              not quite. one or more items are out of place.
            </motion.div>
          )}
        </div>
      ) : (
        <ResultBanner
          perfect={perfect}
          stars={stars}
          rationale={rationale}
          onRetry={retry}
          onContinue={() => onPass(stars, perfect)}
        />
      )}
    </ChallengeShell>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // Make sure it's actually shuffled
  if (a.every((v, i) => v === arr[i]) && arr.length > 1) {
    [a[0], a[1]] = [a[1], a[0]];
  }
  return a;
}
