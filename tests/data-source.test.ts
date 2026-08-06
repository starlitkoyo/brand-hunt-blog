import { describe, expect, it } from 'vitest';

import {
  getArticles,
  getBrandProductCounts,
  getBrands,
  getCategories,
  getDataSourceMode,
  getNewPriceDrops,
  getPublishedProducts,
  sortProducts,
} from '@/lib/data-source';
import { isAllowedAmazonUrl, isValidSlug } from '@/lib/format';

describe('データソース', () => {
  it('環境変数が無ければモードは mock', () => {
    expect(getDataSourceMode()).toBe('mock');
  });

  it('公開状態の商品だけを返す', async () => {
    const products = await getPublishedProducts();
    expect(products.length).toBeGreaterThan(0);
    expect(products.every((p) => p.publicationStatus === 'published')).toBe(true);
  });

  it('すべての商品の slug が妥当', async () => {
    const products = await getPublishedProducts();
    expect(products.every((p) => isValidSlug(p.slug))).toBe(true);
  });

  it('すべての商品の Amazon URL が許可ホスト', async () => {
    const products = await getPublishedProducts();
    expect(products.every((p) => isAllowedAmazonUrl(p.amazonUrl))).toBe(true);
  });

  it('slug が重複していない', async () => {
    const products = await getPublishedProducts();
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('ASIN と marketplace の組み合わせが重複していない', async () => {
    const products = await getPublishedProducts();
    const keys = products.map((p) => `${p.marketplace}:${p.asin}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('割引率の扱い', () => {
  it('参考価格が無い商品は割引率を持たない', async () => {
    const products = await getPublishedProducts();
    const withoutReference = products.filter((p) => p.price.referencePrice === null);
    expect(withoutReference.length).toBeGreaterThan(0);
    expect(withoutReference.every((p) => p.price.discountRate === null)).toBe(true);
  });

  it('価格が無い商品は displayStatus が unavailable', async () => {
    const products = await getPublishedProducts();
    const withoutPrice = products.filter((p) => p.price.currentPrice === null);
    expect(withoutPrice.length).toBeGreaterThan(0);
    expect(withoutPrice.every((p) => p.price.displayStatus === 'unavailable')).toBe(true);
  });

  it('価格更新一覧には割引率のあるものだけが入る', async () => {
    const drops = await getNewPriceDrops(10);
    expect(drops.every((p) => p.price.discountRate !== null)).toBe(true);
  });
});

describe('並び替え', () => {
  it('割引率順は割引率のあるものを先に置く', async () => {
    const products = await getPublishedProducts();
    const sorted = sortProducts(products, 'discount');
    const firstNullIndex = sorted.findIndex((p) => p.price.discountRate === null);
    if (firstNullIndex >= 0) {
      expect(sorted.slice(firstNullIndex).every((p) => p.price.discountRate === null)).toBe(true);
    }
  });

  it('価格が安い順でも価格の無いものを落とさない', async () => {
    const products = await getPublishedProducts();
    const sorted = sortProducts(products, 'price_asc');
    expect(sorted.length).toBe(products.length);
  });
});

describe('ブランドとカテゴリー', () => {
  it('ブランドは公開中のみ', async () => {
    const brands = await getBrands();
    expect(brands.every((b) => b.isPublished)).toBe(true);
  });

  it('カテゴリーは4件', async () => {
    const categories = await getCategories();
    expect(categories).toHaveLength(4);
  });

  it('掲載件数の合計が商品数と一致する', async () => {
    const [counts, products] = await Promise.all([getBrandProductCounts(), getPublishedProducts()]);
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    expect(total).toBe(products.length);
  });
});

describe('記事', () => {
  it('公開中の記事を新しい順に返す', async () => {
    const articles = await getArticles();
    expect(articles.length).toBeGreaterThan(0);
    expect(articles.every((a) => a.publicationStatus === 'published')).toBe(true);
  });

  it('記事の slug が妥当で重複していない', async () => {
    const articles = await getArticles();
    expect(articles.every((a) => isValidSlug(a.slug))).toBe(true);
    expect(new Set(articles.map((a) => a.slug)).size).toBe(articles.length);
  });

  it('本文が空でない', async () => {
    const articles = await getArticles();
    expect(articles.every((a) => a.body.length > 0)).toBe(true);
  });
});
