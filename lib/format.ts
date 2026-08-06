import { ALLOWED_AMAZON_HOSTS, PRICE_STALE_AFTER_MS } from '@/lib/site';
import type { PriceDisplayStatus } from '@/types';

/**
 * 価格の表示文字列。取得できていなければ null を返し、
 * 呼び出し側で「Amazonで価格を確認」に切り替える。
 */
export function formatPrice(amount: number | null, currency: string | null): string | null {
  if (amount === null || !Number.isFinite(amount)) return null;
  const code = currency ?? 'JPY';
  try {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: code === 'JPY' ? 0 : 2,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString('ja-JP')}円`;
  }
}

/**
 * 割引率。現在価格と比較可能な参考価格の両方が妥当なときだけ数値を返す。
 * 丸めは表示側の責務なので、ここでは小数のまま返す。
 */
export function calculateDiscountRate(
  currentPrice: number | null,
  referencePrice: number | null,
): number | null {
  if (currentPrice === null || referencePrice === null) return null;
  if (!Number.isFinite(currentPrice) || !Number.isFinite(referencePrice)) return null;
  if (referencePrice <= 0) return null;
  if (currentPrice < 0) return null;
  // 値下がりしていない場合は割引として扱わない
  if (currentPrice >= referencePrice) return null;
  return ((referencePrice - currentPrice) / referencePrice) * 100;
}

/** 表示用に丸める。計算と丸めを分離しておく。 */
export function formatDiscountRate(rate: number | null): string | null {
  if (rate === null || !Number.isFinite(rate)) return null;
  const rounded = Math.floor(rate);
  if (rounded <= 0) return null;
  return `${rounded}%`;
}

/** 価格情報が古いかどうか。 */
export function isPriceStale(confirmedAt: string | null, now: number = Date.now()): boolean {
  if (!confirmedAt) return true;
  const t = Date.parse(confirmedAt);
  if (Number.isNaN(t)) return true;
  return now - t > PRICE_STALE_AFTER_MS;
}

/** 価格の表示状態を決める。 */
export function resolvePriceDisplayStatus(
  currentPrice: number | null,
  confirmedAt: string | null,
  now: number = Date.now(),
): PriceDisplayStatus {
  if (currentPrice === null) return 'unavailable';
  return isPriceStale(confirmedAt, now) ? 'stale' : 'available';
}

/** 日時の表示。時刻まで出すことで「いつ確認した情報か」を明示する。 */
export function formatDateTime(iso: string | null): string | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo',
  }).format(new Date(t));
}

export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone: 'Asia/Tokyo',
  }).format(new Date(t));
}

/** slug の検証。想定外の文字列を URL に使わない。 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 120;
}

/** 文字列から slug を作る。 */
export function toSlug(input: string): string {
  return input
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

/**
 * Amazon へのリンクとして安全かどうか。
 * 許可ホスト以外へは飛ばさない（Open Redirect 対策）。
 */
export function isAllowedAmazonUrl(url: string): boolean {
  if (!url) return false;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol !== 'https:') return false;
  return (ALLOWED_AMAZON_HOSTS as readonly string[]).includes(parsed.hostname.toLowerCase());
}

/** 長いテキストを省略する。 */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(1, max - 1)).trimEnd()}…`;
}
