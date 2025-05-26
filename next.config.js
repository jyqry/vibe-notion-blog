/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["fs"],
  },
  images: {
    domains: ["www.notion.so", "s3.us-west-2.amazonaws.com"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 클라이언트 사이드에서 서버 전용 모듈 제외
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };

      // 클라이언트에서 서버 전용 모듈 제외
      config.resolve.alias = {
        ...config.resolve.alias,
        "@/lib/notion-server": false,
        "@/lib/cache-manager": false,
        "@/lib/env-server": false,
      };
    }
    return config;
  },
  // 환경 변수 보안 강화
  env: {
    // 클라이언트에 노출할 환경 변수만 명시적으로 지정
    // NOTION_TOKEN과 NOTION_DATABASE_ID는 서버 전용
  },
};

module.exports = nextConfig;
