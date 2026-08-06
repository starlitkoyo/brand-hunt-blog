import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import StoryCard from '@/components/editorial/StoryCard';
import ProductGrid from '@/components/products/ProductGrid';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import {
  getArticlesByCategory,
  getBrands,
  getCategories,
  getCategoryBySlug,
  getProductsByCategory,
} from '@/lib/data-source';
import { SITE } from '@/lib/site';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: 'カテゴリーが見つかりません' };
  return {
    title: category.name,
    description: category.description,
    ...(SITE.url ? { alternates: { canonical: `/categories/${category.slug}` } } : {}),
  };
}

export default async function CategoryDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, brands, categories, articles] = await Promise.all([
    getProductsByCategory(category.id),
    getBrands(),
    getCategories(),
    getArticlesByCategory(category.id, 2),
  ]);

  const featured = products.filter((p) => p.isFeatured);
  const rest = products.filter((p) => !p.isFeatured);
  const relatedBrands = brands.filter((b) => products.some((p) => p.brandId === b.id));

  return (
    <div className="u-container pb-20">
      <Breadcrumbs
        items={[
          { href: '/', label: 'ホーム' },
          { href: '/categories', label: 'カテゴリー' },
          { label: category.name },
        ]}
      />

      <header className="border-b border-[var(--color-border)] pb-10">
        <p className="u-label">{category.nameEn}</p>
        <h1 className="mt-4 text-[2rem] leading-tight lg:text-[2.75rem]">{category.name}</h1>
        <p className="mt-6 max-w-2xl text-[0.95rem] leading-[2] text-[var(--color-muted-strong)]">
          {category.description}
        </p>
      </header>

      {featured.length > 0 ? (
        <section className="mt-14">
          <h2 className="u-label">EDITOR&rsquo;S PICK</h2>
          <div className="mt-8">
            <ProductGrid products={featured} brands={brands} categories={categories} columns={3} />
          </div>
        </section>
      ) : null}

      <section className="mt-16">
        <h2 className="u-label">ALL ITEMS</h2>
        <div className="mt-8">
          <ProductGrid
            products={rest.length > 0 ? rest : products}
            brands={brands}
            categories={categories}
            emptyTitle="このカテゴリーの公開中の商品はありません。"
          />
        </div>
      </section>

      {relatedBrands.length > 0 ? (
        <section className="mt-20">
          <h2 className="u-label">BRANDS</h2>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {relatedBrands.map((brand) => (
              <li key={brand.id}>
                <Link href={`/brands/${brand.slug}`} className="u-underline-link">
                  {brand.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

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
