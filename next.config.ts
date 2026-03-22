import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

module.exports = {
  experimental: {
    serverActions: {
      //OCI LoadBalancer対策 x-forwarded-hostとoriginで、ポート番号付与の違いが発生するようだ
      allowedOrigins: ['*', '*:443'],
    },
  },
}
