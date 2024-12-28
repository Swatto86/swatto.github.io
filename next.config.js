/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  compress: true,
  productionBrowserSourceMaps: false,
  
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    unoptimized: true,
  },

  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://swatto.co.uk',
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel.com https://vercel.live https://vercel.com https://va.vercel-scripts.com https://speed-insights.vercel.app",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://vercel.live",
              "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://vercel.live",
              "font-src 'self' https://fonts.gstatic.com https://vercel.live",
              "img-src 'self' blob: data:",
              "connect-src 'self' https://*.vercel.com https://*.vercel.live https://vitals.vercel-insights.com https://va.vercel-scripts.com https://speed-insights.vercel.app wss://*.pusher.com https://*.pusher.com https://sockjs-us3.pusher.com wss://sockjs-us3.pusher.com",
              "frame-src 'self' https://*.vercel.com https://*.vercel.app https://vercel.live https://vercel.com",
              "form-action 'self'",
              "base-uri 'self'",
              "worker-src 'self' blob:",
              "manifest-src 'self'"
            ].join('; ')
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          {
            key: 'Set-Cookie',
            value: '__vercel_live_token=*; SameSite=None; Secure'
          }
        ]
      }
    ];
  },

  output: 'standalone',

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/sitemap.xml',
          destination: '/api/sitemap',
        },
        {
          source: '/robots.txt',
          destination: '/api/robots',
        },
        {
          source: '/downloads/:path*',
          destination: '/static/downloads/:path*',
        }
      ],
    };
  },

  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
    }
    return config;
  },

  experimental: {
    scrollRestoration: true,
  },
};

module.exports = nextConfig;