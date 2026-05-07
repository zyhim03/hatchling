"use client";

import { motion } from "framer-motion";
import { TOTAL_XP } from "@/lib/chapters";

export function XPBar({
  xp,
  compact = false,
}: {
  xp: number;
  compact?: boolean;
}) {
  const pct = Math.min(100, (xp / TOTAL_XP) * 100);
  return (
    <div className={compact ? "w-40" : "w-full"}>
      <div className="flex items-center justify-between text-xs text-ink-mute mb-1.5 font-mono">
        <span>XP</span>
        <span className="text-ember">
          {xp.toLocaleString()} / {TOTAL_XP.toLocaleString()}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-bg-elev border border-line/60 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-ember-deep via-ember to-yolk"
        />
      </div>
    </div>
  );
}
