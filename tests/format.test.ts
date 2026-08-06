import { describe, expect, it } from 'vitest';

import {
  calculateDiscountRate,
  formatDiscountRate,
  formatPrice,
  isAllowedAmazonUrl,
  isPriceStale,
  isValidSlug,
  resolvePriceDisplayStatus,
  toSlug,
  truncate,
} from '@/lib/format';

describe('formatPrice', () => {
  it('円を整形する', () => {
    expect(formatPrice(24800, 'JPY')).toBe('￥24,800');
  });

  it('取得できていなければ null', () => {
    expect(formatPrice(null, 'JPY')).toBeNull();
  });

  it('通貨が無くても円として扱う', () => {
    expect(formatPrice(1000, null)).toContain('1,000');
  });

  it('不正な数値は null', () => {
    expect(formatPrice(Number.NaN, 'JPY')).toBeNull();
  });
});

describe('calculateDiscountRate', () => {
  it('値下がりしていれば割引率を返す', () => {
    expect(calculateDiscountRate(7500, 10000)).toBeCloseTo(25);
  });

  it('現在価格が無ければ null', () => {
    expect(calculateDiscountRate(null, 10000)).toBeNull();
  });

  it('参考価格が無ければ null', () => {
    expect(calculateDiscountRate(7500, null)).toBeNull();
  });

  it('参考価格が0以下なら null', () => {
    expect(calculateDiscountRate(7500, 0)).toBeNull();
    expect(calculateDiscountRate(7500, -100)).toBeNull();
  });

  it('値下がりしていなければ null', () => {
    expect(calculateDiscountRate(10000, 10000)).toBeNull();
    expect(calculateDiscountRate(12000, 10000)).toBeNull();
  });

  it('不正な値は null', () => {
    expect(calculateDiscountRate(Number.NaN, 10000)).toBeNull();
  });
});

describe('formatDiscountRate', () => {
  it('切り捨てて表示する', () => {
    expect(formatDiscountRate(29.9)).toBe('29%');
  });

  it('0以下は表示しない', () => {
    expect(formatDiscountRate(0.4)).toBeNull();
    expect(formatDiscountRate(null)).toBeNull();
  });
});

describe('isPriceStale', () => {
  const now = Date.parse('2026-08-07T12:00:00+09:00');

  it('確認日時が無ければ古い扱い', () => {
    expect(isPriceStale(null, now)).toBe(true);
  });

  it('24時間以内なら新しい', () => {
    expect(isPriceStale('2026-08-07T09:00:00+09:00', now)).toBe(false);
  });

  it('24時間を超えたら古い', () => {
    expect(isPriceStale('2026-08-05T09:00:00+09:00', now)).toBe(true);
  });
});

describe('resolvePriceDisplayStatus', () => {
  const now = Date.parse('2026-08-07T12:00:00+09:00');

  it('価格が無ければ unavailable', () => {
    expect(resolvePriceDisplayStatus(null, '2026-08-07T09:00:00+09:00', now)).toBe('unavailable');
  });

  it('新しければ available', () => {
    expect(resolvePriceDisplayStatus(1000, '2026-08-07T09:00:00+09:00', now)).toBe('available');
  });

  it('古ければ stale', () => {
    expect(resolvePriceDisplayStatus(1000, '2026-08-01T09:00:00+09:00', now)).toBe('stale');
  });
});

describe('slug', () => {
  it('妥当な slug を通す', () => {
    expect(isValidSlug('amazon-brand-hanbaimoto')).toBe(true);
  });

  it('大文字や記号は弾く', () => {
    expect(isValidSlug('Amazon_Brand')).toBe(false);
    expect(isValidSlug('../etc/passwd')).toBe(false);
    expect(isValidSlug('')).toBe(false);
  });

  it('文字列から slug を作る', () => {
    expect(toSlug('Atelier Nove トート')).toBe('atelier-nove');
  });
});

describe('isAllowedAmazonUrl', () => {
  it('許可ホストの https を通す', () => {
    expect(isAllowedAmazonUrl('https://www.amazon.co.jp/dp/B01')).toBe(true);
  });

  it('別ドメインは通さない', () => {
    expect(isAllowedAmazonUrl('https://evil.example.com/www.amazon.co.jp')).toBe(false);
  });

  it('http は通さない', () => {
    expect(isAllowedAmazonUrl('http://www.amazon.co.jp/dp/B01')).toBe(false);
  });

  it('壊れたURLは通さない', () => {
    expect(isAllowedAmazonUrl('not a url')).toBe(false);
    expect(isAllowedAmazonUrl('')).toBe(false);
  });
});

describe('truncate', () => {
  it('短ければそのまま', () => {
    expect(truncate('あいう', 10)).toBe('あいう');
  });

  it('長ければ省略する', () => {
    expect(truncate('あいうえおかきくけこ', 5)).toBe('あいうえ…');
  });
});
