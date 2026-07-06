/* eslint-disable no-console -- CLI 검사 스크립트로 콘솔 출력이 본 기능이다 */
// Tailwind spacing 임의값 게이트
// gap / p* / m* / space 계열에 `-[Npx]`를 쓰면 0.25 단위 프리셋(N÷4)으로 변환하도록 강제한다.
// 이 규칙은 eslint/prettier로 잡히지 않고 editor의 Tailwind IntelliSense 경고로만 뜨므로,
// CI(`npm run check`)에서 막아 누구든 놓치지 않게 한다.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src';

// spacing scale를 그대로 쓰는 유틸만 대상으로 한다 (width/height/inset 등 치수는 제외)
const SPACING_PREFIXES = [
  'gap-x',
  'gap-y',
  'gap',
  'px',
  'py',
  'pt',
  'pb',
  'pl',
  'pr',
  'p',
  'mx',
  'my',
  'mt',
  'mb',
  'ml',
  'mr',
  'm',
  'space-x',
  'space-y',
];

// 예: gap-[15px], sm:p-[21px], -mt-[8px], group-hover:gap-x-[12px]
const PATTERN = new RegExp(
  '(?:^|[\\s"\'\\x60])(?:[a-z][a-z-]*:)*(-?)(' +
    SPACING_PREFIXES.join('|') +
    ')-\\[(\\d+(?:\\.\\d+)?)px\\]',
  'g',
);

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else if (/\.(ts|tsx|js|jsx)$/.test(entry)) files.push(full);
  }
  return files;
}

const violations = [];
for (const file of walk(ROOT)) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, index) => {
    for (const match of line.matchAll(PATTERN)) {
      const [, sign, prefix, px] = match;
      violations.push({
        file,
        line: index + 1,
        from: `${sign}${prefix}-[${px}px]`,
        to: `${sign}${prefix}-${Number(px) / 4}`,
      });
    }
  });
}

if (violations.length > 0) {
  console.error(
    '\n✗ Tailwind spacing 임의값이 발견되었습니다. 0.25 단위 프리셋으로 변환하세요 (N÷4):\n',
  );
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  ${v.from}  →  ${v.to}`);
  }
  console.error(`\n총 ${violations.length}건. 예) gap-[15px] → gap-3.75, p-[21px] → p-5.25\n`);
  process.exit(1);
}

console.log('✓ Tailwind spacing 프리셋 검사 통과');
