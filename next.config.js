/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow server-side environment variables to be read at runtime
  env: {
    GNEWS_API_KEY: process.env.GNEWS_API_KEY,
    NEWSAPI_KEY: process.env.NEWSAPI_KEY,
  },
};

module.exports = nextConfig;
