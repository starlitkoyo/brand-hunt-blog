'use client';

import { trackEvent } from '@/lib/analytics';
import { AMAZON_LINK_NOTE } from '@/lib/site';

type Props = {
  href: string;
  asin: string;
  brand: string;
  category: string;
  placement: string;
  variant?: 'primary' | 'quiet';
  label?: string;
  showNote?: boolean;
};

/**
 * Amazonへの外部リンク。
 * - 押す前に広告リンクだと分かる表示を添える
 * - 計測に失敗しても遷移を妨げない
 */
export default function AmazonOutboundLink({
  href,
  asin,
  brand,
  category,
  placement,
  variant = 'primary',
  label = 'Amazonで現在の価格を見る',
  showNote = true,
}: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 border px-6 py-4 font-[family-name:var(--font-utility)] text-sm tracking-[0.08em] transition-colors';
  const styles =
    variant === 'primary'
      ? 'border-[var(--color-signal)] bg-[var(--color-signal)] text-[var(--color-white)] hover:bg-[var(--color-signal-hover)] hover:border-[var(--color-signal-hover)]'
      : 'border-[var(--color-border)] text-[var(--color-ink)] hover:border-[var(--color-ink)]';

  return (
    <div>
      <a
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className={`${base} ${styles}`}
        onClick={() => {
          try {
            trackEvent('amazon_product_click', { asin, brand, category, placement });
          } catch {
            // 計測失敗でリンク遷移を止めない
          }
        }}
      >
        {label}
        <span aria-hidden="true">↗</span>
        <span className="u-visually-hidden">（広告リンク・新しいタブで開きます）</span>
      </a>
      {showNote ? (
        <p className="mt-3 max-w-md text-xs leading-relaxed text-[var(--color-muted)]">
          {AMAZON_LINK_NOTE}
        </p>
      ) : null}
    </div>
  );
}
