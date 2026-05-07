"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { TopBar } from "@/components/game/TopBar";
import { Sparkle } from "@/components/game/Scribble";
import { CHAPTERS } from "@/lib/chapters";
import { useProgress } from "@/lib/progress";

export default function Home() {
  const { progress, hydrated } = useProgress();
  const inProgress = hydrated && progress.completed.length > 0;

  return (
    <main className="min-h-screen">
      {/* TopBar floats over the hero */}
      <div className="absolute inset-x-0 top-0 z-30">
        <TopBar />
      </div>

      {/* ─── Edge-to-edge cinematic hero ─────────────────────────── */}
      <section className="relative min-h-[100svh] overflow-hidden">
        {/* Painted full-bleed banner */}
        <Image
          src="/art/hero-banner.png"
          alt="A tiny dragon hatchling sleeping in a nest, with a wise owl, a bee, mountains, and a smiling sun in a sunny pastel meadow."
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />

        {/* Reading veil — subtle gradient on the left so headline pops on any
            generated variation of the painting */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, rgba(255, 246, 232, 0.85) 0%, rgba(255, 246, 232, 0.55) 30%, rgba(255, 246, 232, 0) 60%)",
          }}
        />

        {/* Headline + CTA, overlaid in the calm left third */}
        <div className="relative mx-auto max-w-7xl h-[100svh] px-6 md:px-12 grid md:grid-cols-2 items-center">
          <div className="pt-24 md:pt-0 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 12, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: -1.5 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-pill border-2 border-dashed border-ember/60 bg-bg-elev/80 backdrop-blur-sm px-3 py-1 text-xs font-mono text-ember mb-3 sticker"
            >
              <Sparkle size={12} />
              an afternoon of AI literacy
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="flex flex-wrap items-center gap-1.5 mb-5 text-[11px] font-mono uppercase tracking-[0.18em] text-ink-mute"
            >
              <span>same engine inside</span>
              <span className="rounded-pill bg-bg-elev border border-line px-2 py-0.5 text-ember sticker">
                ChatGPT
              </span>
              <span className="rounded-pill bg-bg-elev border border-line px-2 py-0.5 text-violet sticker">
                Claude
              </span>
              <span className="rounded-pill bg-bg-elev border border-line px-2 py-0.5 text-cyan sticker">
                DeepSeek
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.02] text-ink"
            >
              Understand how{" "}
              <span className="font-serif-wonky italic text-ember scribble-underline">
                AI
              </span>{" "}
              <br className="hidden md:block" />
              actually{" "}
              <span className="font-serif-wonky italic text-violet">
                thinks
              </span>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-ink leading-relaxed max-w-lg"
            >
              Eleven small games, one tiny dragon, and a guided tour through
              the engine that powers every modern model. For everyone who uses
              AI every day but still feels like it's magic.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button
                href={
                  inProgress
                    ? `/play/${
                        CHAPTERS[Math.min(progress.completed.length, 10)].slug
                      }`
                    : "/play/what-is-a-gpt"
                }
                size="lg"
              >
                {inProgress ? "Resume hatching →" : "Start the journey →"}
              </Button>
              <Button href="/play" variant="secondary" size="lg">
                See the world map
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex items-center gap-8 text-sm text-ink-mute font-mono"
            >
              <Stat label="levels" value="11" />
              <Stat label="games" value="11" />
              <Stat label="time" value="~2 hr" />
              <Stat label="cost" value="free" />
            </motion.div>
          </div>

          {/* Right column intentionally empty — the painting fills it */}
          <div />
        </div>

        {/* Floating sticker callouts on the painted right */}
        <FloatingPill
          className="hidden md:flex top-[18%] right-[6%]"
          tone="yolk"
          delay={0.6}
        >
          ⭐ 33 stars to collect
        </FloatingPill>
        <FloatingPill
          className="hidden md:flex top-[42%] right-[3%]"
          tone="rose"
          delay={0.75}
        >
          ⚔ daily boss arena
        </FloatingPill>
        <FloatingPill
          className="hidden md:flex bottom-[14%] right-[8%]"
          tone="cyan"
          delay={0.9}
        >
          🔥 keep your streak
        </FloatingPill>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-[0.22em] text-ink-mute"
        >
          ↓ scroll · meet your guides
        </motion.div>
      </section>

      {/* ─── Who is this for ─────────────────────────────────────── */}
      <section className="relative bg-bg-elev border-t-2 border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-ember mb-3">
            ✦ who this is for
          </div>
          <h2 className="font-display text-3xl md:text-4xl tracking-[-0.02em] leading-[1.1] mb-8 max-w-3xl">
            For people who use AI every day{" "}
            <span className="font-serif-wonky italic text-ember">
              but it still feels like magic.
            </span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                emoji: "🎨",
                t: "Designers + PMs",
                b: "You ship AI features without quite knowing what's under them. Fix that.",
              },
              {
                emoji: "📰",
                t: "Writers + journalists",
                b: "Read AI papers without bouncing off. Quote them with confidence.",
              },
              {
                emoji: "🎓",
                t: "Students",
                b: "The intuition college won't give you. Two hours flat.",
              },
              {
                emoji: "🌱",
                t: "Curious humans",
                b: "You don't need to build models. You just want to know how it thinks.",
              },
            ].map((c, i) => (
              <motion.div
                key={c.t}
                whileHover={{ y: -4, rotate: i % 2 ? 0.8 : -0.8 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="rounded-card border-2 border-line bg-bg p-5 sticker"
              >
                <div className="text-3xl mb-3">{c.emoji}</div>
                <div className="font-display text-base mb-1">{c.t}</div>
                <p className="text-sm text-ink-mute leading-relaxed">{c.b}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 rounded-card border-2 border-dashed border-violet/60 bg-violet/5 p-6 max-w-3xl">
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-violet mb-1">
              not for
            </div>
            <p className="text-ink-mute">
              ML engineers (you already know this) · people who want to ship a
              production model (you want a textbook). Hatchling is{" "}
              <span className="text-ink font-medium">AI literacy</span>, not
              AI engineering.
            </p>
          </div>
        </div>
      </section>

      {/* ─── How it works ────────────────────────────────────────── */}
      <section className="relative bg-bg border-t-2 border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-ember mb-3">
            ✦ how it works
          </div>
          <h2 className="font-display text-3xl md:text-4xl tracking-[-0.02em] leading-[1.1] mb-8">
            Each level, the hatchling{" "}
            <span className="font-serif-wonky italic text-yolk">grows</span>.
          </h2>
          <p className="text-ink-mute mb-12 max-w-2xl">
            You don't read a chapter. You play one. Eleven small games, three
            stars each, and your hatchling evolves from egg to soaring dragon
            as you go.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                t: "Play first, theory second",
                b: "Every chapter starts with a widget you poke. The explanation arrives after.",
                emoji: "🥚",
              },
              {
                t: "Real games, not quizzes",
                b: "Drag attention beams. Slice tokens. Spot embedding outliers. Each level is its own little game.",
                emoji: "🎮",
              },
              {
                t: "A modern GPT",
                b: "Same architecture as ChatGPT, Claude, DeepSeek — RoPE, RMSNorm, SwiGLU. Just smaller, friendlier.",
                emoji: "🐉",
              },
              {
                t: "No ML degree",
                b: "If you can write a for-loop, you can build this. Math arrives only when needed.",
                emoji: "✏️",
              },
              {
                t: "Daily five & boss rush",
                b: "A fresh five-question daily for streak-keepers. A timed ten-question rush for the brave.",
                emoji: "🔥",
              },
              {
                t: "It actually runs",
                b: "Final boss trains a tiny model end to end. You don't just learn — you ship.",
                emoji: "🚀",
              },
            ].map((c, i) => (
              <motion.div
                key={c.t}
                whileHover={{ y: -4, rotate: i % 2 ? 0.8 : -0.8 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="rounded-card border-2 border-line bg-bg-elev p-6 sticker"
              >
                <div className="text-2xl mb-3">{c.emoji}</div>
                <div className="font-display font-medium mb-2">{c.t}</div>
                <p className="text-sm text-ink-mute leading-relaxed">{c.b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Path teaser ─────────────────────────────────────────── */}
      <section className="border-t-2 border-line bg-bg-soft relative">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-ember mb-3">
            ✦ the path
          </div>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-12">
            Eleven stops between you and{" "}
            <span className="font-serif-wonky italic text-ember">
              fluency
            </span>
            .
          </h2>
          <ol className="grid md:grid-cols-2 gap-x-10 gap-y-2">
            {CHAPTERS.map((c) => (
              <li
                key={c.id}
                className="flex items-baseline gap-4 py-3 border-b border-line"
              >
                <span className="font-mono text-xs text-ink-dim w-6">
                  {String(c.id).padStart(2, "0")}
                </span>
                <span className="font-display text-ink">{c.title}</span>
                <span className="ml-auto text-xs text-ink-mute font-mono">
                  +{c.xp} xp
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex justify-center">
            <Button href="/play" size="lg">
              Open the world map →
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t-2 border-line py-10 bg-bg">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between text-xs text-ink-dim font-mono">
          <span>Hatchling — AI literacy, playably</span>
          <span>v0.4 · painted edition</span>
        </div>
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl text-ink font-display">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-ink-dim">
        {label}
      </div>
    </div>
  );
}

function FloatingPill({
  children,
  className,
  tone,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  tone: "yolk" | "rose" | "cyan";
  delay?: number;
}) {
  const colors = {
    yolk: "border-yolk text-yolk",
    rose: "border-rose text-rose",
    cyan: "border-cyan text-cyan",
  }[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, rotate: -4 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      transition={{
        delay,
        duration: 0.6,
        type: "spring",
        stiffness: 220,
        damping: 18,
      }}
      className={`absolute z-20 rounded-pill border-2 ${colors} bg-bg-elev/95 backdrop-blur-sm px-3 py-1.5 text-xs font-mono shadow-pop ${className ?? ""}`}
    >
      <motion.span
        animate={{ y: [0, -3, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
        style={{ display: "inline-block" }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
}
