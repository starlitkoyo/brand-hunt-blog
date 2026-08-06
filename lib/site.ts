/** サイト全体の定数。未確定事項はプレースホルダーとして残す。 */

export const SITE = {
  /** 欧文のワードマーク。ドメイン lunabrandhunt.com と一致させる */
  name: 'LUNA BRAND HUNT',
  nameJa: 'ルナのブランド巡回ノート',
  copy: 'いいものを、いい価格で。',
  description: 'Amazonで見つけるブランドセールと、大人のためのショッピングノート。',
  /** 本番URL。未設定なら canonical を出力しない（架空のURLを出さない） */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? null,
} as const;

/** 公開前に置換が必要な項目。ビルド前チェックで検出する。 */
export const PLACEHOLDERS = {
  operator: '{{要確認: 運営者名}}',
  contact: '{{要確認: お問い合わせ方法}}',
  privacyOwner: '{{要確認: プライバシーポリシー責任者}}',
  amazonDisclosure: '{{要確認: Amazonアソシエイト指定表示}}',
  snsUrl: '{{要確認: SNS URL}}',
} as const;

export const NAV_ITEMS = [
  { href: '/sale', label: 'SALE', labelJa: 'セール' },
  { href: '/brands', label: 'BRANDS', labelJa: 'ブランド' },
  { href: '/categories', label: 'CATEGORIES', labelJa: 'カテゴリー' },
  { href: '/journal', label: 'JOURNAL', labelJa: '読みもの' },
  { href: '/about', label: 'ABOUT', labelJa: 'このサイトについて' },
] as const;

export const FOOTER_LINKS = [
  { href: '/about', label: 'このサイトについて' },
  { href: '/editorial-policy', label: '編集方針' },
  { href: '/advertising-policy', label: '広告・アフィリエイトについて' },
  { href: '/privacy', label: 'プライバシーポリシー' },
  { href: '/contact', label: 'お問い合わせ' },
] as const;

/**
 * Amazonアソシエイトの表示。
 * 正式な指定文言は公開時点の規約を確認し、ユーザーが承認したものへ差し替える。
 * 現時点では「規約準拠済み」とは断定しない。
 */
export const AMAZON_DISCLOSURE =
  '当サイトは、Amazonアソシエイト・プログラムに参加しています。記事内のリンクから購入された場合、当サイトに紹介料が発生することがあります。';

export const AMAZON_LINK_NOTE =
  'Amazonの商品ページへ移動します。価格・在庫・販売条件は移動先でご確認ください。';

/** 価格情報が古いとみなす時間（ミリ秒）。24時間。 */
export const PRICE_STALE_AFTER_MS = 24 * 60 * 60 * 1000;

/** Amazonへのリンクとして許可するホスト。Open Redirect 対策。 */
export const ALLOWED_AMAZON_HOSTS = ['www.amazon.co.jp', 'amazon.co.jp', 'amzn.to'] as const;
