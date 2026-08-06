import Link from 'next/link';

import { formatDate } from '@/lib/format';
import type { Article } from '@/types';

type Props = {
  article: Article;
  size?: 'sm' | 'lg';
};

export default function StoryCard({ article, size = 'sm' }: Props) {
  const published = formatDate(article.publishedAt);

  return (
    <article className="flex h-full flex-col border-t border-[var(--color-ink)] pt-5">
      {published ? (
        <p className="font-[family-name:var(--font-utility)] text-xs tracking-[0.12em] text-[var(--color-muted)]">
          {published}
        </p>
      ) : null}

      <h3
        className={`mt-3 leading-snug ${
          size === 'lg' ? 'text-[1.35rem] lg:text-[1.6rem]' : 'text-[1.08rem]'
        }`}
      >
        <Link href={`/journal/${article.slug}`} className="u-underline-link">
          {article.title}
        </Link>
      </h3>

      <p className="mt-3 text-sm leading-[1.95] text-[var(--color-muted-strong)]">
        {article.description}
      </p>

      <p className="mt-auto pt-5">
        <Link
          href={`/journal/${article.slug}`}
          className="u-label u-underline-link !text-[var(--color-ink)]"
        >
          READ
        </Link>
      </p>
    </article>
  );
}
