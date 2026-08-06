import Image from 'next/image';
import Link from 'next/link';

import PriceDisplay from '@/components/products/PriceDisplay';
import ImageFallback from '@/components/ui/ImageFallback';
import type { Brand, Category, Product } from '@/types';

type Props = {
  main: Product;
  subs: Product[];
  brands: Brand[];
  categories: Category[];
};

/**
 * 注目の編集枠。
 * 同じ大きさのカードを並べず、メインを明確に大きくする。
 */
export default function FeaturedEdit({ main, subs, brands, categories }: Props) {
  const brandOf = (p: Product) => brands.find((b) => b.id === p.brandId) ?? null;
  const categoryOf = (p: Product) => categories.find((c) => c.id === p.categoryId) ?? null;
  const mainBrand = brandOf(main);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
      <article>
        <Link href={`/products/${main.slug}`} className="block bg-[var(--color-canvas-soft)]">
          {main.imageUrl ? (
            <div className="relative aspect-[16/11]">
              <Image
                src={main.imageUrl}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 760px"
                className="object-cover"
              />
            </div>
          ) : (
            <ImageFallback label={main.title} ratio="16 / 11" />
          )}
        </Link>

        <div className="mt-6">
          {mainBrand ? (
            <p className="font-[family-name:var(--font-utility)] text-xs tracking-[0.18em] text-[var(--color-muted-strong)]">
              {mainBrand.name}
            </p>
          ) : null}
          <h3 className="mt-3 text-[1.5rem] leading-snug lg:text-[1.8rem]">
            <Link href={`/products/${main.slug}`} className="u-underline-link">
              {main.title}
            </Link>
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-[2] text-[var(--color-muted-strong)]">
            {main.editorialComment}
          </p>
          <div className="mt-5">
            <PriceDisplay price={main.price} size="lg" />
          </div>
        </div>
      </article>

      <div className="flex flex-col divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
        {subs.map((product) => {
          const brand = brandOf(product);
          const category = categoryOf(product);
          return (
            <article key={product.id} className="flex gap-5 py-6">
              <Link
                href={`/products/${product.slug}`}
                className="w-24 shrink-0 bg-[var(--color-canvas-soft)] sm:w-28"
                tabIndex={-1}
                aria-hidden="true"
              >
                {product.imageUrl ? (
                  <div className="relative aspect-square">
                    <Image
                      src={product.imageUrl}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <ImageFallback label={product.title} ratio="1 / 1" />
                )}
              </Link>

              <div className="min-w-0 flex-1">
                {brand ? (
                  <p className="font-[family-name:var(--font-utility)] text-[0.68rem] tracking-[0.16em] text-[var(--color-muted-strong)]">
                    {brand.name}
                  </p>
                ) : null}
                <h4 className="mt-1.5 text-[0.98rem] leading-relaxed">
                  <Link href={`/products/${product.slug}`} className="u-underline-link">
                    {product.title}
                  </Link>
                </h4>
                {category ? (
                  <p className="mt-1 text-xs text-[var(--color-muted)]">{category.name}</p>
                ) : null}
                <div className="mt-3">
                  <PriceDisplay price={product.price} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
