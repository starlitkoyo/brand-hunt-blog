import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import StoryCard from '@/components/editorial/StoryCard';
import LastUpdated from '@/components/products/LastUpdated';
import ProductGrid from '@/components/products/ProductGrid';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import {
  getBrandBySlug,
  getBrands,
  getCategories,
  getProductsByBrand,
  getRelatedArticles,
} from '@/lib/data-source';
import { SITE } from '@/lib/site';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return { title: 'ブランドが見つかりません' };
  return {
    title: brand.name,
    description: brand.description,
    ...(SITE.url ? { alternates: { canonical: `/brands/${brand.slug}` } } : {}),
  };
}

export default async function BrandDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const [products, brands, categories, articles] = await Promise.all([
    getProductsByBrand(brand.id),
    getBrands(),
    getCategories(),
    getRelatedArticles('', 2),
  ]);

  const usedCategories = categories.filter((c) => products.some((p) => p.categoryId === c.id));
  const latestConfirmed = products
    .map((p) => p.price.confirmedAt)
    .filter((t): t is string => Boolean(t))
    .sort()
    .at(-1);

  return (
    <div className="u-container pb-20">
      <Breadcrumbs
        items={[
          { href: '/', label: 'ホーム' },
          { href: '/brands', label: 'ブランド' },
          { label: brand.name },
        ]}
      />

      <header className="border-b border-[var(--color-border)] pb-10">
        <p className="u-label">BRAND</p>
        <h1 className="mt-4 text-[2rem] leading-tight lg:text-[2.75rem]">{brand.name}</h1>
        {brand.nameKana ? (
          <p className="mt-2 text-sm text-[var(--color-muted)]">{brand.nameKana}</p>
        ) : null}
        <p className="mt-6 max-w-2xl text-[0.95rem] leading-[2] text-[var(--color-muted-strong)]">
          {brand.description}
        </p>

        {usedCategories.length > 0 ? (
          <p className="mt-6 text-sm text-[var(--color-muted-strong)]">
            取り扱い：{usedCategories.map((c) => c.name).join('、')}
          </p>
        ) : null}

        <div className="mt-4">
          <LastUpdated iso={latestConfirmed ?? null} kind="price" />
        </div>
      </header>

      <section className="mt-14">
        <h2 className="u-label">PRODUCTS</h2>
        <div className="mt-8">
          <ProductGrid
            products={products}
            brands={brands}
            categories={categories}
            emptyTitle="このブランドの公開中の商品はありません。"
          />
        </div>
      </section>

      {articles.length > 0 ? (
        <section className="mt-20">
          <h2 className="u-label">RELATED STORIES</h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {articles.map((article) => (
              <StoryCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
