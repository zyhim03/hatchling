"use client";

import { useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "./client";

/**
 * Reactive auth state. Returns the current user or null.
 * `loading` is true until the initial getUser() resolves.
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setLoading(false);
      return;
    }
    let mounted = true;

    (async () => {
      const result = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(result.data.user ?? null);
      setLoading(false);
    })();

    const sub = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        if (!mounted) return;
        setUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      sub.data.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}

export async function signOut() {
  const supabase = getSupabaseBrowser();
  if (!supabase) return;
  await supabase.auth.signOut();
}
