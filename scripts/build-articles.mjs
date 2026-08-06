/**
 * content/articles/*.md を、型安全な ArticleBlock[] へ変換して
 * data/mock/articles.generated.ts を書き出す。
 *
 *   node scripts/build-articles.mjs
 *
 * 任意 HTML を描画しないため、Markdown をそのまま HTML 化せず
 * 許可したブロック種別だけに落とし込む。
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ARTICLES_DIR = join(process.cwd(), 'content', 'articles');
const OUT_FILE = join(process.cwd(), 'data', 'mock', 'articles.generated.ts');

/** front matter を切り出す */
function splitFrontMatter(raw) {
  if (!raw.startsWith('---')) throw new Error('front matter がありません');
  const end = raw.indexOf('\n---', 3);
  const head = raw.slice(3, end);
  const body = raw.slice(end + 4).trim();
  const meta = {};
  for (const line of head.split('\n')) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2].trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      meta[key] = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^"|"$/g, ''))
        .filter(Boolean);
    } else {
      meta[key] = value.replace(/^"|"$/g, '');
    }
  }
  return { meta, body };
}

/** インライン記法（**強調** と [text](href)）だけを解釈する */
function parseInline(text) {
  const spans = [];
  const pattern = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) {
      spans.push({ kind: 'text', text: text.slice(last, m.index) });
    }
    if (m[2] !== undefined) {
      spans.push({ kind: 'strong', text: m[2] });
    } else {
      spans.push({ kind: 'link', text: m[4], href: m[5] });
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    spans.push({ kind: 'text', text: text.slice(last) });
  }
  return spans.length > 0 ? spans : [{ kind: 'text', text }];
}

function parseBody(body) {
  const lines = body.split('\n');
  const blocks = [];
  let i = 0;

  const flushParagraph = (buffer) => {
    const text = buffer.join('\n').trim();
    if (text) blocks.push({ type: 'paragraph', spans: parseInline(text) });
  };

  let paragraph = [];

  while (i < lines.length) {
    const line = lines[i];

    // 見出し
    const heading = line.match(/^(#{2,3})\s+(.*)$/);
    if (heading) {
      flushParagraph(paragraph);
      paragraph = [];
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2].trim() });
      i += 1;
      continue;
    }

    // 表
    if (line.startsWith('|') && lines[i + 1]?.match(/^\|[\s:|-]+\|$/)) {
      flushParagraph(paragraph);
      paragraph = [];
      const cells = (row) =>
        row
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());
      const head = cells(line);
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].startsWith('|')) {
        rows.push(cells(lines[i]));
        i += 1;
      }
      blocks.push({ type: 'table', head, rows });
      continue;
    }

    // リスト
    const listMatch = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
    if (listMatch) {
      flushParagraph(paragraph);
      paragraph = [];
      const ordered = /\d/.test(listMatch[2]);
      const items = [];
      while (i < lines.length) {
        const m2 = lines[i].match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
        if (!m2) break;
        items.push(parseInline(m2[3].trim()));
        i += 1;
      }
      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    // 引用
    if (line.startsWith('> ')) {
      flushParagraph(paragraph);
      paragraph = [];
      const quote = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quote.push(lines[i].slice(2));
        i += 1;
      }
      blocks.push({ type: 'quote', text: quote.join(' ').trim() });
      continue;
    }

    // コードブロックは使わないので読み飛ばす
    if (line.startsWith('```')) {
      flushParagraph(paragraph);
      paragraph = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith('```')) i += 1;
      i += 1;
      continue;
    }

    if (line.trim() === '' || line.startsWith('---')) {
      flushParagraph(paragraph);
      paragraph = [];
      i += 1;
      continue;
    }

    paragraph.push(line);
    i += 1;
  }
  flushParagraph(paragraph);
  return blocks;
}

/** 記事タグからカテゴリーへ寄せる（該当なしは null） */
function guessCategoryId(tags) {
  const t = tags.join(' ');
  if (t.includes('バッグ') || t.includes('財布') || t.includes('小物')) return 'cat-fashion';
  if (t.includes('時計')) return 'cat-fashion';
  return null;
}

const files = readdirSync(ARTICLES_DIR)
  .filter((f) => f.endsWith('.md'))
  .sort();

const articles = files.map((file, index) => {
  const raw = readFileSync(join(ARTICLES_DIR, file), 'utf8');
  const { meta, body } = splitFrontMatter(raw);
  const tags = Array.isArray(meta.tags) ? meta.tags : [];
  return {
    id: `article-${meta.slug}`,
    slug: meta.slug,
    title: meta.title,
    description: meta.description,
    body: parseBody(body),
    heroImageUrl: null,
    categoryId: guessCategoryId(tags),
    publicationStatus: 'published',
    publishedAt: `${meta.published}T09:00:00+09:00`,
    updatedAt: `${meta.updated ?? meta.published}T09:00:00+09:00`,
    isFeatured: index < 3,
    relatedProductIds: [],
    isMock: false,
  };
});

const out = `// 自動生成ファイル。直接編集しないこと。
// 生成元: content/articles/*.md
// 再生成: node scripts/build-articles.mjs

import type { Article } from '@/types';

export const GENERATED_ARTICLES: Article[] = ${JSON.stringify(articles, null, 2)};
`;

writeFileSync(OUT_FILE, out, 'utf8');
console.log(`生成しました: ${articles.length} 記事 -> ${OUT_FILE}`);
