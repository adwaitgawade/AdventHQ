/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Posters are local SVG/placeholder assets for v1.
    // TODO: configure remotePatterns when real CDN assets are wired.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
