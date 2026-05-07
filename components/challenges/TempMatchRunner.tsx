"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChallengeShell, ResultBanner } from "./Shell";

type Bucket = { id: string; label: string; sub: string };
type Sample = { text: string; correctBucketId: string };

export function TempMatchRunner({
  title,
  tagline,
  buckets,
  samples,
  rationale,
  onPass,
  onAttempt,
}: {
  title: string;
  tagline: string;
  buckets: Bucket[];
  samples: Sample[];
  rationale: string;
  onPass: (stars: number, perfect: boolean) => void;
  onAttempt: () => void;
}) {
  // sampleIdx -> bucketId
  const [assignments, setAssignments] = useState<Record<number, string>>({});
  const [done, setDone] = useState(false);
  const [tries, setTries] = useState(0);
  const [activeSample, setActiveSample] = useState<number | null>(null);

  function assign(sampleIdx: number, bucketId: string) {
    setAssignments((a) => ({ ...a, [sampleIdx]: bucketId }));
    setActiveSample(null);
  }

  function check() {
    setTries((t) => t + 1);
    const allCorrect = samples.every(
      (s, i) => assignments[i] === s.correctBucketId
    );
    if (allCorrect) {
      setDone(true);
      onAttempt();
    }
  }

  function retry() {
    setAssignments({});
    setTries(0);
    setDone(false);
    setActiveSample(null);
  }

  const correctCount = samples.filter(
    (s, i) => assignments[i] === s.correctBucketId
  ).length;
  const allAssigned = Object.keys(assignments).length === samples.length;
  const stars = tries <= 1 ? 3 : tries === 2 ? 2 : 1;
  const perfect = tries <= 1;

  return (
    <ChallengeShell
      title={title}
      tagline={tagline}
      progressLabel={`${correctCount} / ${samples.length} matched`}
      stars={done ? stars : 0}
      done={done}
    >
      {!done ? (
        <div>
          <p className="text-sm text-ink-mute mb-5">
            <span className="font-serif-wonky italic text-ember">tap a sample</span>
            , then tap the temperature dial that produced it.
          </p>

          {/* Samples */}
          <div className="space-y-3 mb-6">
            {samples.map((s, i) => {
              const assignedTo = assignments[i];
              const bucket = buckets.find((b) => b.id === assignedTo);
              const isActive = activeSample === i;
              return (
                <motion.button
                  key={i}
                  whileHover={{ y: -1 }}
                  onClick={() => setActiveSample(isActive ? null : i)}
                  className={`w-full text-left rounded-card border-2 p-4 transition relative ${
                    isActive
                      ? "border-ember bg-ember/10"
                      : assignedTo
                      ? "border-mint/40 bg-mint/5"
                      : "border-line/60 bg-bg-elev/60 hover:border-ember/40"
                  }`}
                >
                  <div className="font-serif-display text-base text-ink leading-relaxed">
                    {s.text}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs font-mono">
                    <span className="text-ink-dim">
                      sample {String.fromCharCode(65 + i)}
                    </span>
                    {bucket ? (
                      <span className="text-mint">→ {bucket.label}</span>
                    ) : (
                      <span className="text-ember">
                        {isActive ? "pick a dial below ↓" : "tap to assign"}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Buckets */}
          <div className="grid grid-cols-3 gap-3">
            {buckets.map((b) => {
              const assignedSamples = samples
                .map((_, si) => si)
                .filter((si) => assignments[si] === b.id);
              const isHot = activeSample !== null;
              return (
                <button
                  key={b.id}
                  onClick={() =>
                    activeSample !== null && assign(activeSample, b.id)
                  }
                  disabled={!isHot}
                  className={`rounded-card border-2 p-4 transition text-center ${
                    isHot
                      ? "border-ember/60 bg-ember/5 hover:bg-ember/15 cursor-pointer"
                      : "border-line/40 bg-bg-soft/40 cursor-default"
                  }`}
                >
                  <div className="font-display text-lg text-ember">
                    {b.label}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-dim mt-0.5">
                    {b.sub}
                  </div>
                  <div className="mt-2 min-h-[20px] flex justify-center gap-1">
                    {assignedSamples.map((si) => (
                      <span
                        key={si}
                        className="text-[10px] font-mono rounded bg-mint/20 text-mint px-1.5 py-0.5"
                      >
                        {String.fromCharCode(65 + si)}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <div className="text-xs font-mono text-ink-dim">
              {allAssigned ? "everything assigned" : `${samples.length - Object.keys(assignments).length} unassigned`}
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={check}
              disabled={!allAssigned}
              className="rounded-pill bg-ember text-bg px-5 py-2 text-sm font-medium hover:bg-ember-soft disabled:opacity-40 disabled:cursor-not-allowed"
            >
              check answers →
            </motion.button>
          </div>

          {tries > 0 && correctCount < samples.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-sm text-rose"
            >
              {correctCount} of {samples.length} matched. Reassign and try again.
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
