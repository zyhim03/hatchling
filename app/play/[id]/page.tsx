"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CHAPTERS,
  chapterBySlug,
  nextChapter,
  prevChapter,
  STAGE_FOR_PROGRESS,
} from "@/lib/chapters";
import { challengeFor } from "@/lib/challenges";
import { useProgress } from "@/lib/progress";
import { TopBar } from "@/components/game/TopBar";
import { Mascot } from "@/components/game/Mascot";
import { Button } from "@/components/ui/Button";
import { WidgetFor } from "@/components/widgets";
import { ChallengeFor } from "@/components/challenges";
import { Confetti } from "@/components/game/Confetti";
import { Embers } from "@/components/game/Embers";
import { MascotBubble } from "@/components/game/MascotBubble";
import { Stars } from "@/components/game/Stars";
import { Sparkle } from "@/components/game/Scribble";
import { ChapterScene } from "@/components/scenery/ChapterScene";
import { SageBubble } from "@/components/characters/SageBubble";

const SAGE_LINES: Record<number, string> = {
  0: "every grand thing starts with one small guess. the model just guesses many.",
  1: "eight pieces, friend. fewer than the legs on a spider.",
  2: "letters are weather. tokens are the sky's mood.",
  3: "near in space, near in meaning. far in space, far apart.",
  4: "without order, 'dog bites man' equals 'man bites dog'. position fixes that.",
  5: "attention is the act of listening. your model listens to itself.",
  6: "stack thinking. stack listening. that's a brain in cake form.",
  7: "every part you've met flows in one straight line. you've already built it.",
  8: "training is just being wrong, on purpose, very gently, many times.",
  9: "temperature isn't truth — it's how brave the model is feeling today.",
  10: "you didn't memorize a GPT. you raised one.",
};

const ENCOURAGEMENT = [
  "tap a thing. anything.",
  "you're doing great, btw.",
  "nice. now read the takeaway.",
  "the wings are forming.",
  "this is the fun part.",
  "small dragon, big ideas.",
];

export default function ChapterPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const chapter = chapterBySlug(params.id);
  const challenge = chapter ? challengeFor(chapter.id) : undefined;
  const {
    progress,
    hydrated,
    complete,
    visit,
    isUnlocked,
    isComplete,
    breakStreak,
    recordAttempt,
  } = useProgress();
  const [celebrate, setCelebrate] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [exploredWidget, setExploredWidget] = useState(false);
  const challengeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chapter) {
      visit(chapter.id);
      setExploredWidget(false);
    }
  }, [chapter, visit]);

  useEffect(() => {
    if (!chapter || !hydrated) return;
    if (!isUnlocked(chapter.id)) router.replace("/play");
  }, [chapter, hydrated, isUnlocked, router]);

  // Friendly mascot bubble after a moment of inactivity on first visit.
  useEffect(() => {
    if (!chapter || isComplete(chapter.id)) return;
    const t = setTimeout(() => {
      const msg =
        ENCOURAGEMENT[Math.floor(Math.random() * ENCOURAGEMENT.length)];
      setBubble(msg);
      setTimeout(() => setBubble(null), 4500);
    }, 9000);
    return () => clearTimeout(t);
  }, [chapter, isComplete]);

  if (!chapter) {
    return (
      <main className="min-h-screen">
        <TopBar />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="font-display text-2xl mb-2">Chapter not found.</h1>
          <Button href="/play">Back to map</Button>
        </div>
      </main>
    );
  }

  const next = nextChapter(chapter.id);
  const prev = prevChapter(chapter.id);
  const done = hydrated && isComplete(chapter.id);
  const earnedStars = hydrated ? progress.stars[chapter.id] ?? 0 : 0;

  function handleExplored() {
    setExploredWidget(true);
    requestAnimationFrame(() => {
      challengeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleChallengePass(stars: number, perfect: boolean) {
    if (!chapter) return;
    if (!perfect) breakStreak();
    if (!isComplete(chapter.id) || stars > earnedStars) {
      setCelebrate(true);
      setConfetti(true);
      setTimeout(() => setCelebrate(false), 2200);
      setTimeout(() => setConfetti(false), 2800);
    }
    complete(chapter.id, stars, perfect);
  }

  // Pretend mascot stage if this chapter were just completed
  const futureCompleted = new Set(progress.completed);
  futureCompleted.add(chapter.id);
  const futureStage = STAGE_FOR_PROGRESS(futureCompleted.size);

  return (
    <main className="min-h-screen relative">
      <Embers density={6} />
      <TopBar />

      <div className="mx-auto max-w-5xl px-6 py-8 relative">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-ink-dim mb-6">
          <button
            onClick={() => router.push("/play")}
            className="hover:text-ink"
          >
            map
          </button>
          <span>/</span>
          <span className="text-ember">
            {String(chapter.id).padStart(2, "0")} ·{" "}
            {chapter.title.toLowerCase()}
          </span>
          {done && (
            <span className="ml-3 flex items-center gap-1.5">
              <Stars count={earnedStars} size={12} />
            </span>
          )}
        </div>

        {/* Illustrated chapter scene */}
        <ChapterScene chapter={chapter} />

        {/* Header */}
        <div className="mb-10 relative">
          <Sparkle className="absolute -top-2 -left-6" size={14} color="#ffcd6b" />
          <h1 className="font-display text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05] mb-4">
            {chapter.title.split(" ").map((w, i, arr) => (
              <span key={i}>
                {i === arr.length - 1 ? (
                  <span className="font-serif-wonky italic text-ember">{w}</span>
                ) : (
                  w
                )}
                {i < arr.length - 1 && " "}
              </span>
            ))}
          </h1>
          <p className="text-lg text-ink-mute max-w-2xl leading-relaxed">
            {chapter.hook}
          </p>
        </div>

        {/* Section: explore */}
        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ember">
              ① explore
            </div>
            <div className="font-display text-xl tracking-tight">
              Poke at it.{" "}
              <span className="font-serif-wonky italic text-ink-mute text-base">
                no wrong moves here.
              </span>
            </div>
          </div>
        </div>
        <div className="rounded-card border border-line/60 bg-bg-elev/40 overflow-hidden">
          <WidgetFor chapter={chapter} onComplete={handleExplored} />
        </div>

        {/* Section: challenge */}
        {challenge && (
          <div ref={challengeRef} className="mt-12 scroll-mt-20">
            <div className="mb-3 flex items-baseline justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ember">
                  ② challenge
                </div>
                <div className="font-display text-xl tracking-tight">
                  Now show what you{" "}
                  <span className="font-serif-wonky italic text-ember">
                    know
                  </span>
                  .
                </div>
              </div>
              {progress.streak > 1 && (
                <div className="text-xs font-mono text-yolk">
                  🔥 streak × {progress.streak}
                </div>
              )}
            </div>
            <ChallengeFor
              challenge={challenge}
              onPass={handleChallengePass}
              onAttempt={() => recordAttempt(chapter.id)}
            />
          </div>
        )}

        {/* Concept text + Sage mentor */}
        <div className="mt-12 grid md:grid-cols-[2fr_1fr] gap-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.18em] text-ink-dim mb-2">
              The concept
            </div>
            <p className="text-ink leading-relaxed text-lg">
              {chapter.concept}
            </p>
            <div className="mt-6 rounded-card border-2 border-dashed border-ember bg-ember/8 p-5 relative">
              <Sparkle className="absolute -top-3 -right-3" size={18} />
              <div className="text-xs font-mono uppercase tracking-[0.18em] text-ember mb-1">
                takeaway
              </div>
              <p className="text-ink font-serif-display text-lg italic">
                {chapter.takeaway}
              </p>
            </div>

            {/* Sage's note */}
            <div className="mt-8">
              <SageBubble message={SAGE_LINES[chapter.id] ?? "trust the loop, little one."} />
            </div>
          </div>
          <aside className="space-y-4">
            <div className="rounded-card border border-line/60 bg-bg-soft/60 p-5">
              <div className="text-xs font-mono uppercase tracking-[0.18em] text-ink-dim mb-3">
                Reward
              </div>
              <div className="text-3xl font-display text-ember">
                +{chapter.xp}{" "}
                <span className="text-base text-ink-mute">xp</span>
              </div>
              <div className="text-xs text-ink-dim font-mono mt-1">
                +25 per star · +50 perfect bonus
              </div>
              {done && (
                <div className="mt-4">
                  <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-mint mb-1">
                    earned
                  </div>
                  <Stars count={earnedStars} animate />
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Footer nav */}
        <div className="mt-12 flex items-center justify-between gap-4">
          <Button
            href={prev ? `/play/${prev.slug}` : "/play"}
            variant="ghost"
          >
            ← {prev ? prev.title : "Map"}
          </Button>
          {next ? (
            <Button
              href={`/play/${next.slug}`}
              variant={done ? "primary" : "secondary"}
            >
              {done ? `Next: ${next.title} →` : `Skip ahead →`}
            </Button>
          ) : done ? (
            <Button href="/play" variant="primary">
              Back to map →
            </Button>
          ) : null}
        </div>
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {celebrate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-bg/80 backdrop-blur"
            onClick={() => setCelebrate(false)}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="text-center"
            >
              <Mascot stage={futureStage} size={220} />
              <div className="mt-4 font-display text-3xl text-ember">
                +{chapter.xp} XP
              </div>
              <div className="mt-2 flex justify-center">
                <Stars count={earnedStars} size={28} animate />
              </div>
              <div className="text-ink-mute mt-2 font-serif-wonky italic">
                {chapter.title} — done.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Confetti show={confetti} />
      <MascotBubble
        stage={STAGE_FOR_PROGRESS(progress.completed.length)}
        message={bubble ?? ""}
        show={!!bubble}
      />
    </main>
  );
}
