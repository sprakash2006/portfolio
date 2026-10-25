import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Wikipedia Picture of the Day (Wikimedia Commons uploads)
    remotePatterns: [{ protocol: "https", hostname: "upload.wikimedia.org", pathname: "/wikipedia/commons/**" }],
  },
};

export default nextConfig;
