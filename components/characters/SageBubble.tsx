"use client";

import { motion } from "framer-motion";
import { Sage } from "./Sage";

/**
 * Sage with a speech bubble — used to call out hints / takeaways
 * inline on chapter pages.
 */
export function SageBubble({
  message,
  side = "left",
}: {
  message: string;
  side?: "left" | "right";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-3 ${
        side === "right" ? "flex-row-reverse" : ""
      }`}
    >
      <div className="flex-shrink-0">
        <Sage size={64} />
      </div>
      <div
        className={`relative max-w-md rounded-2xl border-2 border-line bg-bg-elev px-4 py-3 sticker ${
          side === "right" ? "rounded-br-sm" : "rounded-bl-sm"
        }`}
      >
        <div
          className={`absolute -bottom-1.5 ${
            side === "right" ? "right-4" : "left-4"
          } w-3 h-3 rotate-45 bg-bg-elev border-r-2 border-b-2 border-line`}
        />
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-violet mb-1">
          sage says
        </div>
        <p className="text-sm text-ink leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}
