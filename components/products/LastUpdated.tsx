import { formatDateTime } from '@/lib/format';

type Props = {
  iso: string | null;
  /** 価格の確認日時なのか、記事の更新日時なのかを混同させない */
  kind: 'price' | 'article';
};

export default function LastUpdated({ iso, kind }: Props) {
  const formatted = formatDateTime(iso);
  if (!formatted) return null;
  return (
    <p className="font-[family-name:var(--font-utility)] text-xs text-[var(--color-muted)]">
      {kind === 'price' ? '価格確認' : '記事更新'} {formatted}
    </p>
  );
}
