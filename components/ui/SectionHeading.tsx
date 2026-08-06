import Link from 'next/link';

type Props = {
  /** 欧文の小見出し */
  label: string;
  /** 日本語の見出し */
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  as?: 'h2' | 'h3';
};

export default function SectionHeading({
  label,
  title,
  description,
  href,
  hrefLabel = 'すべて見る',
  as: Tag = 'h2',
}: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--color-border)] pb-5">
      <div className="max-w-2xl">
        <p className="u-label">{label}</p>
        <Tag className="mt-3 text-[1.6rem] leading-snug lg:text-[2rem]">{title}</Tag>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted-strong)]">
            {description}
          </p>
        ) : null}
      </div>
      {href ? (
        <Link href={href} className="u-underline-link u-label shrink-0 !text-[var(--color-ink)]">
          {hrefLabel}
        </Link>
      ) : null}
    </div>
  );
}
