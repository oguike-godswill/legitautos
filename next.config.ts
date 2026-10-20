import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Brand pages were folded into the searchable inventory. Brand cards now
      // deep-link to /cars?brand=<name>, so keep old links and bookmarks alive.
      // Uses 307 (temporary) rather than 308 so the mapping can be revisited.
      {
        source: "/brands",
        destination: "/cars",
        permanent: false,
      },
      {
        source: "/brands/:slug",
        destination: "/cars",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
