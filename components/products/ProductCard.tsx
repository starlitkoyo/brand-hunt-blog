import Image from 'next/image';
import Link from 'next/link';

import PriceDisplay from '@/components/products/PriceDisplay';
import ImageFallback from '@/components/ui/ImageFallback';
import type { Brand, Category, Product } from '@/types';

type Props = {
  product: Product;
  brand: Brand | null;
  category: Category | null;
  /** ファーストビューに出るカードだけ優先読み込みする */
  priority?: boolean;
};

/**
 * 一覧用の商品カード。
 * 表示順は 画像 → ブランド → 商品名 → 価格 → 確認日時。
 * hover でしか見えない情報は作らない。
 */
export default function ProductCard({ product, brand, category, priority = false }: Props) {
  return (
    <article className="group flex h-full flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="block overflow-hidden bg-[var(--color-canvas-soft)]"
        tabIndex={-1}
        aria-hidden="true"
      >
        {product.imageUrl ? (
          <div className="relative aspect-[4/5]">
            <Image
              src={product.imageUrl}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 300px"
              priority={priority}
              className="object-cover transition-transform duration-[var(--motion-emphasis)] ease-[var(--ease-enter)] group-hover:scale-[1.02]"
            />
          </div>
        ) : (
          <ImageFallback label={`${brand?.name ?? ''} ${product.title}`} />
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        {brand ? (
          <p className="font-[family-name:var(--font-utility)] text-xs tracking-[0.16em] text-[var(--color-muted-strong)]">
            {brand.name}
          </p>
        ) : null}

        <h3 className="mt-2 text-[1.02rem] leading-relaxed">
          <Link href={`/products/${product.slug}`} className="u-underline-link">
            {product.title}
          </Link>
        </h3>

        {category ? (
          <p className="mt-1 text-xs text-[var(--color-muted)]">{category.name}</p>
        ) : null}

        <div className="mt-auto pt-4">
          <PriceDisplay price={product.price} />
        </div>

        {product.availabilityStatus === 'out_of_stock' ? (
          <p className="mt-3 border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-muted-strong)]">
            現在Amazonで在庫を確認できません
          </p>
        ) : null}
      </div>
    </article>
  );
}
