/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Empty turbopack config to acknowledge Turbopack usage
  turbopack: {},

  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL || 'http://localhost:4000',
    NEXT_PUBLIC_BUYER_AGENT_URL: process.env.BUYER_AGENT_URL || 'http://localhost:9090',
    NEXT_PUBLIC_SELLER_AGENT_URL: process.env.SELLER_AGENT_URL || 'http://localhost:8080',
  },
};

export default nextConfig;
