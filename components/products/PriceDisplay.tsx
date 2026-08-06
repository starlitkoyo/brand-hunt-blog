import { formatDateTime, formatDiscountRate, formatPrice } from '@/lib/format';
import type { ProductPrice } from '@/types';

type Props = {
  price: ProductPrice;
  size?: 'sm' | 'lg';
};

/**
 * 価格表示の共通コンポーネント。
 *
 * 表示ルール:
 *   - 現在価格が無ければ「Amazonで価格を確認」
 *   - 参考価格が無ければ取り消し線を出さない
 *   - 割引率が無ければ OFF 表示をしない
 *   - 「通常価格」とは断定せず「参考価格」と書く
 *   - 確認日時を必ず添える
 */
export default function PriceDisplay({ price, size = 'sm' }: Props) {
  const current = formatPrice(price.currentPrice, price.currency);
  const reference = formatPrice(price.referencePrice, price.currency);
  const discount = formatDiscountRate(price.discountRate);
  const confirmedAt = formatDateTime(price.confirmedAt);

  const currentClass =
    size === 'lg' ? 'text-[2rem] leading-none lg:text-[2.4rem]' : 'text-[1.25rem] leading-none';

  if (!current) {
    return (
      <div>
        <p
          className={`font-[family-name:var(--font-utility)] ${size === 'lg' ? 'text-lg' : 'text-sm'}`}
        >
          Amazonで現在の価格をご確認ください。
        </p>
        <p className="mt-2 text-xs text-[var(--color-muted)]">
          このサイトでは価格情報を取得できていません。
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span
          className={`font-[family-name:var(--font-utility)] font-semibold tracking-tight ${currentClass}`}
        >
          {current}
        </span>

        {reference && discount ? (
          <>
            <span className="font-[family-name:var(--font-utility)] text-sm text-[var(--color-muted)] line-through">
              {reference}
            </span>
            <span className="font-[family-name:var(--font-utility)] text-sm font-semibold text-[var(--color-signal)]">
              {discount} OFF
            </span>
          </>
        ) : null}
      </div>

      {reference && discount ? (
        <p className="mt-1.5 text-xs text-[var(--color-muted)]">取り消し線はAmazonの参考価格です</p>
      ) : null}

      {confirmedAt ? (
        <p className="mt-2 font-[family-name:var(--font-utility)] text-xs text-[var(--color-muted)]">
          価格確認 {confirmedAt}
          {price.displayStatus === 'stale' ? (
            <span className="mt-1 block text-[var(--color-signal)]">
              価格情報が更新されている可能性があります
            </span>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
