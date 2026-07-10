/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    AUTH_API_URL: process.env.AUTH_API_URL ?? 'https://auth.benfluxgroup.com',
  },
};

module.exports = nextConfig;
