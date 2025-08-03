import type { NextConfig } from 'next';
import type { WebpackConfigContext } from 'next/dist/server/config-shared';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
    ],
    webVitalsAttribution: ['CLS', 'LCP'],
    serverActions: {
      allowedOrigins: [
        'localhost:3000', 
        'eic-platform.vercel.app', 
        'feliona.ai', 
        'feliona.app', 
        '*.vercel.app', 
        '*.feliona.app'
      ],
      bodySizeLimit: '10mb',
    },
  },

  serverExternalPackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    'langchain',
    'openai',
    '@anthropic-ai/sdk',
  ],

  webpack: (
    config: import('webpack').Configuration, 
    { dev, isServer }: WebpackConfigContext
  ) => {
    // Обеспечиваем наличие experiments
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Добавляем правила для 3D моделей
    config.module?.rules?.push({
      test: /\.(glb|gltf|vrm)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/models/[name].[hash][ext]',
      },
    });

    // Добавляем правила для SVG
    config.module?.rules?.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            ext: 'tsx',
          },
        },
      ],
    });

    // Алиасы
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'three/examples/jsm': 'three/examples/jsm',
      };

      // Fallbacks для клиентской стороны
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
          crypto: false,
        };
      }
    }

    // Оптимизация для продакшена
    if (!dev && !isServer && config.optimization) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          three: {
            name: 'three',
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            priority: 30,
            reuseExistingChunk: true,
          },
          ai: {
            name: 'ai',
            test: /[\\/]node_modules[\\/](openai|@anthropic-ai|langchain)[\\/]/,
            priority: 25,
            reuseExistingChunk: true,
          },
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    domains: [
      'localhost',
      'res.cloudinary.com',
      's3.amazonaws.com',
      'utfs.io',
      'images.unsplash.com',
      'cdn.jsdelivr.net',
      'cdn.statically.io',
      'cdn.feliona.ai',
      'cdn.feliona.app',
      'cdn.vercel.app',
    ],
    remotePatterns: [
      { protocol: 'https', hostname: 'utfs.io' },
      { protocol: 'https', hostname: '**.vercel.app' },
      { protocol: 'https', hostname: '**.eic-platform.com' },
      { protocol: 'https', hostname: 'feliona.ai' },
      { protocol: 'https', hostname: 'feliona.app' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
      { protocol: 'https', hostname: 'cdn.statically.io' },
      { protocol: 'https', hostname: 'cdn.feliona.ai' },
      { protocol: 'https', hostname: 'cdn.feliona.app' },
      { protocol: 'https', hostname: 'cdn.vercel.app' },
    ],
  },

  async headers() {
    // 🚨 CSP убран из next.config - управляется middleware.ts с nonce
    // Оставляем только неконфликтующие заголовки для статических файлов
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
        ],
      },
      {
        source: '/(favicon|robots|sitemap|manifest)\\.(ico|txt|xml|json)$',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://feliona.ai,https://feliona.app' 
              : 'http://localhost:3000',
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { 
        source: '/chat', 
        destination: '/dashboard/chats', 
        permanent: true 
      },
      { 
        source: '/characters', 
        destination: '/discover', 
        permanent: true 
      },
    ];
  },

  async rewrites() {
    return [
      { 
        source: '/api/v1/:path*', 
        destination: '/api/:path*' 
      },
    ];
  },

  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    APP_VERSION: process.env.npm_package_version || '1.0.0',
    VERCEL_URL: process.env.VERCEL_URL || 'localhost:3000',
  },

  typescript: {
    tsconfigPath: './tsconfig.json',
    ignoreBuildErrors: false,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 🚀 Vercel оптимизация - убираем standalone для Vercel deployment
  // output: 'standalone', // Только для Docker, не для Vercel
  poweredByHeader: false,
  trailingSlash: false,

  // 🎯 i18n конфигурация для локализации
  i18n: {
    locales: ['en', 'ru', 'es', 'fr', 'de'],
    defaultLocale: 'en',
    localeDetection: true,
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  ...(process.env.NODE_ENV === 'production' && {
    compress: true,
    generateEtags: true,
  }),
} satisfies NextConfig;

// Типизированная конфигурация Sentry
interface SentryConfig {
  org: string;
  project: string;
  authToken: string;
  silent: boolean;
}

const sentryConfig: SentryConfig | undefined = 
  process.env.SENTRY_ORG && 
  process.env.SENTRY_PROJECT && 
  process.env.SENTRY_AUTH_TOKEN
    ? {
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        silent: true,
      }
    : undefined;

export default sentryConfig 
  ? withSentryConfig(bundleAnalyzer(nextConfig), sentryConfig)
  : bundleAnalyzer(nextConfig);
