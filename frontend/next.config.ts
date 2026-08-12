import type { NextConfig } from 'next';

const allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS
  ? process.env.ALLOWED_DEV_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : undefined;

const apiServerUrl = process.env.API_SERVER_URL
  ? process.env.API_SERVER_URL.replace(/\/$/, '')
  : (() => {
      throw new Error('Environment variable API_SERVER_URL is required in frontend/.env');
    })();

const nextConfig: NextConfig = {
  allowedDevOrigins,
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiServerUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
