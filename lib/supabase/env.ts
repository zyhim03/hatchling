/**
 * Single source of truth for Supabase env vars.
 * If both vars are present we treat the app as "auth-enabled".
 * Otherwise everything falls back to localStorage and the login page becomes a
 * helpful "not configured yet" notice instead of a hard error.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const SUPABASE_ENABLED = !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
