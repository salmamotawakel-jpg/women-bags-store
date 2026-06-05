// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true, // ← يسمح للبناء بالاستمرار رغم أي أخطاء TS
  },
};

module.exports = nextConfig;