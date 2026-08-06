import Link from 'next/link';

import BrandIndex from '@/components/editorial/BrandIndex';
import CategoryFeature from '@/components/editorial/CategoryFeature';
import EditorialPolicySummary from '@/components/editorial/EditorialPolicySummary';
import FeaturedEdit from '@/components/editorial/FeaturedEdit';
import HeroEditorial from '@/components/editorial/HeroEditorial';
import StoryCard from '@/components/editorial/StoryCard';
import ProductGrid from '@/components/products/ProductGrid';
import EmptyState from '@/components/ui/EmptyState';
import SectionHeading from '@/components/ui/SectionHeading';
import {
  getBrandProductCounts,
  getBrands,
  getCategories,
  getFeaturedArticles,
  getFeaturedProducts,
  getNewPriceDrops,
} from '@/lib/data-source';
import { PLACEHOLDERS } from '@/lib/site';

export default async function HomePage() {
  const [brands, categories, featured, priceDrops, articles, counts] = await Promise.all([
    getBrands(),
    getCategories(),
    getFeaturedProducts(5),
    getNewPriceDrops(4),
    getFeaturedArticles(3),
    getBrandProductCounts(),
  ]);

  const [main, ...subs] = featured;

  return (
    <>
      <HeroEditorial
        imageUrl="/images/mock/hero.svg"
        imageAlt="バッグと日用品を並べた編集イメージ"
      />

      {/* TODAY'S EDIT */}
      <section className="u-container py-16 lg:py-20">
        <SectionHeading
          label="TODAY'S EDIT"
          title="今日の編集"
          description="価格だけでなく、使う場面まで考えて選んだものを置いています。"
          href="/sale"
        />
        <div className="mt-10 m-reveal">
          {main ? (
            <FeaturedEdit main={main} subs={subs} brands={brands} categories={categories} />
          ) : (
            <EmptyState title="現在、公開中の商品はありません。" />
          )}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="u-container py-16 lg:py-20">
        <SectionHeading
          label="CATEGORIES"
          title="カテゴリーから探す"
          href="/categories"
          hrefLabel="一覧を見る"
        />
        <div className="mt-10 m-reveal">
          <CategoryFeature categories={categories} />
        </div>
      </section>

      {/* BRAND INDEX */}
      <section className="u-container py-16 lg:py-20">
        <SectionHeading
          label="BRAND INDEX"
          title="ブランド索引"
          description="ロゴではなく、名前で引けるようにしています。"
          href="/brands"
        />
        <div className="mt-10 m-reveal">
          <BrandIndex brands={brands} counts={counts} />
        </div>
      </section>

      {/* NEW PRICE DROPS */}
      <section className="u-container py-16 lg:py-20">
        <SectionHeading
          label="NEW PRICE DROPS"
          title="価格が動いたもの"
          description="価格と参考価格の両方を確認できたものだけを載せています。"
          href="/sale"
        />
        <div className="mt-10 m-reveal">
          <ProductGrid
            products={priceDrops}
            brands={brands}
            categories={categories}
            emptyTitle="現在、価格の更新を確認できた商品はありません。"
          />
        </div>
      </section>

      {/* SELECTED STORIES */}
      <section className="u-container py-16 lg:py-20">
        <SectionHeading
          label="SELECTED STORIES"
          title="読みもの"
          description="買う前に確認しておきたいことをまとめています。"
          href="/journal"
        />
        <div className="mt-10 grid gap-8 m-reveal lg:grid-cols-3">
          {articles.map((article, index) => (
            <StoryCard key={article.id} article={article} size={index === 0 ? 'lg' : 'sm'} />
          ))}
        </div>
      </section>

      {/* EDITORIAL POLICY */}
      <section className="u-container py-16 lg:py-20">
        <SectionHeading label="EDITORIAL POLICY" title="掲載の基準" />
        <div className="mt-10 m-reveal">
          <EditorialPolicySummary />
        </div>
      </section>

      {/* FOLLOW */}
      <section className="u-container pb-8">
        <div className="border-t border-[var(--color-ink)] pt-10">
          <p className="u-label">FOLLOW</p>
          <h2 className="mt-3 text-[1.4rem] leading-snug lg:text-[1.7rem]">更新のお知らせ</h2>
          <p className="mt-4 max-w-xl text-sm leading-[1.95] text-[var(--color-muted-strong)]">
            メール配信は準備中です。更新のお知らせ方法が決まりしだい、ここでご案内します。
          </p>
          <p className="mt-4 text-xs text-[var(--color-muted)]">SNS: {PLACEHOLDERS.snsUrl}</p>
          <p className="mt-6">
            <Link href="/about" className="u-underline-link u-label !text-[var(--color-ink)]">
              このサイトについて
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
