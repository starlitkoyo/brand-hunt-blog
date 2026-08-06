import Link from 'next/link';

import type { ArticleBlock, InlineSpan } from '@/types';

/**
 * 記事本文の描画。
 * 許可したブロック種別だけを扱い、任意 HTML は描画しない（XSS 対策）。
 * 外部リンクは rel を付け、Amazonへのリンクは広告であることを示す。
 */

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function isAmazon(href: string): boolean {
  try {
    const host = new URL(href).hostname.toLowerCase();
    return host.endsWith('amazon.co.jp') || host.endsWith('amzn.to');
  } catch {
    return false;
  }
}

function Inline({ spans }: { spans: InlineSpan[] }) {
  return (
    <>
      {spans.map((span, index) => {
        if (span.kind === 'strong') {
          return <strong key={index}>{span.text}</strong>;
        }
        if (span.kind === 'link') {
          const href = span.href;
          if (isExternal(href)) {
            const amazon = isAmazon(href);
            return (
              <a
                key={index}
                href={href}
                target="_blank"
                rel={amazon ? 'nofollow sponsored noopener noreferrer' : 'noopener noreferrer'}
              >
                {span.text}
                {amazon ? (
                  <span className="ml-1 font-[family-name:var(--font-utility)] text-[0.7rem] tracking-[0.08em] text-[var(--color-signal)]">
                    [広告]
                  </span>
                ) : null}
              </a>
            );
          }
          // 内部リンクのみ Link を使う
          return (
            <Link key={index} href={href}>
              {span.text}
            </Link>
          );
        }
        return <span key={index}>{span.text}</span>;
      })}
    </>
  );
}

export default function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="prose-editorial">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return block.level === 2 ? (
              <h2 key={index}>{block.text}</h2>
            ) : (
              <h3 key={index}>{block.text}</h3>
            );

          case 'paragraph':
            return (
              <p key={index}>
                <Inline spans={block.spans} />
              </p>
            );

          case 'list':
            return block.ordered ? (
              <ol key={index}>
                {block.items.map((item, i) => (
                  <li key={i}>
                    <Inline spans={item} />
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={index}>
                {block.items.map((item, i) => (
                  <li key={i}>
                    <Inline spans={item} />
                  </li>
                ))}
              </ul>
            );

          case 'table':
            return (
              <div key={index} className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      {block.head.map((cell, i) => (
                        <th key={i} scope="col">
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case 'quote':
            return (
              <blockquote key={index}>
                <p>{block.text}</p>
              </blockquote>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
