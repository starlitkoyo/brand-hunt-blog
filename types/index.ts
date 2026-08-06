/**
 * サイト全体で使うドメイン型。
 *
 * 方針:
 *   - 「取得できなかった」ことと「0だった」ことを区別するため、欠損は必ず null にする。
 *   - 価格は最小通貨単位（日本円なら円）の整数で保持し、浮動小数点に依存しない。
 *   - 推測値・計算不能な割引率は持たせない。null のまま表示側で分岐する。
 */

export type Marketplace = 'JP';

/** 商品の公開状態。API から取得しただけのものを自動公開しない。 */
export type PublicationStatus = 'draft' | 'review' | 'published' | 'archived';

/** 価格表示の状態。表示できない理由を型で持つ。 */
export type PriceDisplayStatus =
  | 'available' // 現在価格を表示できる
  | 'unavailable' // 価格を取得できていない
  | 'stale'; // 取得はできているが確認日時が古い

export type AvailabilityStatus = 'in_stock' | 'out_of_stock' | 'unknown';

export type CategorySlug = 'fashion' | 'beauty' | 'home' | 'life-tech';

export interface Category {
  id: string;
  slug: CategorySlug;
  /** 日本語名 */
  name: string;
  /** 欧文名。索引や見出しに使う */
  nameEn: string;
  description: string;
  imageUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  /** 五十音索引に使う。欧文ブランドは null になりうる */
  nameKana: string | null;
  /** 索引の見出し文字（A–Z / あ行 など） */
  indexKey: string;
  description: string;
  websiteUrl: string | null;
  logoUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  /** 開発用のサンプルブランドであることを示す */
  isMock: boolean;
}

export interface ProductPrice {
  currency: string | null;
  /** 現在価格。取得できていなければ null */
  currentPrice: number | null;
  /** 比較対象の価格。API 上で比較に使える定義のものだけ入れる */
  referencePrice: number | null;
  /** 両方が信頼できるときだけ数値が入る */
  discountRate: number | null;
  displayStatus: PriceDisplayStatus;
  /** 価格を最後に確認できた日時（ISO8601） */
  confirmedAt: string | null;
}

export interface Product {
  id: string;
  asin: string;
  marketplace: Marketplace;
  slug: string;
  title: string;
  brandId: string;
  categoryId: string;
  /** 編集部が書いた独自の文章。Amazon の商品説明を転載しない */
  editorialComment: string;
  /** 向いている人 */
  recommendedFor: string[];
  imageUrl: string | null;
  additionalImages: string[];
  amazonUrl: string;
  price: ProductPrice;
  availabilityStatus: AvailabilityStatus;
  publicationStatus: PublicationStatus;
  isFeatured: boolean;
  priority: number;
  apiLastFetchedAt: string | null;
  createdAt: string;
  updatedAt: string;
  isMock: boolean;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** Markdown ではなく、変換済みのブロックで持つ（任意 HTML を描画しないため） */
  body: ArticleBlock[];
  heroImageUrl: string | null;
  categoryId: string | null;
  publicationStatus: PublicationStatus;
  publishedAt: string;
  updatedAt: string;
  isFeatured: boolean;
  /** 記事中で触れている商品 */
  relatedProductIds: string[];
  isMock: boolean;
}

/** 記事本文。許可した種類だけを描画する（XSS 対策） */
export type ArticleBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; spans: InlineSpan[] }
  | { type: 'list'; ordered: boolean; items: InlineSpan[][] }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'quote'; text: string };

export type InlineSpan =
  | { kind: 'text'; text: string }
  | { kind: 'strong'; text: string }
  | { kind: 'link'; text: string; href: string };

/** 商品一覧の絞り込み */
export interface ProductFilterState {
  category: string | null;
  brand: string | null;
  priceMin: number | null;
  priceMax: number | null;
  onSaleOnly: boolean;
  keyword: string;
  sort: ProductSort;
}

export type ProductSort = 'editorial' | 'newest' | 'price_asc' | 'price_desc' | 'discount';

/** 計測イベント。Amazon 側の購入完了はこのサイトのコンバージョンとして扱わない。 */
export type AnalyticsEvent =
  | 'amazon_product_click'
  | 'product_detail_view'
  | 'brand_view'
  | 'category_view'
  | 'article_view'
  | 'newsletter_click'
  | 'contact_click';
