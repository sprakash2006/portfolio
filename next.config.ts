import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Wikipedia Picture of the Day (Wikimedia Commons uploads)
    remotePatterns: [new URL("https://upload.wikimedia.org/wikipedia/commons/**")],
  },
};

export default nextConfig;
