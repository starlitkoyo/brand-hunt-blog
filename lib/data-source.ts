import { GENERATED_ARTICLES } from '@/data/mock/articles.generated';
import { MOCK_BRANDS, MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/data/mock/catalog';
import { calculateDiscountRate, isAllowedAmazonUrl, resolvePriceDisplayStatus } from '@/lib/format';
import type { Article, Brand, Category, Product, ProductSort } from '@/types';

/**
 * データ取得層。
 *
 * Phase 1 はモックのみ。Phase 2 で Supabase を足すときも、
 * ページ側はこの関数群だけを見ればよい状態を保つ。
 *
 * 環境変数が無くてもアプリを落とさず、モックで動かす。
 */

export function getDataSourceMode(): 'mock' | 'supabase' {
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return hasSupabase ? 'supabase' : 'mock';
}

/** 本番でモックを誤公開しないためのチェック */
export function isMockPubliclyVisible(): boolean {
  return getDataSourceMode() === 'mock' && process.env.NODE_ENV === 'production';
}

/**
 * 商品を表示用に整える。
 * 割引率はここで計算し、条件を満たさなければ null のままにする（捏造しない）。
 */
function hydrate(product: Product): Product {
  const discountRate = calculateDiscountRate(
    product.price.currentPrice,
    product.price.referencePrice,
  );
  const displayStatus = resolvePriceDisplayStatus(
    product.price.currentPrice,
    product.price.confirmedAt,
  );
  return {
    ...product,
    price: { ...product.price, discountRate, displayStatus },
  };
}

const ALL_PRODUCTS: Product[] = MOCK_PRODUCTS.map(hydrate).filter((p) =>
  isAllowedAmazonUrl(p.amazonUrl),
);

// ---------------------------------------------------------------- categories

export async function getCategories(): Promise<Category[]> {
  return MOCK_CATEGORIES.filter((c) => c.isPublished).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return MOCK_CATEGORIES.find((c) => c.id === id) ?? null;
}

// ------------------------------------------------------------------- brands

export async function getBrands(): Promise<Brand[]> {
  return MOCK_BRANDS.filter((b) => b.isPublished).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const brands = await getBrands();
  return brands.find((b) => b.slug === slug) ?? null;
}

export async function getBrandById(id: string): Promise<Brand | null> {
  return MOCK_BRANDS.find((b) => b.id === id) ?? null;
}

/** ブランドごとの掲載件数 */
export async function getBrandProductCounts(): Promise<Record<string, number>> {
  const products = await getPublishedProducts();
  return products.reduce<Record<string, number>>((acc, p) => {
    acc[p.brandId] = (acc[p.brandId] ?? 0) + 1;
    return acc;
  }, {});
}

// ----------------------------------------------------------------- products

/** 公開状態のものだけを返す。draft / review を漏らさない。 */
export async function getPublishedProducts(): Promise<Product[]> {
  return ALL_PRODUCTS.filter((p) => p.publicationStatus === 'published');
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getPublishedProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedProducts(limit = 5): Promise<Product[]> {
  const products = await getPublishedProducts();
  return products
    .filter((p) => p.isFeatured)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);
}

/** 価格が新しく確認できたものから並べる */
export async function getNewPriceDrops(limit = 6): Promise<Product[]> {
  const products = await getPublishedProducts();
  return products
    .filter((p) => p.price.currentPrice !== null && p.price.discountRate !== null)
    .sort((a, b) => {
      const at = Date.parse(a.price.confirmedAt ?? '') || 0;
      const bt = Date.parse(b.price.confirmedAt ?? '') || 0;
      return bt - at || b.priority - a.priority;
    })
    .slice(0, limit);
}

export async function getProductsByCategory(
  categoryId: string,
  limit?: number,
): Promise<Product[]> {
  const products = await getPublishedProducts();
  const filtered = products
    .filter((p) => p.categoryId === categoryId)
    .sort((a, b) => b.priority - a.priority);
  return typeof limit === 'number' ? filtered.slice(0, limit) : filtered;
}

export async function getProductsByBrand(brandId: string, limit?: number): Promise<Product[]> {
  const products = await getPublishedProducts();
  const filtered = products
    .filter((p) => p.brandId === brandId)
    .sort((a, b) => b.priority - a.priority);
  return typeof limit === 'number' ? filtered.slice(0, limit) : filtered;
}

export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  const products = await getPublishedProducts();
  const sameBrand = products.filter((p) => p.brandId === product.brandId && p.id !== product.id);
  const sameCategory = products.filter(
    (p) =>
      p.categoryId === product.categoryId && p.id !== product.id && p.brandId !== product.brandId,
  );
  return [...sameBrand, ...sameCategory].slice(0, limit);
}

/** 一覧の並び替え。割引率順は両方の価格が信頼できるものに限る。 */
export function sortProducts(products: Product[], sort: ProductSort): Product[] {
  const copy = [...products];
  switch (sort) {
    case 'newest':
      return copy.sort(
        (a, b) =>
          (Date.parse(b.price.confirmedAt ?? '') || 0) -
          (Date.parse(a.price.confirmedAt ?? '') || 0),
      );
    case 'price_asc':
      return copy
        .filter((p) => p.price.currentPrice !== null)
        .sort((a, b) => (a.price.currentPrice ?? 0) - (b.price.currentPrice ?? 0))
        .concat(copy.filter((p) => p.price.currentPrice === null));
    case 'price_desc':
      return copy
        .filter((p) => p.price.currentPrice !== null)
        .sort((a, b) => (b.price.currentPrice ?? 0) - (a.price.currentPrice ?? 0))
        .concat(copy.filter((p) => p.price.currentPrice === null));
    case 'discount':
      return copy
        .filter((p) => p.price.discountRate !== null)
        .sort((a, b) => (b.price.discountRate ?? 0) - (a.price.discountRate ?? 0))
        .concat(copy.filter((p) => p.price.discountRate === null));
    case 'editorial':
    default:
      return copy.sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
        const at = Date.parse(a.price.confirmedAt ?? '') || 0;
        const bt = Date.parse(b.price.confirmedAt ?? '') || 0;
        if (at !== bt) return bt - at;
        return b.priority - a.priority;
      });
  }
}

// ----------------------------------------------------------------- articles

export async function getArticles(): Promise<Article[]> {
  return GENERATED_ARTICLES.filter((a) => a.publicationStatus === 'published').sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug) ?? null;
}

export async function getFeaturedArticles(limit = 3): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter((a) => a.isFeatured).slice(0, limit);
}

export async function getArticlesByCategory(categoryId: string, limit = 3): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter((a) => a.categoryId === categoryId).slice(0, limit);
}

export async function getRelatedArticles(slug: string, limit = 2): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter((a) => a.slug !== slug).slice(0, limit);
}

/** 最後に価格を確認できた日時（サイト全体） */
export async function getLastPriceConfirmedAt(): Promise<string | null> {
  const products = await getPublishedProducts();
  const times = products
    .map((p) => p.price.confirmedAt)
    .filter((t): t is string => Boolean(t))
    .map((t) => Date.parse(t))
    .filter((t) => !Number.isNaN(t));
  if (times.length === 0) return null;
  return new Date(Math.max(...times)).toISOString();
}
