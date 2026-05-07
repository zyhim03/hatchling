"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/game/TopBar";
import { Mascot } from "@/components/game/Mascot";
import { Stars } from "@/components/game/Stars";
import { Button } from "@/components/ui/Button";
import {
  CHAPTERS,
  STAGE_FOR_PROGRESS,
  STAGE_LABEL,
  TOTAL_XP,
} from "@/lib/chapters";
import { useProgress } from "@/lib/progress";
import { useDaily, useBoss } from "@/lib/sideProgress";
import { useUser, signOut } from "@/lib/supabase/useUser";
import { SUPABASE_ENABLED } from "@/lib/supabase/env";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const { progress, hydrated, reset } = useProgress();
  const { state: dailyState } = useDaily();
  const { state: bossState } = useBoss();

  const stage = STAGE_FOR_PROGRESS(progress.completed.length);
  const totalStars = hydrated
    ? Object.values(progress.stars).reduce((a, b) => a + b, 0)
    : 0;

  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  // Bounce out if not configured / not signed in.
  useEffect(() => {
    if (!SUPABASE_ENABLED) {
      router.replace("/login");
      return;
    }
    if (!loading && !user) router.replace("/login?next=/account");
  }, [loading, user, router]);

  // Prefill name from auth metadata.
  useEffect(() => {
    if (!user) return;
    const meta = (user.user_metadata?.name as string) || "";
    setName(meta);
  }, [user]);

  async function saveName() {
    if (!user) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setSavingName(true);
    await supabase
      .from("profiles")
      .upsert(
        { user_id: user.id, display_name: name || null },
        { onConflict: "user_id" }
      );
    await supabase.auth.updateUser({ data: { name } });
    setSavingName(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }

  if (loading || !user) {
    return (
      <main className="min-h-screen">
        <TopBar />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center text-ink-mute">
          Loading…
        </div>
      </main>
    );
  }

  const email = user.email ?? "—";
  const provider = user.app_metadata?.provider ?? "email";

  return (
    <main className="min-h-screen">
      <TopBar />

      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-ember mb-3">
          ✦ account
        </div>
        <h1 className="font-display text-4xl tracking-[-0.02em] mb-2">
          Your{" "}
          <span className="font-serif-wonky italic text-ember">nest</span>.
        </h1>
        <p className="text-ink-mute mb-10">
          Progress, stars, and streaks — synced to your account on every
          device.
        </p>

        {/* Identity card */}
        <div className="rounded-card border-2 border-line bg-bg-elev p-6 mb-6 sticker">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-ember/60 bg-bg flex items-center justify-center text-xl font-display text-ember">
              {(user.user_metadata?.avatar_url as string | undefined) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.user_metadata.avatar_url as string}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                (name || email).slice(0, 1).toUpperCase()
              )}
            </div>
            <div>
              <div className="font-display text-lg">{email}</div>
              <div className="text-xs font-mono text-ink-dim">
                via {provider}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-ink-mute mb-1.5 block">
              display name
            </label>
            <div className="flex gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="what should the dragon call you?"
                className="flex-1 rounded-pill bg-bg border-2 border-line px-4 py-2 text-ink focus:border-ember outline-none"
              />
              <Button
                onClick={saveName}
                disabled={savingName}
                size="md"
                variant="secondary"
              >
                {savingName ? "Saving…" : savedFlash ? "Saved ✓" : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats card */}
        <div className="rounded-card border-2 border-line bg-bg-elev p-6 mb-6 sticker">
          <div className="flex items-start gap-4">
            <Mascot stage={stage} size={88} />
            <div className="flex-1">
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-ink-dim">
                stage
              </div>
              <div className="font-display text-2xl">{STAGE_LABEL[stage]}</div>
              <div className="text-sm text-ink-mute mt-1">
                {progress.completed.length} / {CHAPTERS.length} chapters
                cleared · {progress.xp.toLocaleString()} /{" "}
                {TOTAL_XP.toLocaleString()} XP
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm font-mono">
                <span>
                  <Stars count={Math.min(3, totalStars)} size={12} />{" "}
                  <span className="text-ember">{totalStars}</span>
                  <span className="text-ink-dim"> / {CHAPTERS.length * 3}</span>
                </span>
                <span className="text-yolk">
                  🔥 {progress.streak}{" "}
                  <span className="text-ink-dim">streak</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily + Boss cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-card border-2 border-line bg-bg-elev p-5 sticker">
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-yolk mb-1">
              daily five
            </div>
            <div className="font-display text-lg">
              🔥 {dailyState.streak}{" "}
              <span className="text-ink-mute text-sm font-normal">
                day streak
              </span>
            </div>
            <div className="text-xs text-ink-dim font-mono mt-1">
              best · {dailyState.bestStreak}d
            </div>
          </div>
          <div className="rounded-card border-2 border-line bg-bg-elev p-5 sticker">
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-rose mb-1">
              boss arena
            </div>
            <div className="font-display text-lg">
              {bossState.best
                ? `${bossState.best.correct} / ${bossState.best.total}`
                : "no runs yet"}
            </div>
            <div className="text-xs text-ink-dim font-mono mt-1">
              {bossState.best
                ? `best · ${(bossState.best.durationMs / 1000).toFixed(0)}s`
                : `${bossState.runs.length} runs`}
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="rounded-card border-2 border-dashed border-rose/60 bg-rose/5 p-5">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-rose mb-1">
            danger zone
          </div>
          <div className="font-display text-base mb-3">
            Reset progress · sign out
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                if (
                  confirm(
                    "Reset everything? Your dragon goes back in the egg."
                  )
                ) {
                  reset();
                }
              }}
              className="rounded-pill border-2 border-rose/60 bg-bg text-rose px-4 py-1.5 text-sm hover:bg-rose/10 transition"
            >
              Reset all progress
            </button>
            <button
              onClick={async () => {
                await signOut();
                window.location.href = "/";
              }}
              className="rounded-pill border-2 border-line bg-bg text-ink-mute px-4 py-1.5 text-sm hover:bg-bg-soft transition"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/play"
            className="text-sm text-ink-mute hover:text-ink underline-offset-4 hover:underline"
          >
            ← back to the world map
          </Link>
        </div>
      </div>
    </main>
  );
}
