import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// FSD 레이어 경계 — 하위 레이어가 상위 레이어를 import하지 못하도록 제한한다.
// 순서: app → views → widgets → features → entities → shared
const fsdLayerRules = [
  {
    layer: 'views',
    forbidden: ['@/app/*'],
  },
  {
    layer: 'widgets',
    forbidden: ['@/app/*', '@/views/*'],
  },
  {
    layer: 'features',
    forbidden: ['@/app/*', '@/views/*', '@/widgets/*'],
  },
  {
    layer: 'entities',
    forbidden: ['@/app/*', '@/views/*', '@/widgets/*', '@/features/*'],
  },
  {
    layer: 'shared',
    forbidden: ['@/app/*', '@/views/*', '@/widgets/*', '@/features/*', '@/entities/*'],
  },
].map(({ layer, forbidden }) => ({
  files: [`src/${layer}/**/*.{ts,tsx}`],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: forbidden,
            message: `FSD 규칙 위반: ${layer} 레이어는 상위 레이어를 import할 수 없습니다.`,
          },
        ],
      },
    ],
  },
}));

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // 디버깅 코드가 배포 코드에 포함되는 것을 방지 (개발자 로그는 warn/error만 허용)
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // 타입 안정성 유지
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  ...fsdLayerRules,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
