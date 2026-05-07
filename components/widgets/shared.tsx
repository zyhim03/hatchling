"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

export function WidgetFrame({
  children,
  caption,
  cta = "Mark complete",
  onComplete,
  unlocked = true,
}: {
  children: ReactNode;
  caption?: string;
  cta?: string;
  onComplete: () => void;
  unlocked?: boolean;
}) {
  return (
    <div>
      <div className="p-6 md:p-8 grid-bg">{children}</div>
      <div className="border-t border-line/60 px-6 py-4 flex items-center justify-between bg-bg-soft/60">
        <div className="text-xs font-mono text-ink-dim max-w-md">
          {caption}
        </div>
        <Button onClick={onComplete} disabled={!unlocked}>
          {cta} →
        </Button>
      </div>
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-pill border border-line/60 bg-bg-elev/60 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.12em] text-ink-mute">
      {children}
    </span>
  );
}
