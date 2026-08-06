/**
 * 公開前チェック。
 * 未置換のプレースホルダーが残っていないかを調べる。
 *
 *   node scripts/check-placeholders.mjs
 *
 * 見つかった場合は終了コード 1 を返す。
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const ROOT = process.cwd();
const SKIP_DIRS = new Set([
  'node_modules',
  '.next',
  '.git',
  '.venv',
  'out',
  'build',
  'scripts',
  'content',
]);
const TARGET_EXT = new Set(['.ts', '.tsx', '.mts', '.md', '.json', '.css', '.mjs']);
// テストは意図的にダミーURLを使うため対象外
const SKIP_FILES = new Set(['tests/format.test.ts']);

const PATTERNS = [
  // JSX の {{ }} と区別するため「要確認:」を含むものだけを対象にする
  { label: '未置換のプレースホルダー', re: /\{\{\s*要確認\s*:/ },
  { label: 'example.com', re: /example\.com/ },
  { label: '仮の計測ID', re: /G-XXXXXXXXXX/ },
  { label: '仮の電話番号', re: /000-0000-0000/ },
  { label: '仮の住所', re: /東京都〇〇区/ },
];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, files);
    } else if (TARGET_EXT.has(extname(entry))) {
      files.push(full);
    }
  }
  return files;
}

const findings = [];
for (const file of walk(ROOT)) {
  if (SKIP_FILES.has(relative(ROOT, file).replaceAll('\\', '/'))) continue;
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, index) => {
    for (const { label, re } of PATTERNS) {
      if (re.test(line)) {
        findings.push({
          file: relative(ROOT, file),
          line: index + 1,
          label,
          text: line.trim().slice(0, 120),
        });
      }
    }
  });
}

if (findings.length === 0) {
  console.log('公開前チェック: 未置換のプレースホルダーはありません。');
  process.exit(0);
}

console.log(`公開前チェック: ${findings.length} 件の未置換項目が見つかりました。\n`);
for (const f of findings) {
  console.log(`  ${f.file}:${f.line}  [${f.label}]`);
  console.log(`    ${f.text}`);
}
console.log('\n本番公開の前に置き換えてください。');
process.exit(1);
