import BrandWordmark from '@/components/editorial/BrandWordmark';
import type { Brand } from '@/types';

type Props = {
  brands: Brand[];
  counts?: Record<string, number>;
};

/** 雑誌の索引のように、頭文字でまとめて表示する。ロゴ画像に依存しない。 */
export default function BrandIndex({ brands, counts }: Props) {
  const groups: Record<string, Brand[]> = {};
  for (const brand of brands) {
    const key = brand.indexKey;
    const bucket = groups[key];
    if (bucket) {
      bucket.push(brand);
    } else {
      groups[key] = [brand];
    }
  }
  const keys = Object.keys(groups).sort();

  return (
    <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
      {keys.map((key) => (
        <section key={key}>
          <h3 className="border-b border-[var(--color-border)] pb-2 font-[family-name:var(--font-utility)] text-sm tracking-[0.2em] text-[var(--color-muted-strong)]">
            {key}
          </h3>
          <ul className="divide-y divide-[var(--color-border)]">
            {(groups[key] ?? []).map((brand) => (
              <li key={brand.id}>
                <BrandWordmark name={brand.name} slug={brand.slug} count={counts?.[brand.id]} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
