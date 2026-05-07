/**
 * Asset manifest for the Hatchling illustrated art set.
 * Used by `scripts/generate-art.ts` to generate every PNG via Gemini's
 * image API. Edit the prompts to retune the look.
 */

export const STYLE_GUIDE = `
Soft painterly digital illustration. Style reference: a modern children's
storybook crossed with an indie cartoon game promo (think Running Ghost,
Monument Valley, vintage travel poster).

Palette: warm cream background, peach, soft lavender, mint green, sky blue,
mustard yellow, ember orange. Light-mode, daytime, magical.

Shape language: rounded, chunky, friendly. No harsh black outlines — outlines
are darker tones of the fill color. Soft drop shadows. Gentle gradients.
Subtle paper-grain texture overall. One warm key light from upper-right.
Cinematic but cute. Cohesive cartoon character world.

Avoid: photorealism, dark edgy art, neon cyberpunk, flat vector look,
hyper-detailed line art, stock-illustration cliché.
`.trim();

export type ArtAsset = {
  /** Filename written to public/art/<name>.png */
  name: string;
  /** Short prompt — the style guide is automatically prepended */
  prompt: string;
  /** Optional aspect ratio. Falls back to "1:1". */
  aspect?: "1:1" | "3:4" | "4:3" | "16:9" | "9:16";
  /** Notes that get appended to the prompt for clarity. */
  notes?: string;
};

export const ASSETS: ArtAsset[] = [
  // ─── Hero ─────────────────────────────────────────────────────────
  {
    name: "hero-banner",
    aspect: "16:9",
    prompt:
      "An ULTRA-WIDE cinematic painterly storybook landscape. Wide-angle composition with most of the painting on the RIGHT half of the frame. The LEFT THIRD must be a calm pastel sky with soft clouds and atmosphere — minimal detail there, intentionally empty for headline text overlay. On the right side: a wooden nest sitting on a sunny pastel meadow with a tiny adorable cartoon dragon hatchling (peach-orange scales, big round blue eyes, tiny wings) curled inside. Gentle rolling lavender and pink mountains in the mid distance. A friendly smiling round sun rises from behind the right mountains. A wise round cartoon owl with tiny round glasses perched on a leafy branch in the right third. A cute round cartoon bee mid-flight near the nest. Pink, yellow, violet flowers scattered through the meadow. Soft magical sparkles drift across the whole scene. Cinematic golden-hour light from upper-right.",
    notes:
      "EDGE-TO-EDGE landing hero. The left third must be visually quiet (sky, clouds) so headline text overlays cleanly. Cinematic, not centered.",
  },
  {
    name: "hero-day",
    aspect: "4:3",
    prompt:
      "A tiny adorable cartoon dragon hatchling sitting on a wooden nest at the center of a sunny pastel meadow. Magical sparkles rise around the nest. Gentle rolling lavender and peach mountains in the distance. Pillowy white clouds and a smiling round sun in the upper right. A wise round owl with tiny round glasses perched on a leafy branch on the left. A cute round bee buzzing nearby. Pink and yellow flowers scattered in the grass. The dragon is the focus — peach-orange scales, big round eyes, tiny wings, tiny horns, looking curious and brave.",
    notes: "Centered hero card (legacy). Used in some side panels.",
  },
  {
    name: "world-map",
    aspect: "9:16",
    prompt:
      "A vertical fantasy journey landscape that goes from a cozy nest at the bottom up through rolling pastel mountains and into a bright daytime sky at the top. A glowing dotted path winds in an S-curve up the page connecting eleven small clearing spots. The bottom is a forest meadow with pine trees, round-leaf trees, flowers, the wooden nest. The middle has lavender and pink mountains with white snow caps. The top is sky-blue with fluffy white clouds, a friendly smiling sun with rotating rays, and a small dragon silhouette flying. Tiny owl on a branch, tiny bee zipping along the path.",
    notes: "Vertical world-map background. Path is integrated; UI nodes will overlay.",
  },

  // ─── Mascot stages ─────────────────────────────────────────────────
  {
    name: "mascot-egg",
    aspect: "1:1",
    prompt:
      "A single cartoon dragon egg sitting alone, slightly speckled cream with peach freckles, faintly glowing. Centered on a transparent or pure-white background. No nest, no scenery. Painterly soft shading.",
  },
  {
    name: "mascot-crack",
    aspect: "1:1",
    prompt:
      "The same speckled cream dragon egg, now with a small zigzag crack running down its surface and a hint of warm light leaking out. Pure white background.",
  },
  {
    name: "mascot-hatch",
    aspect: "1:1",
    prompt:
      "A baby cartoon dragon just hatched, peach-orange scales, big curious round eyes, tiny chubby body, no wings yet, sitting on a pile of broken eggshell pieces. White background.",
  },
  {
    name: "mascot-wing",
    aspect: "1:1",
    prompt:
      "A young cartoon dragon, peach-orange, with small new yellow-tinted wings just sprouted, looking proud. Round chubby body, big eyes, tiny horn nubs. White background.",
  },
  {
    name: "mascot-fledge",
    aspect: "1:1",
    prompt:
      "A teen cartoon dragon, peach-orange, slightly larger, fully formed wings spread mid-flap, tiny horns, tiny smile, mid-jump as if learning to fly. White background.",
  },
  {
    name: "mascot-soar",
    aspect: "1:1",
    prompt:
      "A confident cartoon dragon soaring with wings wide open, peach-orange scales, gold trim, magic sparkles trailing behind, against a soft sunset-pink sky.",
  },

  // ─── The cast ─────────────────────────────────────────────────────
  {
    name: "char-sage",
    aspect: "1:1",
    prompt:
      "A wise tiny cartoon owl mentor with round wire glasses, soft brown and cream feathers, big friendly eyes behind the glasses, a tiny golden beak, sitting on a wooden perch. Warm storybook style. White background.",
  },
  {
    name: "char-beep",
    aspect: "1:1",
    prompt:
      "A round chubby cartoon bee with black and yellow stripes, oversized translucent wings mid-flap, tiny smile, big anime eyes, antennae tipped with little dots. Cute and friendly. White background.",
  },
  {
    name: "char-glitch",
    aspect: "1:1",
    prompt:
      "A small confused cartoon blob creature in violet purple, with X-shape eyes and a wavy worried mouth. A tiny blue sweat drop on its forehead. Wobbly outline. Slightly transparent at edges. White background.",
  },
  {
    name: "char-sprout",
    aspect: "1:1",
    prompt:
      "A tiny cartoon seedling with two round green leaves and a smiley face on the central bud, sitting in a small terracotta pot. Cheerful and adorable. White background.",
  },

  // ─── Chapter scenes (banner, 3:1 wide-ish) ───────────────────────
  {
    name: "scene-00-egg",
    aspect: "16:9",
    prompt:
      "A wide painterly banner: a single dragon egg sitting on a moonlit grassy hill at dusk, faint constellations forming the shape of a dragon in the lavender sky. Magical sparkles around the egg.",
  },
  {
    name: "scene-01-architecture",
    aspect: "16:9",
    prompt:
      "A wide painterly banner: a cute cartoon workshop floating in a pastel sky, with eight glowing labeled puzzle pieces arranged in a row — each piece a different shape representing a transformer component. Friendly colors.",
  },
  {
    name: "scene-02-tokens",
    aspect: "16:9",
    prompt:
      "A wide painterly banner: an open library with sunlight pouring in, a long ribbon of paper text being snipped into colorful token chunks by a pair of friendly scissors floating mid-air, books and quills in the background.",
  },
  {
    name: "scene-03-embeddings",
    aspect: "16:9",
    prompt:
      "A wide painterly banner: a cosmos of softly glowing word-stars connected by faint constellation lines. Each star has a glowing label like 'king', 'queen', 'dragon'. Pastel nebula in the background.",
  },
  {
    name: "scene-04-position",
    aspect: "16:9",
    prompt:
      "A wide painterly banner: an ornate vintage compass on a treasure map, with a winding sine-wave dotted path drawn across the map, peach and lavender hills along its edges.",
  },
  {
    name: "scene-05-attention",
    aspect: "16:9",
    prompt:
      "A wide painterly banner: a row of cartoon glowing eyes looking sideways at one another with golden light beams connecting them. Each eye has a different color. Soft blurred background.",
  },
  {
    name: "scene-06-block",
    aspect: "16:9",
    prompt:
      "A wide painterly banner: five identical translucent crystal cubes stacked diagonally like a tower, glowing from within with soft pink and violet light. Construction tools floating around.",
  },
  {
    name: "scene-07-full-gpt",
    aspect: "16:9",
    prompt:
      "A wide painterly banner: a young cartoon dragon flying through colorful glowing flow lines that come from the left and exit as text on the right. Suggests data flowing through a model. Cinematic light.",
  },
  {
    name: "scene-08-training",
    aspect: "16:9",
    prompt:
      "A wide painterly banner: a cartoon dragon at a small training dojo, lifting tiny weights, with a downward-trending loss curve drawn on a chalkboard behind it, sweat drops showing effort, cheerful.",
  },
  {
    name: "scene-09-inference",
    aspect: "16:9",
    prompt:
      "A wide painterly banner: a cartoon dragon casting magic from its mouth — a stream of tokens emerging like dice tumbling out, with three temperature dials floating overhead.",
  },
  {
    name: "scene-10-soar",
    aspect: "16:9",
    prompt:
      "A wide painterly banner: the cartoon dragon, now adult, soaring above pastel mountains at sunrise, wings wide, magical sparkle trail, the owl flying behind with a tiny graduation cap.",
  },

  // ─── Decorative scenery ──────────────────────────────────────────
  {
    name: "deco-cloud-1",
    aspect: "16:9",
    prompt:
      "A single fluffy painterly cloud, white with soft cream undertone, on a transparent or pure-white background. Soft puffy edges.",
  },
  {
    name: "deco-cloud-2",
    aspect: "16:9",
    prompt:
      "A single elongated painterly cloud, white and soft pink, on transparent or pure-white background.",
  },
  {
    name: "deco-mountains",
    aspect: "16:9",
    prompt:
      "A long horizontal landscape band of three rows of layered cartoon mountains: far row in soft lavender with white snow caps, middle row in pink, near row in peach. No sky — just the mountain shapes. Transparent or pure-white above the mountains.",
  },
  {
    name: "deco-flowers",
    aspect: "16:9",
    prompt:
      "A horizontal strip of cartoon meadow flowers and grass tufts in pink, yellow, violet, and white. Pure-white background above the flowers. Painterly storybook style.",
  },
];
