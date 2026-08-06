import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import AmazonDisclosure from '@/components/products/AmazonDisclosure';
import AmazonOutboundLink from '@/components/products/AmazonOutboundLink';
import PriceDisplay from '@/components/products/PriceDisplay';
import ProductGrid from '@/components/products/ProductGrid';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ImageFallback from '@/components/ui/ImageFallback';
import StoryCard from '@/components/editorial/StoryCard';
import {
  getBrandById,
  getBrands,
  getCategories,
  getCategoryById,
  getProductBySlug,
  getPublishedProducts,
  getRelatedArticles,
  getRelatedProducts,
} from '@/lib/data-source';
import { SITE } from '@/lib/site';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const products = await getPublishedProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: '商品が見つかりません' };
  const brand = await getBrandById(product.brandId);
  const title = brand ? `${brand.name} ${product.title}` : product.title;
  return {
    title,
    description: product.editorialComment,
    ...(SITE.url ? { alternates: { canonical: `/products/${product.slug}` } } : {}),
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [brand, category, related, brands, categories, articles] = await Promise.all([
    getBrandById(product.brandId),
    getCategoryById(product.categoryId),
    getRelatedProducts(product, 4),
    getBrands(),
    getCategories(),
    getRelatedArticles('', 2),
  ]);

  return (
    <div className="u-container pb-20">
      <Breadcrumbs
        items={[
          { href: '/', label: 'ホーム' },
          { href: '/sale', label: 'セール' },
          ...(category ? [{ href: `/categories/${category.slug}`, label: category.name }] : []),
          { label: product.title },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="bg-[var(--color-canvas-soft)]">
          {product.imageUrl ? (
            <div className="relative aspect-[4/5]">
              <Image
                src={product.imageUrl}
                alt={`${brand?.name ?? ''} ${product.title}`.trim()}
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                priority
                className="object-cover"
              />
            </div>
          ) : (
            <ImageFallback label={`${brand?.name ?? ''} ${product.title}`} />
          )}
        </div>

        <div>
          {brand ? (
            <p className="font-[family-name:var(--font-utility)] text-sm tracking-[0.18em] text-[var(--color-muted-strong)]">
              <Link href={`/brands/${brand.slug}`} className="u-underline-link">
                {brand.name}
              </Link>
            </p>
          ) : null}

          <h1 className="mt-4 text-[1.6rem] leading-snug lg:text-[2.1rem]">{product.title}</h1>

          {category ? (
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              <Link href={`/categories/${category.slug}`} className="u-underline-link">
                {category.name}
              </Link>
            </p>
          ) : null}

          <div className="mt-8 border-y border-[var(--color-border)] py-7">
            <PriceDisplay price={product.price} size="lg" />
          </div>

          <div className="mt-8">
            <AmazonOutboundLink
              href={product.amazonUrl}
              asin={product.asin}
              brand={brand?.name ?? ''}
              category={category?.name ?? ''}
              placement="product_detail"
            />
          </div>

          {product.availabilityStatus === 'out_of_stock' ? (
            <p className="mt-6 border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-muted-strong)]">
              現在Amazonで在庫を確認できません。移動先で最新の状況をご確認ください。
            </p>
          ) : null}

          <section className="mt-10">
            <h2 className="u-label">EDITOR&rsquo;S NOTE</h2>
            <p className="mt-4 text-[0.95rem] leading-[2]">{product.editorialComment}</p>
          </section>

          {product.recommendedFor.length > 0 ? (
            <section className="mt-8">
              <h2 className="u-label">向いている人</h2>
              <ul className="mt-4 space-y-2 text-[0.95rem] leading-[1.9]">
                {product.recommendedFor.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="text-[var(--color-signal)]">
                      —
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="mt-10 border-t border-[var(--color-border)] pt-6">
            <AmazonDisclosure compact />
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-24">
          <h2 className="border-b border-[var(--color-border)] pb-5 text-[1.3rem]">関連する商品</h2>
          <div className="mt-10">
            <ProductGrid products={related} brands={brands} categories={categories} />
          </div>
        </section>
      ) : null}

      {articles.length > 0 ? (
        <section className="mt-24">
          <h2 className="border-b border-[var(--color-border)] pb-5 text-[1.3rem]">読みもの</h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {articles.map((article) => (
              <StoryCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
