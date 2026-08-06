import type { Metadata } from 'next';

import BrandIndex from '@/components/editorial/BrandIndex';
import BrandWordmark from '@/components/editorial/BrandWordmark';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import EmptyState from '@/components/ui/EmptyState';
import SectionHeading from '@/components/ui/SectionHeading';
import { getBrandProductCounts, getBrands } from '@/lib/data-source';

export const metadata: Metadata = {
  title: 'ブランド一覧',
  description: '掲載しているブランドの索引です。名前から探せます。',
};

export default async function BrandsPage() {
  const [brands, counts] = await Promise.all([getBrands(), getBrandProductCounts()]);
  const featured = brands.filter((b) => b.isFeatured);

  return (
    <div className="u-container pb-20">
      <Breadcrumbs items={[{ href: '/', label: 'ホーム' }, { label: 'ブランド' }]} />

      <SectionHeading
        label="BRANDS"
        title="ブランド索引"
        description="ロゴ画像ではなく、名前で引けるようにしています。"
      />

      {brands.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="現在、掲載中のブランドはありません。" />
        </div>
      ) : (
        <>
          {featured.length > 0 ? (
            <section className="mt-12">
              <h2 className="u-label">FEATURED</h2>
              <ul className="mt-4 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
                {featured.map((brand) => (
                  <li key={brand.id}>
                    <BrandWordmark
                      name={brand.name}
                      slug={brand.slug}
                      count={counts[brand.id]}
                      size="lg"
                    />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-16">
            <h2 className="u-label">ALL BRANDS</h2>
            <div className="mt-6">
              <BrandIndex brands={brands} counts={counts} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
