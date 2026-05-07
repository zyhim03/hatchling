"use client";

import Image from "next/image";
import { useState } from "react";
import { ASSETS } from "@/lib/art-manifest";

// Suppress unused variable warning — still importing for parity, may use later.

const NAMES = new Set(ASSETS.map((a) => a.name));

/**
 * Drops in a generated illustration from public/art/<name>.png.
 *
 * If the file isn't there yet (no key, didn't run the script), we render
 * the SVG `fallback` underneath so the page is never broken.
 *
 * Once `npm run art` populates the PNGs, the rendered art simply
 * appears on next load — no code changes needed.
 */
export function Art({
  name,
  alt,
  className,
  fallback,
  priority,
  fit = "cover",
}: {
  name: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
  priority?: boolean;
  fit?: "cover" | "contain";
}) {
  const [errored, setErrored] = useState(false);
  const known = NAMES.has(name);
  const src = `/art/${name}.png`;

  if (!known || errored) {
    return <>{fallback}</>;
  }

  return (
    <div className={`relative w-full h-full ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        onError={() => setErrored(true)}
        style={{ objectFit: fit }}
      />
    </div>
  );
}
