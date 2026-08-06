import Link from 'next/link';

const POINTS = [
  {
    title: '価格は確認できたものだけ',
    body: '取得できた価格と、その確認日時だけを表示します。推測値や計算できない割引率は載せません。',
  },
  {
    title: '安いことを理由にしない',
    body: 'ブランド、素材、用途、暮らしへのなじみ方を見て、いま選ぶ価値があるものを選びます。',
  },
  {
    title: '広告であることを隠さない',
    body: 'Amazonへのリンクは、押す前に広告リンクだと分かる形で表示します。',
  },
];

export default function EditorialPolicySummary() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {POINTS.map((point) => (
        <div key={point.title} className="border-t border-[var(--color-ink)] pt-5">
          <h3 className="text-base leading-relaxed">{point.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted-strong)]">
            {point.body}
          </p>
        </div>
      ))}
      <p className="lg:col-span-3">
        <Link
          href="/editorial-policy"
          className="u-underline-link u-label !text-[var(--color-ink)]"
        >
          編集方針をすべて読む
        </Link>
      </p>
    </div>
  );
}
