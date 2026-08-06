import Image from 'next/image';
import Link from 'next/link';

import ImageFallback from '@/components/ui/ImageFallback';
import { SITE } from '@/lib/site';

type Props = {
  imageUrl: string | null;
  imageAlt: string;
};

/**
 * ファーストビュー。
 * 画像にロゴ・価格・CTA・重要コピーを焼き込まない（テキストは HTML 側に置く）。
 * モバイルでは画像1点とコピーに絞り、主CTAを画面内に収める。
 */
export default function HeroEditorial({ imageUrl, imageAlt }: Props) {
  return (
    <section className="u-container pt-8 pb-16 lg:pt-16 lg:pb-24">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <p className="u-label">{SITE.name}</p>

          <h1 className="mt-5 text-[2rem] leading-[1.4] sm:text-[2.5rem] lg:text-[3.25rem] lg:leading-[1.35]">
            欲しかったものを、
            <br />
            美しく選べる価格で。
          </h1>

          <p className="mt-6 max-w-md text-[0.95rem] leading-[2] text-[var(--color-muted-strong)]">
            Amazonで見つけた、
            <br className="hidden sm:block" />
            今選びたいブランドとセール情報。
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/sale"
              className="inline-flex items-center justify-center border border-[var(--color-ink)] bg-[var(--color-ink)] px-7 py-4 font-[family-name:var(--font-utility)] text-sm tracking-[0.08em] text-[var(--color-white)] transition-colors hover:bg-[var(--color-signal)] hover:border-[var(--color-signal)]"
            >
              最新のセールを見る
            </Link>
            <Link href="/brands" className="u-underline-link u-label !text-[var(--color-ink)]">
              ブランドから探す
            </Link>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          {imageUrl ? (
            <div className="relative aspect-[4/5] sm:aspect-[3/2] lg:aspect-[4/5]">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                priority
                className="object-cover"
              />
            </div>
          ) : (
            <ImageFallback label={imageAlt} ratio="4 / 5" />
          )}
        </div>
      </div>
    </section>
  );
}
