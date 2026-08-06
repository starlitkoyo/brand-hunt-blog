import { describe, expect, it } from 'vitest';

import { getPublishedProducts } from '@/lib/data-source';

/**
 * サンプルデータを本番で誤って外部公開しないための安全網。
 * 実在しないASINへのリンクをAmazonの審査担当が踏むことを防ぐ。
 */
describe('サンプル商品の安全性', () => {
  it('サンプル商品はすべて isMock フラグを持つ', async () => {
    const products = await getPublishedProducts();
    const mockAsins = products.filter((p) => p.asin.startsWith('B0MOCK'));
    expect(mockAsins.length).toBeGreaterThan(0);
    expect(mockAsins.every((p) => p.isMock)).toBe(true);
  });

  it('isMock でない商品に B0MOCK の ASIN が混ざっていない', async () => {
    const products = await getPublishedProducts();
    const real = products.filter((p) => !p.isMock);
    expect(real.every((p) => !p.asin.startsWith('B0MOCK'))).toBe(true);
  });
});
