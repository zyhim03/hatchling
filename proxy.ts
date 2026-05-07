import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_ENABLED,
  SUPABASE_URL,
} from "@/lib/supabase/env";

/**
 * Refreshes the Supabase session cookie on every request.
 * Bails out cleanly when Supabase isn't configured.
 *
 * Next 16 renamed `middleware` → `proxy`. The exported function must be
 * named `proxy` (or be the default export).
 */
export async function proxy(request: NextRequest) {
  if (!SUPABASE_ENABLED) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Touch the user — refreshes the JWT if expired.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Skip static / image assets — auth not needed there.
    "/((?!_next/static|_next/image|favicon.ico|art/).*)",
  ],
};
