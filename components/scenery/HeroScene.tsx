"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Mascot } from "@/components/game/Mascot";
import { Stage } from "@/lib/chapters";
import { Beep } from "@/components/characters/Beep";
import { Sage } from "@/components/characters/Sage";
import { Art } from "./Art";
import {
  Sky,
  Stars2,
  Clouds,
  Mountains,
  MagicMotes,
  BigSun,
  Tufts,
} from "./Scenery";

/**
 * Big illustrated hero card.
 * Primary visual = the rendered hero painting in /public/art/hero-day.png.
 * If that PNG isn't there yet (no key, didn't run the script), we render
 * the full SVG scene with mascot, sage, beep, and nest as a graceful fallback.
 */
export function HeroScene({ stage }: { stage: Stage }) {
  return (
    <div
      className="relative w-full h-full rounded-card overflow-hidden border-2 border-line/60 bg-bg-elev"
      style={{
        boxShadow:
          "0 30px 80px -20px rgba(125, 91, 228, 0.35), inset 0 -4px 0 rgba(42, 31, 74, 0.06)",
      }}
    >
      <Art
        name="hero-day"
        alt="A tiny dragon hatchling sitting on a wooden nest in a sunny pastel meadow with mountains, clouds, a smiling sun, an owl on a branch, and a bee buzzing nearby."
        priority
        fallback={<SvgHeroFallback stage={stage} />}
      />
      {/* Always-on sparkle overlay so even the rendered scene has motion */}
      <div className="pointer-events-none absolute inset-0">
        <MagicMotes count={20} />
      </div>
    </div>
  );
}

function SvgHeroFallback({ stage }: { stage: Stage }) {
  return (
    <SvgFrame>
      <Sky />
      <Stars2 />
      <Clouds />
      <Mountains />
      <MagicMotes count={32} />

      <BigSun size={150} style={{ left: "62%", top: "10%" }} />

      <div className="absolute" style={{ left: "8%", top: "44%" }}>
        <Branch />
        <div className="absolute -top-9 left-2">
          <Sage size={56} />
        </div>
      </div>

      <motion.div
        className="absolute"
        style={{ left: "70%", top: "55%" }}
        animate={{
          x: [0, 30, 60, 30, 0, -20, 0],
          y: [0, -8, 4, -10, 0, -6, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Beep size={44} />
      </motion.div>

      <Tufts
        positions={[
          { x: 12, y: 95 },
          { x: 24, y: 96 },
          { x: 48, y: 95 },
          { x: 72, y: 96 },
          { x: 88, y: 95 },
        ]}
      />
      <Flower x="20%" bottom="6%" hue="#e64f8f" />
      <Flower x="38%" bottom="5%" hue="#f5b324" />
      <Flower x="78%" bottom="6%" hue="#7d5be4" />

      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: "8%" }}
      >
        <Nest />
        <div className="absolute left-1/2 -translate-x-1/2 -top-12 z-10">
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [-1.5, 1.5, -1.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Mascot stage={stage} size={170} />
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        className="absolute"
        style={{
          left: "50%",
          bottom: "14%",
          transform: "translate(-50%, 0)",
          width: 240,
          height: 240,
        }}
      >
        <svg viewBox="0 0 240 240" className="w-full h-full">
          <circle
            cx="120"
            cy="120"
            r="116"
            fill="none"
            stroke="rgba(245, 179, 36, 0.55)"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          />
        </svg>
      </motion.div>
    </SvgFrame>
  );
}

function SvgFrame({ children }: { children: ReactNode }) {
  return <div className="absolute inset-0">{children}</div>;
}

function Nest() {
  return (
    <svg width="220" height="80" viewBox="0 0 220 80">
      <ellipse cx="110" cy="68" rx="100" ry="10" fill="rgba(42, 31, 74, 0.15)" />
      <path
        d="M 20 50 Q 50 28 110 32 Q 170 28 200 50 Q 200 70 110 72 Q 20 70 20 50 Z"
        fill="#a8744a"
      />
      <path
        d="M 30 48 Q 60 35 100 40 M 130 38 Q 160 35 195 50 M 50 56 Q 90 50 140 56 Q 180 60 195 56"
        stroke="#7a4d28"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 60 45 Q 80 38 100 42 M 140 42 Q 160 40 180 48"
        stroke="#d09b6a"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Branch() {
  return (
    <svg width="100" height="40" viewBox="0 0 100 40">
      <path
        d="M 0 22 Q 30 28 60 22 Q 80 18 100 24"
        stroke="#7a4d28"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="20" cy="14" rx="9" ry="5" fill="#7ec55a" stroke="#4f8538" strokeWidth="1" />
      <ellipse cx="44" cy="12" rx="11" ry="6" fill="#7ec55a" stroke="#4f8538" strokeWidth="1" />
      <ellipse cx="72" cy="14" rx="10" ry="5" fill="#7ec55a" stroke="#4f8538" strokeWidth="1" />
    </svg>
  );
}

function Flower({
  x,
  bottom,
  hue,
}: {
  x: string;
  bottom: string;
  hue: string;
}) {
  return (
    <svg
      viewBox="0 0 24 36"
      className="absolute pointer-events-none"
      style={{ left: x, bottom, width: 22, height: 32 }}
    >
      <path d="M 12 36 L 12 18" stroke="#3e7a32" strokeWidth="2" strokeLinecap="round" />
      <path d="M 12 26 Q 16 24 18 22" stroke="#3e7a32" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="12" cy="18" rx="4" ry="3" fill="#7ec55a" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx="12"
          cy="6"
          rx="3"
          ry="5"
          fill={hue}
          stroke="rgba(42,31,74,0.3)"
          strokeWidth="0.6"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="2.4" fill="#fff8d8" stroke="#e89e0a" strokeWidth="0.8" />
    </svg>
  );
}
