"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Stage } from "@/lib/chapters";

type Props = {
  stage: Stage;
  size?: number;
  glow?: boolean;
  className?: string;
};

const PAINTED: Record<Stage, string> = {
  egg: "/art/mascot-egg.png",
  crack: "/art/mascot-crack.png",
  hatch: "/art/mascot-hatch.png",
  wing: "/art/mascot-wing.png",
  fledge: "/art/mascot-fledge.png",
  soar: "/art/mascot-soar.png",
};

/**
 * Painted mascot wrapper. Tries the rendered PNG for the current stage and
 * falls back to the SVG armature if the file is missing or fails to load.
 * Same API and bobbing motion either way.
 */
export function Mascot({ stage, size = 180, glow = true, className }: Props) {
  const [errored, setErrored] = useState(false);

  return (
    <div
      className={className}
      style={{ width: size, height: size, position: "relative" }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full ember-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(242, 104, 44, 0.18), transparent 60%)",
          }}
        />
      )}
      {!errored ? (
        <motion.div
          className="relative w-full h-full"
          animate={{ y: stage === "soar" ? [-2, -8, -2] : [0, -4, 0] }}
          transition={{
            repeat: Infinity,
            duration: stage === "soar" ? 2.4 : 4,
            ease: "easeInOut",
          }}
        >
          <Image
            src={PAINTED[stage]}
            alt={`Hatchling at ${stage} stage`}
            fill
            sizes={`${size}px`}
            onError={() => setErrored(true)}
            style={{ objectFit: "contain" }}
          />
        </motion.div>
      ) : (
        <MascotSvg stage={stage} size={size} />
      )}
    </div>
  );
}

/** SVG armature — used as fallback when the painted PNG isn't available. */
function MascotSvg({ stage, size }: { stage: Stage; size: number }) {
  const showCrack = ["crack", "hatch", "wing", "fledge", "soar"].includes(stage);
  const showEyes = ["hatch", "wing", "fledge", "soar"].includes(stage);
  const showWings = ["wing", "fledge", "soar"].includes(stage);
  const showHorns = ["fledge", "soar"].includes(stage);
  const showFlight = stage === "soar";

  return (
    <motion.svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      animate={{ y: showFlight ? [-2, -8, -2] : [0, -4, 0] }}
      transition={{
        repeat: Infinity,
        duration: showFlight ? 2.4 : 4,
        ease: "easeInOut",
      }}
      className="relative"
    >
        <defs>
          <radialGradient id="eggBody" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffe9c2" />
            <stop offset="60%" stopColor="#e8d6b0" />
            <stop offset="100%" stopColor="#9c8866" />
          </radialGradient>
          <radialGradient id="dragonBody" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffb380" />
            <stop offset="60%" stopColor="#ff8a3c" />
            <stop offset="100%" stopColor="#a14515" />
          </radialGradient>
          <linearGradient id="wingGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffcd6b" />
            <stop offset="100%" stopColor="#ff8a3c" />
          </linearGradient>
        </defs>

        {/* Wings (behind body) */}
        {showWings && (
          <g>
            <motion.path
              d="M 60 100 Q 20 80 30 130 Q 50 120 70 120 Z"
              fill="url(#wingGrad)"
              opacity="0.85"
              animate={{ rotate: showFlight ? [-8, 8, -8] : [-2, 2, -2] }}
              transition={{
                repeat: Infinity,
                duration: showFlight ? 0.6 : 2,
              }}
              style={{ transformOrigin: "65px 110px" }}
            />
            <motion.path
              d="M 140 100 Q 180 80 170 130 Q 150 120 130 120 Z"
              fill="url(#wingGrad)"
              opacity="0.85"
              animate={{ rotate: showFlight ? [8, -8, 8] : [2, -2, 2] }}
              transition={{
                repeat: Infinity,
                duration: showFlight ? 0.6 : 2,
              }}
              style={{ transformOrigin: "135px 110px" }}
            />
          </g>
        )}

        {/* Body (egg or dragon) */}
        <ellipse
          cx="100"
          cy="110"
          rx="55"
          ry="70"
          fill={showEyes ? "url(#dragonBody)" : "url(#eggBody)"}
          stroke="rgba(0,0,0,0.25)"
          strokeWidth="1"
        />

        {/* Egg crack */}
        {showCrack && !showEyes && (
          <motion.path
            d="M 80 90 L 90 100 L 85 110 L 95 120 L 88 130 L 100 140 L 110 130 L 105 120 L 115 110 L 110 100 L 120 90"
            fill="none"
            stroke="#0a0a0f"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        )}

        {/* Eyes */}
        {showEyes && (
          <>
            <circle cx="82" cy="100" r="8" fill="#0a0a0f" />
            <circle cx="118" cy="100" r="8" fill="#0a0a0f" />
            <motion.circle
              cx="84"
              cy="98"
              r="3"
              fill="#fff"
              animate={{ cx: [84, 80, 84] }}
              transition={{ repeat: Infinity, duration: 5 }}
            />
            <motion.circle
              cx="120"
              cy="98"
              r="3"
              fill="#fff"
              animate={{ cx: [120, 116, 120] }}
              transition={{ repeat: Infinity, duration: 5 }}
            />
            {/* tiny smile */}
            <path
              d="M 88 130 Q 100 140 112 130"
              fill="none"
              stroke="#3a1a08"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Horns */}
        {showHorns && (
          <>
            <path
              d="M 80 50 L 75 30 L 88 45 Z"
              fill="#c75a14"
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1"
            />
            <path
              d="M 120 50 L 125 30 L 112 45 Z"
              fill="#c75a14"
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1"
            />
          </>
        )}

        {/* Flight sparkles */}
        {showFlight && (
          <g>
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx={40 + i * 60}
                cy={170}
                r="2"
                fill="#ffcd6b"
                animate={{ y: [0, -120], opacity: [1, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  delay: i * 0.4,
                }}
              />
            ))}
          </g>
        )}
    </motion.svg>
  );
}
