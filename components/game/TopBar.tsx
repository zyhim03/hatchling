"use client";

import Link from "next/link";
import { useState } from "react";
import { useProgress } from "@/lib/progress";
import { STAGE_FOR_PROGRESS, STAGE_LABEL } from "@/lib/chapters";
import { Mascot } from "./Mascot";
import { XPBar } from "./XPBar";
import { useUser, signOut } from "@/lib/supabase/useUser";
import { SUPABASE_ENABLED } from "@/lib/supabase/env";

export function TopBar() {
  const { progress, hydrated } = useProgress();
  const stage = STAGE_FOR_PROGRESS(progress.completed.length);

  return (
    <header className="sticky top-0 z-30 border-b-2 border-line bg-bg-elev/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 -my-1">
            <Mascot stage={stage} size={36} glow={false} />
          </div>
          <div className="leading-tight">
            <div className="font-display font-semibold tracking-tight text-ink group-hover:text-ember transition">
              Hatchling
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-ink-dim font-mono">
              AI literacy, playably
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden sm:flex items-center gap-2 text-xs text-ink-mute font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
            <span>{hydrated ? STAGE_LABEL[stage] : "..."}</span>
          </div>
          <div className="hidden md:block">
            <XPBar xp={hydrated ? progress.xp : 0} compact />
          </div>
          <Link
            href="/play"
            className="text-sm text-ink-mute hover:text-ink transition"
          >
            Map
          </Link>
          <UserButton />
        </div>
      </div>
    </header>
  );
}

function UserButton() {
  const { user, loading } = useUser();
  const [open, setOpen] = useState(false);

  if (!SUPABASE_ENABLED) {
    return null;
  }

  if (loading) {
    return <div className="w-7 h-7 rounded-full bg-bg-soft animate-pulse" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-pill border-2 border-ember/60 bg-ember/10 hover:bg-ember/20 text-ember px-3 py-1 text-xs font-medium transition sticker"
      >
        Sign in
      </Link>
    );
  }

  const name = (user.user_metadata?.name as string) || user.email || "you";
  const avatar = user.user_metadata?.avatar_url as string | undefined;
  const initials = name.slice(0, 1).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full overflow-hidden border-2 border-ember/60 bg-bg flex items-center justify-center text-xs font-display text-ember sticker"
        aria-label="Account menu"
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="" className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-card border-2 border-line bg-bg-elev sticker overflow-hidden">
            <div className="px-4 py-3 border-b border-line">
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim">
                signed in as
              </div>
              <div className="text-sm font-display text-ink truncate">
                {name}
              </div>
            </div>
            <Link
              href="/account"
              className="block px-4 py-2.5 text-sm text-ink hover:bg-bg-soft transition"
              onClick={() => setOpen(false)}
            >
              Account
            </Link>
            <Link
              href="/play"
              className="block px-4 py-2.5 text-sm text-ink hover:bg-bg-soft transition"
              onClick={() => setOpen(false)}
            >
              World map
            </Link>
            <button
              onClick={async () => {
                await signOut();
                setOpen(false);
                window.location.href = "/";
              }}
              className="block w-full text-left px-4 py-2.5 text-sm text-rose hover:bg-rose/5 border-t border-line transition"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
