# Hatchling — Art

This folder holds the painterly illustrations the app references at runtime.
Each PNG is named to match an entry in `lib/art-manifest.ts`.

## How to populate it

1. **Get a key:** https://aistudio.google.com/apikey
2. **Drop it in `.env.local`** at the project root:
   ```
   GEMINI_API_KEY=ya29.xxxxxxxxxxxx
   ```
3. **Run the generator:**
   ```bash
   npm install        # first time only — pulls `tsx`
   npm run art        # generates everything missing in this folder
   npm run art:force  # regenerates everything (use sparingly)
   npm run art -- --only=hero-day,sage    # regenerate just these
   npm run art:dry    # show what would be generated, no API calls
   ```

The script uses `gemini-2.5-flash-image` by default. Override with
`GEMINI_IMAGE_MODEL=imagen-3.0-generate-002` (or another image-capable
Gemini model) in `.env.local` if you want to A/B the look.

## Tuning the look

All prompts live in `lib/art-manifest.ts`. The `STYLE_GUIDE` constant at
the top is prepended to every prompt — change it once and the whole
brand re-tunes.

## Fallbacks

Every place that uses these PNGs (HeroScene, ChapterScene, WorldMap)
falls back to the existing SVG illustrations when a PNG is missing or
fails to load — so the app is never broken while you're iterating.
