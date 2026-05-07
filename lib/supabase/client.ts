"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_ENABLED, SUPABASE_URL } from "./env";

/**
 * Browser Supabase client. Persists session in cookies via @supabase/ssr.
 * Returns null if Supabase isn't configured — callers must handle that.
 */
let cached: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (!SUPABASE_ENABLED) return null;
  if (cached) return cached;
  cached = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return cached;
}
