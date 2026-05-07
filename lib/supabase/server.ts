import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_ENABLED, SUPABASE_URL } from "./env";

/**
 * Server Supabase client for use in route handlers, server components, and
 * server actions. Reads/writes the session cookie via Next's cookie helpers.
 */
export async function getSupabaseServer() {
  if (!SUPABASE_ENABLED) return null;
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server components can't set cookies — middleware handles refresh.
        }
      },
    },
  });
}
