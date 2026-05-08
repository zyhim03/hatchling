"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { TopBar } from "@/components/game/TopBar";
import { Button } from "@/components/ui/Button";
import { Sparkle } from "@/components/game/Scribble";
import { Sage } from "@/components/characters/Sage";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { SUPABASE_ENABLED } from "@/lib/supabase/env";

export default function LoginPage() {
  const supabase = getSupabaseBrowser();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/play";

  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState<"" | "magic" | "google">("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already signed in? Bounce.
  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    (async () => {
      const result = await supabase.auth.getUser();
      if (cancelled) return;
      if (result.data.user) router.replace(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase, router, next]);

  async function magicLink() {
    if (!supabase || !email) return;
    setError(null);
    setBusy("magic");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          next
        )}`,
      },
    });
    setBusy("");
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  async function google() {
    if (!supabase) return;
    setError(null);
    setBusy("google");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          next
        )}`,
      },
    });
    if (error) {
      setBusy("");
      setError(error.message);
    }
  }

  return (
    <main className="min-h-screen relative">
      <TopBar />
      <section className="mx-auto max-w-lg px-6 py-12 md:py-20">
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-ember mb-3">
          ✦ sign in
        </div>
        <h1 className="font-display text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05] mb-3 relative">
          Save your{" "}
          <span className="font-serif-wonky italic text-ember scribble-underline">
            hatchling
          </span>
          .
          <Sparkle className="absolute -top-3 -right-2" size={16} />
        </h1>
        <p className="text-ink-mute mb-8 leading-relaxed">
          One click. Your stars, streak, and growing dragon follow you to any
          device.
        </p>

        {!SUPABASE_ENABLED ? (
          <NotConfigured />
        ) : sent ? (
          <Sent email={email} />
        ) : (
          <div className="rounded-card border-2 border-line bg-bg-elev p-6 sticker space-y-5">
            {/* Google OAuth */}
            <button
              onClick={google}
              disabled={busy !== ""}
              className="w-full rounded-pill border-2 border-line bg-bg hover:bg-bg-soft px-5 py-3 font-medium text-ink flex items-center justify-center gap-3 transition disabled:opacity-50"
            >
              <GoogleMark />
              {busy === "google" ? "Opening Google…" : "Continue with Google"}
            </button>

            <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-ink-dim">
              <div className="h-px flex-1 bg-line" />
              or
              <div className="h-px flex-1 bg-line" />
            </div>

            {/* Magic link */}
            <div>
              <label className="text-xs font-mono text-ink-mute mb-1.5 block">
                email — we'll send a magic link
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@somewhere.com"
                  className="flex-1 rounded-pill bg-bg border-2 border-line px-4 py-3 text-ink focus:border-ember outline-none"
                />
                <Button
                  onClick={magicLink}
                  disabled={!email || busy !== ""}
                  size="md"
                >
                  {busy === "magic" ? "Sending…" : "Send link →"}
                </Button>
              </div>
              <p className="text-[11px] text-ink-dim mt-2 leading-relaxed">
                No password. The link signs you in (and creates an account if
                this is your first time).
              </p>
            </div>

            {error && (
              <div className="rounded-card border-2 border-rose/50 bg-rose/5 p-3 text-sm text-rose">
                {error}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex items-center gap-3">
          <Sage size={48} />
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-ink-mute italic font-serif-display"
          >
            "your progress is yours alone — RLS keeps every nest private."
          </motion.div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/play"
            className="text-sm text-ink-dim hover:text-ink underline-offset-4 hover:underline"
          >
            keep playing as guest →
          </Link>
        </div>
      </section>
    </main>
  );
}

function Sent({ email }: { email: string }) {
  return (
    <div className="rounded-card border-2 border-mint/60 bg-mint/5 p-6 text-center sticker">
      <div className="text-3xl mb-2">📬</div>
      <div className="font-display text-xl mb-1">
        Magic link sent to {email}
      </div>
      <div className="text-sm text-ink-mute leading-relaxed">
        Open the email on this device and click the link. Tab can stay open —
        we'll redirect automatically.
      </div>
    </div>
  );
}

function NotConfigured() {
  return (
    <div className="rounded-card border-2 border-dashed border-yolk/60 bg-yolk/5 p-6 sticker">
      <div className="text-3xl mb-2">🪺</div>
      <div className="font-display text-xl mb-2">
        Auth isn't configured yet.
      </div>
      <p className="text-sm text-ink-mute leading-relaxed">
        Drop your Supabase URL + anon key into{" "}
        <code className="font-mono bg-bg px-1.5 py-0.5 rounded">.env.local</code>{" "}
        and restart the dev server. See{" "}
        <code className="font-mono bg-bg px-1.5 py-0.5 rounded">SETUP.md</code>{" "}
        for the 4-minute walkthrough. Your local progress is safe in the
        meantime.
      </p>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3c-2 1.6-4.6 2.5-7.3 2.5-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.3 5.3C42 35 44 30 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
