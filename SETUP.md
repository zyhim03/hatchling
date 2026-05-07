# Hatchling — setup

The app runs fine with no setup at all (everything falls back to localStorage).
You only need this if you want **persistent accounts + cross-device progress
sync** via Supabase, or to regenerate art with **Gemini**.

---

## Quick start (local dev, no auth)

```bash
cd ~/Digime/Hatchling
npm install
npm run dev
# → http://localhost:3000
```

That's it. Progress lives in `localStorage`. The "Sign in" button stays
hidden until you wire Supabase below.

---

## Add accounts + cross-device sync (Supabase)

### 1 · Create a project (~2 min)

1. Go to https://supabase.com/dashboard, sign in.
2. Click **New project** → name it `hatchling`.
3. Pick the closest region. Set a strong DB password (you don't need it
   often — Supabase manages auth for you).
4. Wait ~30s for provisioning.

### 2 · Run the migration (~30 sec)

1. In your Supabase project, open **SQL editor** (left sidebar).
2. Open the file `supabase/migrations/20260507_init.sql` from this repo.
3. Paste the whole thing into the SQL editor and hit **Run**.

This creates the `profiles` table with row-level security so each user can
only ever read/write their own row.

### 3 · Copy keys into `.env.local` (~1 min)

In Supabase, go to **Project Settings → API**. Grab:

- `Project URL`
- `anon` `public` API key

Then in this repo:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

Restart the dev server. The TopBar now shows a **Sign in** button and
`/login` works.

### 4 · (Optional) Enable Google OAuth (~2 min)

1. Supabase → **Authentication → Providers → Google**.
2. Toggle it on. Follow their wizard — they walk you through the Google
   Cloud Console setup. You'll paste your Client ID + Client Secret back
   into Supabase.
3. Set the **Site URL** under **Authentication → URL Configuration** to
   `http://localhost:3000` (and your production URL once deployed).

Email magic-link works with no extra setup — Supabase ships a default
sender for low-volume dev use.

### 5 · You're done

Visit `/login`, click Google or send a magic link to your own email.
Click the link, you bounce back to `/play` signed in. Your `localStorage`
progress merges into the Supabase row on first login.

---

## Generate art with Gemini

```bash
cp .env.local.example .env.local
# add: GEMINI_API_KEY=ya29.xxxx
# (get one from https://aistudio.google.com/apikey)

npm run art            # only generates files that don't exist yet
npm run art:force      # regenerate everything (~$1.10)
npm run art -- --only=hero-banner --force    # just one
```

All prompts and the shared `STYLE_GUIDE` are in `lib/art-manifest.ts`.

---

## Troubleshooting

- **"Auth isn't configured yet" on /login** — your env vars aren't loaded.
  Restart `npm run dev` after editing `.env.local`.
- **Magic link goes nowhere** — check the **Site URL** in Supabase
  (Authentication → URL Configuration). Must match `http://localhost:3000`
  while developing.
- **Profile fetch fails** — make sure you ran the SQL migration. The error
  in the console will mention `relation "public.profiles" does not exist`.
- **OAuth callback shows error** — the redirect URL in Google Cloud must
  include `https://<project>.supabase.co/auth/v1/callback`.
