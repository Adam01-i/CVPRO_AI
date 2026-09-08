import type { NextConfig } from 'next';

const allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS
  ? process.env.ALLOWED_DEV_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : undefined;

const apiServerUrl = process.env.API_SERVER_URL
  ? process.env.API_SERVER_URL.replace(/\/$/, '')
  : (() => {
      throw new Error('Environment variable API_SERVER_URL is required in frontend/.env');
    })();

// Les fichiers uploadés (photos de CV, etc.) sont servis par le backend
// à la racine (`/uploads/...`), en dehors du préfixe `/api/v1`.
// On dérive donc l'origine du serveur (protocole + host + port) à partir
// de API_SERVER_URL, sans son suffixe `/api/v1`.
const apiOrigin = new URL(apiServerUrl).origin;

const nextConfig: NextConfig = {
  allowedDevOrigins,
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiServerUrl}/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${apiOrigin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;