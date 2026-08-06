import Image from 'next/image';
import Link from 'next/link';

import ImageFallback from '@/components/ui/ImageFallback';
import type { Category } from '@/types';

type Props = {
  categories: Category[];
};

/** 同一カードを並べず、写真比率と文字サイズに差をつける。 */
export default function CategoryFeature({ categories }: Props) {
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {categories.map((category, index) => {
        const isLead = index < 2;
        const span = isLead ? 'lg:col-span-6' : 'lg:col-span-3';
        const ratio = isLead ? '16 / 10' : '3 / 4';

        return (
          <article key={category.id} className={span}>
            <Link href={`/categories/${category.slug}`} className="group block">
              <div className="overflow-hidden bg-[var(--color-canvas-soft)]">
                {category.imageUrl ? (
                  <div className="relative" style={{ aspectRatio: ratio }}>
                    <Image
                      src={category.imageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 640px"
                      className="object-cover transition-transform duration-[var(--motion-emphasis)] ease-[var(--ease-enter)] group-hover:scale-[1.02]"
                    />
                  </div>
                ) : (
                  <ImageFallback label={category.name} ratio={ratio} />
                )}
              </div>

              <p className="u-label mt-5">{category.nameEn}</p>
              <h3
                className={`mt-2 leading-snug ${
                  isLead ? 'text-[1.6rem] lg:text-[2rem]' : 'text-[1.15rem] lg:text-[1.3rem]'
                }`}
              >
                <span className="u-underline-link">{category.name}</span>
              </h3>
              <p className="mt-3 max-w-md text-sm leading-[1.95] text-[var(--color-muted-strong)]">
                {category.description}
              </p>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
