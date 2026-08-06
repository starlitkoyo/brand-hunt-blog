import Link from 'next/link';

type Props = {
  name: string;
  slug: string;
  count?: number;
  size?: 'sm' | 'lg';
};

/**
 * ブランド名はロゴ画像に依存せず、必ず HTML テキストで表示する。
 * 第三者のロゴを権利確認なしに複製しない。
 */
export default function BrandWordmark({ name, slug, count, size = 'sm' }: Props) {
  return (
    <Link href={`/brands/${slug}`} className="group block py-4">
      <span
        className={`u-underline-link block font-[family-name:var(--font-display)] ${
          size === 'lg' ? 'text-2xl lg:text-[1.75rem]' : 'text-lg'
        }`}
      >
        {name}
      </span>
      {typeof count === 'number' ? (
        <span className="mt-1 block font-[family-name:var(--font-utility)] text-xs text-[var(--color-muted)]">
          {count}件
        </span>
      ) : null}
    </Link>
  );
}
