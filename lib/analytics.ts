import type { AnalyticsEvent } from '@/types';

/**
 * 計測の入口。
 * 計測サービスが未選定のため、ベンダー固有コードは埋め込まない。
 * 後から GA4 などへ接続できるよう、関数だけ用意しておく。
 */
export function trackEvent(event: AnalyticsEvent, payload: Record<string, unknown> = {}): void {
  if (process.env.NODE_ENV === 'development') {
    console.info('[analytics]', event, payload);
  }
  // TODO: 計測サービス選定後にここへ接続する（{{要確認: アクセス解析サービス}}）
}
