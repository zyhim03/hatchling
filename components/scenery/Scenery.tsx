"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* ─── Daytime sky background ────────────────────────────── */

export function Sky({ className }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 ${className ?? ""}`}
      style={{
        background:
          "linear-gradient(180deg, #88cdee 0%, #b9b6f0 28%, #ffc1d6 58%, #ffd6cf 80%, #fffaec 100%)",
      }}
    >
      {/* Soft sun glow */}
      <div
        className="absolute"
        style={{
          right: "12%",
          top: "10%",
          width: "30%",
          height: "30%",
          background:
            "radial-gradient(ellipse at center, rgba(255, 245, 200, 0.85), transparent 65%)",
        }}
      />
    </div>
  );
}

/* ─── Drifting puffy clouds ──────────────────────────────── */

const CLOUD_PATHS = [
  "M 0 30 Q 10 10 25 18 Q 35 4 50 16 Q 65 4 80 16 Q 95 8 110 30 Q 100 38 60 38 Q 20 38 0 30 Z",
  "M 0 28 Q 14 8 30 18 Q 50 4 70 16 Q 90 8 100 28 Q 80 36 50 36 Q 20 36 0 28 Z",
];

export function Clouds() {
  const [drift, setDrift] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      setDrift(((t - start) / 80) % 2000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const layers = [
    { yPct: 4, opacity: 0.95, scale: 1.4, speed: 0.3 },
    { yPct: 12, opacity: 0.8, scale: 1.0, speed: 0.5 },
    { yPct: 20, opacity: 0.65, scale: 1.5, speed: 0.7 },
    { yPct: 30, opacity: 0.4, scale: 1.1, speed: 0.9 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {layers.map((l, i) => (
        <svg
          key={i}
          viewBox="0 0 1600 80"
          preserveAspectRatio="none"
          className="absolute w-[200%] h-32"
          style={{
            top: `${l.yPct}%`,
            left: `${-(drift * l.speed) % 800}px`,
            opacity: l.opacity,
          }}
        >
          {[0, 240, 500, 780, 1040, 1280, 1520].map((x, idx) => (
            <g key={x} transform={`translate(${x}, 0) scale(${l.scale}, 1)`}>
              <path d={CLOUD_PATHS[idx % CLOUD_PATHS.length]} fill="#ffffff" opacity={0.95} />
              <path d={CLOUD_PATHS[idx % CLOUD_PATHS.length]} fill="#fff8ec" opacity={0.6} transform="translate(2, 4)" />
            </g>
          ))}
        </svg>
      ))}
    </div>
  );
}

/* ─── Daytime: little birds + sparkles instead of stars ─────── */

export function Stars2() {
  const [pts, setPts] = useState<
    | {
        i: number;
        x: number;
        y: number;
        size: number;
        delay: number;
      }[]
    | null
  >(null);

  useEffect(() => {
    setPts(
      Array.from({ length: 22 }).map((_, i) => ({
        i,
        x: Math.random() * 100,
        y: 6 + Math.random() * 30,
        size: 6 + Math.random() * 4,
        delay: Math.random() * 4,
      }))
    );
  }, []);

  if (!pts) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {pts.map((p) => (
        <motion.svg
          key={p.i}
          width={p.size}
          height={p.size * 0.6}
          viewBox="0 0 20 12"
          animate={{ x: [0, 14, 0], y: [0, -3, 0] }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
        >
          {/* tiny "M" bird silhouette */}
          <path
            d="M 1 6 Q 5 1 10 6 Q 15 1 19 6"
            fill="none"
            stroke="rgba(42, 31, 74, 0.45)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </motion.svg>
      ))}
    </div>
  );
}

/* ─── Layered mountain silhouettes (lavender / pink / peach) ─── */

export function Mountains() {
  return (
    <svg
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-x-0 bottom-0 w-full h-1/2 pointer-events-none"
    >
      {/* Far lavender mountains */}
      <path
        d="M 0 480 L 60 380 L 140 440 L 220 320 L 320 420 L 420 300 L 540 400 L 640 280 L 760 380 L 860 320 L 1000 420 L 1000 600 L 0 600 Z"
        fill="#9b87ce"
        opacity="0.8"
      />
      {/* Snow caps on far range */}
      <path
        d="M 220 320 L 240 348 L 260 332 L 280 360 L 320 420 L 280 400 L 260 380 L 220 320 Z M 420 300 L 440 322 L 460 308 L 480 332 L 540 400 L 500 380 L 470 350 L 420 300 Z M 640 280 L 660 304 L 680 290 L 700 318 L 760 380 L 720 360 L 680 320 L 640 280 Z"
        fill="#ffffff"
        opacity="0.85"
      />
      {/* Mid pink hills */}
      <path
        d="M 0 540 L 80 460 L 180 510 L 280 420 L 380 490 L 480 410 L 600 480 L 720 400 L 840 470 L 1000 430 L 1000 600 L 0 600 Z"
        fill="#c89bb5"
        opacity="0.85"
      />
      {/* Near peach hills */}
      <path
        d="M 0 580 L 120 530 L 240 570 L 360 510 L 480 560 L 600 520 L 720 565 L 840 530 L 1000 555 L 1000 600 L 0 600 Z"
        fill="#f3b497"
      />
      {/* Grassy ground line */}
      <path
        d="M 0 595 L 1000 595 L 1000 600 L 0 600 Z"
        fill="#6fb55f"
      />
    </svg>
  );
}

/* ─── Trees with leafy tops ─────────────────────────────────── */

export function Trees({
  positions,
}: {
  positions: { x: number; y: number; size?: number; kind?: "pine" | "round" }[];
}) {
  return (
    <>
      {positions.map((p, i) => {
        const size = p.size ?? 18;
        const isPine = (p.kind ?? (i % 2 === 0 ? "pine" : "round")) === "pine";
        return (
          <svg
            key={i}
            viewBox="0 0 32 44"
            className="absolute pointer-events-none drop-shadow-sm"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: size,
              height: size * 1.5,
              transform: "translate(-50%, -100%)",
            }}
          >
            {/* trunk */}
            <rect x="13" y="32" width="6" height="10" fill="#8c5b34" rx="1" />
            {isPine ? (
              <>
                <path d="M 16 2 L 28 18 L 22 18 L 30 32 L 2 32 L 10 18 L 4 18 Z" fill="#5fa84a" stroke="#3e7a32" strokeWidth="0.8" />
                <path d="M 16 2 L 28 18 L 22 18 L 30 32" fill="rgba(255,255,255,0.18)" />
              </>
            ) : (
              <>
                <ellipse cx="16" cy="20" rx="14" ry="14" fill="#7ec55a" stroke="#4f8538" strokeWidth="0.8" />
                <ellipse cx="11" cy="14" rx="4" ry="3" fill="rgba(255,255,255,0.4)" />
              </>
            )}
          </svg>
        );
      })}
    </>
  );
}

/* ─── Lone grass tufts ─────────────────────────────────────── */

export function Tufts({
  positions,
}: {
  positions: { x: number; y: number }[];
}) {
  return (
    <>
      {positions.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 16 8"
          className="absolute pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: 14,
            height: 7,
            transform: "translate(-50%, -100%)",
          }}
        >
          <path
            d="M 2 8 L 4 2 M 6 8 L 7 0 M 10 8 L 11 1 M 14 8 L 13 3"
            stroke="#3e7a32"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      ))}
    </>
  );
}

/* ─── Floating magic motes — pastel daytime version ─────────── */

export function MagicMotes({ count = 25 }: { count?: number }) {
  const [m, setM] = useState<
    | {
        i: number;
        x: number;
        y: number;
        size: number;
        delay: number;
        duration: number;
        hue: string;
      }[]
    | null
  >(null);

  useEffect(() => {
    const palette = ["#f5b324", "#e64f8f", "#7d5be4", "#2eb6d4", "#ffffff"];
    setM(
      Array.from({ length: count }).map((_, i) => ({
        i,
        x: Math.random() * 100,
        y: 30 + Math.random() * 70,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 6,
        duration: 8 + Math.random() * 6,
        hue: palette[Math.floor(Math.random() * palette.length)],
      }))
    );
  }, [count]);

  if (!m) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {m.map((p) => (
        <motion.div
          key={p.i}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: -120,
            opacity: [0, 0.95, 0.95, 0],
            x: [0, 12, -8, 4],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.hue,
            boxShadow: `0 0 ${p.size * 4}px ${p.hue}`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Big sun with rays ──────────────────────────────────── */

export function BigSun({
  className,
  size = 140,
  style,
}: {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      className={`absolute pointer-events-none ${className ?? ""}`}
      style={{ width: size, height: size, ...style }}
    >
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <defs>
          <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff8d8" />
            <stop offset="60%" stopColor="#ffd57a" />
            <stop offset="100%" stopColor="#f5b324" />
          </radialGradient>
          <radialGradient id="sunHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 213, 122, 0.6)" />
            <stop offset="100%" stopColor="rgba(255, 213, 122, 0)" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="95" fill="url(#sunHalo)" />
        {/* Rays */}
        {Array.from({ length: 12 }).map((_, i) => (
          <rect
            key={i}
            x="98"
            y="6"
            width="4"
            height="24"
            fill="#f5b324"
            opacity="0.7"
            rx="2"
            transform={`rotate(${i * 30} 100 100)`}
          />
        ))}
        <circle cx="100" cy="100" r="50" fill="url(#sunCore)" stroke="#e89e0a" strokeWidth="1.5" />
        {/* Smiling sun face */}
        <circle cx="86" cy="92" r="3.5" fill="#2a1f4a" />
        <circle cx="114" cy="92" r="3.5" fill="#2a1f4a" />
        <path d="M 84 108 Q 100 122 116 108" fill="none" stroke="#2a1f4a" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}
