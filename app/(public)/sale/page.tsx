import type { Metadata } from 'next';

import ProductGrid from '@/components/products/ProductGrid';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SectionHeading from '@/components/ui/SectionHeading';
import { getBrands, getCategories, getPublishedProducts, sortProducts } from '@/lib/data-source';
import type { ProductSort } from '@/types';

export const metadata: Metadata = {
  title: 'セール中の商品',
  description:
    '価格を確認できたブランド商品の一覧です。カテゴリー、ブランド、価格帯で絞り込めます。',
};

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: 'editorial', label: '編集部のおすすめ順' },
  { value: 'newest', label: '価格情報が新しい順' },
  { value: 'price_asc', label: '価格が安い順' },
  { value: 'price_desc', label: '価格が高い順' },
  { value: 'discount', label: '値下げ幅が大きい順' },
];

type SearchParams = Promise<{
  category?: string;
  brand?: string;
  sort?: string;
  q?: string;
  sale?: string;
}>;

export default async function SalePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const [products, brands, categories] = await Promise.all([
    getPublishedProducts(),
    getBrands(),
    getCategories(),
  ]);

  const selectedCategory = categories.find((c) => c.slug === params.category) ?? null;
  const selectedBrand = brands.find((b) => b.slug === params.brand) ?? null;
  const keyword = (params.q ?? '').trim();
  const onSaleOnly = params.sale === '1';
  const sort = (SORT_OPTIONS.find((o) => o.value === params.sort)?.value ??
    'editorial') as ProductSort;

  let filtered = products;
  if (selectedCategory) filtered = filtered.filter((p) => p.categoryId === selectedCategory.id);
  if (selectedBrand) filtered = filtered.filter((p) => p.brandId === selectedBrand.id);
  if (onSaleOnly) filtered = filtered.filter((p) => p.price.discountRate !== null);
  if (keyword) {
    const needle = keyword.toLowerCase();
    filtered = filtered.filter((p) => {
      const brand = brands.find((b) => b.id === p.brandId);
      return (
        p.title.toLowerCase().includes(needle) ||
        (brand?.name.toLowerCase().includes(needle) ?? false)
      );
    });
  }

  const sorted = sortProducts(filtered, sort);
  const isFiltering = Boolean(selectedCategory || selectedBrand || keyword || onSaleOnly);

  const buildHref = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams();
    const base: Record<string, string | undefined> = {
      category: params.category,
      brand: params.brand,
      sort: params.sort,
      q: params.q,
      sale: params.sale,
    };
    for (const [key, value] of Object.entries({ ...base, ...patch })) {
      if (value) next.set(key, value);
    }
    const qs = next.toString();
    return qs ? `/sale?${qs}` : '/sale';
  };

  return (
    <div className="u-container pb-20">
      <Breadcrumbs items={[{ href: '/', label: 'ホーム' }, { label: 'セール' }]} />

      <SectionHeading
        label="SALE"
        title="価格を確認できた商品"
        description="価格と確認日時を取得できたものだけを掲載しています。Amazonの商品ページで最新の価格をご確認ください。"
      />

      {/* フィルター。JS 不要で動くようにリンクで構成する */}
      <div className="mt-8 space-y-5 border-b border-[var(--color-border)] pb-8">
        <form action="/sale" method="get" className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[220px]">
            <label htmlFor="q" className="u-label block">
              キーワード
            </label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={keyword}
              placeholder="商品名・ブランド名"
              className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-white)] px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="sort" className="u-label block">
              並び替え
            </label>
            <select
              id="sort"
              name="sort"
              defaultValue={sort}
              className="mt-2 border border-[var(--color-border)] bg-[var(--color-white)] px-4 py-3 text-sm"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {params.category ? <input type="hidden" name="category" value={params.category} /> : null}
          {params.brand ? <input type="hidden" name="brand" value={params.brand} /> : null}
          {params.sale ? <input type="hidden" name="sale" value={params.sale} /> : null}
          <button
            type="submit"
            className="border border-[var(--color-ink)] bg-[var(--color-ink)] px-6 py-3 font-[family-name:var(--font-utility)] text-sm tracking-[0.08em] text-[var(--color-white)]"
          >
            絞り込む
          </button>
        </form>

        <div>
          <p className="u-label">CATEGORY</p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <li>
              <a
                href={buildHref({ category: null })}
                className={selectedCategory ? 'u-underline-link' : 'font-semibold'}
              >
                すべて
              </a>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <a
                  href={buildHref({ category: category.slug })}
                  className={
                    selectedCategory?.id === category.id ? 'font-semibold' : 'u-underline-link'
                  }
                >
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="u-label">BRAND</p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <li>
              <a
                href={buildHref({ brand: null })}
                className={selectedBrand ? 'u-underline-link' : 'font-semibold'}
              >
                すべて
              </a>
            </li>
            {brands.map((brand) => (
              <li key={brand.id}>
                <a
                  href={buildHref({ brand: brand.slug })}
                  className={selectedBrand?.id === brand.id ? 'font-semibold' : 'u-underline-link'}
                >
                  {brand.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p>
          <a
            href={buildHref({ sale: onSaleOnly ? null : '1' })}
            className={`inline-block border px-4 py-2 text-sm ${
              onSaleOnly
                ? 'border-[var(--color-signal)] bg-[var(--color-signal)] text-[var(--color-white)]'
                : 'border-[var(--color-border)]'
            }`}
          >
            値下げが確認できたものだけ表示
          </a>
        </p>
      </div>

      <p className="mt-8 font-[family-name:var(--font-utility)] text-sm text-[var(--color-muted-strong)]">
        {sorted.length}件
      </p>

      <div className="mt-6">
        <ProductGrid
          products={sorted}
          brands={brands}
          categories={categories}
          emptyTitle={
            isFiltering ? '条件に一致する商品がありません。' : '現在、公開中の商品はありません。'
          }
          emptyDescription={isFiltering ? '条件を変更してお試しください。' : undefined}
        />
      </div>
    </div>
  );
}
