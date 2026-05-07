/**
 * Generate every illustrated asset in lib/art-manifest.ts via Gemini's
 * image generation API and write them to public/art/<name>.png.
 *
 * Usage:
 *   1. Put your key in .env.local:    GEMINI_API_KEY=xxxxxxxx
 *   2. (optional) override the model: GEMINI_IMAGE_MODEL=gemini-2.5-flash-image
 *   3. Run:                            npm run art
 *
 * Re-running is safe — assets that already exist are skipped unless
 * you pass `--force` or `--only=<name>`.
 *
 *   npm run art -- --force                 # regenerate everything
 *   npm run art -- --only=hero-day,sage    # regenerate only these
 *
 * Implementation notes:
 *  - Uses the REST endpoint `:generateContent` with
 *    `responseModalities: ["IMAGE"]` so it works for both
 *    `gemini-2.5-flash-image` (preferred) and `gemini-2.0-flash-exp-image-generation`.
 *  - Saves the inline base64 image data as a PNG.
 *  - Sleeps 600ms between calls so we don't trip free-tier RPM limits.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { ASSETS, STYLE_GUIDE, type ArtAsset } from "../lib/art-manifest";

// ─── Tiny .env.local loader (no extra deps) ─────────────────────────
async function loadDotEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  try {
    const raw = await fs.readFile(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/i);
      if (!m) continue;
      const [, k, v] = m;
      if (!process.env[k]) {
        process.env[k] = v.replace(/^["']|["']$/g, "").trim();
      }
    }
  } catch {
    // file optional
  }
}

// ─── Args ───────────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const onlyArg = args.find((a) => a.startsWith("--only="));
  const only = onlyArg ? onlyArg.replace("--only=", "").split(",") : null;
  const dryRun = args.includes("--dry-run");
  return { force, only, dryRun };
}

// ─── Sleep helper ────────────────────────────────────────────────────
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Gemini call ────────────────────────────────────────────────────
async function generate(asset: ArtAsset): Promise<Buffer> {
  const KEY = process.env.GEMINI_API_KEY;
  const MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image";
  if (!KEY) throw new Error("GEMINI_API_KEY missing in .env.local");

  const fullPrompt = [
    STYLE_GUIDE,
    "",
    `Aspect ratio: ${asset.aspect ?? "1:1"}.`,
    "",
    `Subject: ${asset.prompt}`,
    asset.notes ? `\nNotes: ${asset.notes}` : "",
  ].join("\n");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: fullPrompt }],
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE"],
      // Larger images when the model supports it (Imagen-style models will ignore).
      imageConfig: { aspectRatio: asset.aspect ?? "1:1" },
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gemini ${res.status}: ${txt.slice(0, 400)}`);
  }

  const data: any = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find(
    (p: any) => p.inlineData?.mimeType?.startsWith("image/")
  );
  if (!imagePart) {
    throw new Error(
      `No image in response for ${asset.name}. Got: ${JSON.stringify(data).slice(0, 400)}`
    );
  }
  const b64: string = imagePart.inlineData.data;
  return Buffer.from(b64, "base64");
}

// ─── Main ───────────────────────────────────────────────────────────
async function main() {
  await loadDotEnv();
  const { force, only, dryRun } = parseArgs();

  const outDir = path.resolve(process.cwd(), "public/art");
  await fs.mkdir(outDir, { recursive: true });

  const queue = ASSETS.filter(
    (a) => !only || only.includes(a.name)
  );

  console.log(`\n🎨  Hatchling art pipeline`);
  console.log(`    model: ${process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image"}`);
  console.log(`    queue: ${queue.length} asset${queue.length === 1 ? "" : "s"}\n`);

  let done = 0;
  let skipped = 0;
  let failed = 0;

  for (const asset of queue) {
    const out = path.join(outDir, `${asset.name}.png`);

    try {
      await fs.access(out);
      if (!force) {
        console.log(`  ↩  skip   ${asset.name}.png (exists, use --force to redo)`);
        skipped++;
        continue;
      }
    } catch {
      // doesn't exist yet — proceed
    }

    if (dryRun) {
      console.log(`  ·  would generate ${asset.name}.png  (${asset.aspect ?? "1:1"})`);
      continue;
    }

    try {
      process.stdout.write(`  →  ${asset.name} ... `);
      const buf = await generate(asset);
      await fs.writeFile(out, buf);
      console.log(`✓ ${(buf.length / 1024).toFixed(0)} KB`);
      done++;
      // Stay under free-tier rate limits
      await sleep(600);
    } catch (e: any) {
      console.log(`✗ ${e.message}`);
      failed++;
    }
  }

  console.log(`\n✅  done: ${done}   ↩ skipped: ${skipped}   ✗ failed: ${failed}\n`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
