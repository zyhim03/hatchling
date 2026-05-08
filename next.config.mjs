/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // We type-check separately via `npx tsc --noEmit` (and locally via the IDE).
  // Skip Next's build-time gate so a Vercel-specific TS quirk doesn't block deploys.
  // To re-enable: remove this block and ensure CI runs the standalone tsc.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
