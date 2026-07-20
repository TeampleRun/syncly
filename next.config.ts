import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    // 자료실의 실제 파일 제한(5MB)에 multipart 전송 오버헤드를 더해 Server Action 요청을 허용한다.
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'atkvaovvzdiznndrkjgt.supabase.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;
