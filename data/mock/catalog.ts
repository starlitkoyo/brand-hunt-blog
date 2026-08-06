import type { Brand, Category, Product } from '@/types';

/**
 * 開発用のサンプルデータ。
 *
 * - ブランドはすべて架空。実在ブランドの価格・割引率を捏造しない。
 * - 価格はサンプル値であり、すべて isMock: true を持つ。
 * - 本番ビルドでは lib/data-source.ts のチェックにより公開されない。
 */

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-fashion',
    slug: 'fashion',
    name: 'ファッション',
    nameEn: 'FASHION',
    description:
      'バッグ、財布、靴、アクセサリー。長く使えるかどうかを基準に、素材と仕立てを見て選んでいます。',
    imageUrl: '/images/mock/cat-fashion.webp',
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: 'cat-beauty',
    slug: 'beauty',
    name: 'ビューティー',
    nameEn: 'BEAUTY',
    description:
      'コスメ、スキンケア、フレグランス、美容家電。使い続けられる価格かどうかも一緒に考えます。',
    imageUrl: '/images/mock/cat-beauty.webp',
    sortOrder: 2,
    isPublished: true,
  },
  {
    id: 'cat-home',
    slug: 'home',
    name: 'インテリア',
    nameEn: 'HOME',
    description: '照明、収納、テーブルウェア。部屋になじむかどうかを、色と大きさから見ています。',
    imageUrl: '/images/mock/cat-home.webp',
    sortOrder: 3,
    isPublished: true,
  },
  {
    id: 'cat-life-tech',
    slug: 'life-tech',
    name: '女性向け家電',
    nameEn: 'LIFE TECH',
    description:
      'ドライヤー、ヘアアイロン、キッチン家電。毎日さわるものなので、重さと手入れのしやすさを重視します。',
    imageUrl: '/images/mock/cat-life-tech.webp',
    sortOrder: 4,
    isPublished: true,
  },
];

export const MOCK_BRANDS: Brand[] = [
  {
    id: 'brand-atelier-nove',
    slug: 'atelier-nove',
    name: 'Atelier Nove',
    nameKana: 'アトリエノーヴェ',
    indexKey: 'A',
    description:
      '装飾を削いだ形と、厚みのある革を組み合わせるバッグの作り手。開発用のサンプルブランドです。',
    websiteUrl: null,
    logoUrl: null,
    isFeatured: true,
    isPublished: true,
    isMock: true,
  },
  {
    id: 'brand-maison-lueur',
    slug: 'maison-lueur',
    name: 'Maison Lueur',
    nameKana: 'メゾンリュエール',
    indexKey: 'M',
    description: '革小物を中心に、光沢を抑えた仕上げで知られる。開発用のサンプルブランドです。',
    websiteUrl: null,
    logoUrl: null,
    isFeatured: true,
    isPublished: true,
    isMock: true,
  },
  {
    id: 'brand-calma-objects',
    slug: 'calma-objects',
    name: 'Calma Objects',
    nameKana: 'カルマオブジェクツ',
    indexKey: 'C',
    description:
      '住まいの道具を、静かな色で揃えるインテリアブランド。開発用のサンプルブランドです。',
    websiteUrl: null,
    logoUrl: null,
    isFeatured: false,
    isPublished: true,
    isMock: true,
  },
  {
    id: 'brand-neri-beauty',
    slug: 'neri-beauty',
    name: 'Neri Beauty',
    nameKana: 'ネリビューティー',
    indexKey: 'N',
    description: '香りを控えめにしたスキンケアと美容小物のブランド。開発用のサンプルブランドです。',
    websiteUrl: null,
    logoUrl: null,
    isFeatured: true,
    isPublished: true,
    isMock: true,
  },
  {
    id: 'brand-studio-aube',
    slug: 'studio-aube',
    name: 'Studio Aube',
    nameKana: 'ストゥディオオーブ',
    indexKey: 'S',
    description:
      '生活家電を、置いたままでも気にならない形に整える設計チーム。開発用のサンプルブランドです。',
    websiteUrl: null,
    logoUrl: null,
    isFeatured: false,
    isPublished: true,
    isMock: true,
  },
];

const NOW = '2026-08-07T09:00:00+09:00';

type MockProductSeed = {
  slug: string;
  title: string;
  brandId: string;
  categoryId: string;
  editorialComment: string;
  recommendedFor: string[];
  currentPrice: number | null;
  referencePrice: number | null;
  isFeatured?: boolean;
  priority?: number;
  availabilityStatus?: Product['availabilityStatus'];
  confirmedAt?: string | null;
  image: string;
};

const SEEDS: MockProductSeed[] = [
  // ---------------- FASHION ----------------
  {
    slug: 'atelier-nove-structured-tote',
    title: 'ストラクチャード トートバッグ A4対応',
    brandId: 'brand-atelier-nove',
    categoryId: 'cat-fashion',
    editorialComment:
      '底の芯がしっかりしているので、荷物が少ない日でも形が崩れません。ヨコ34cmでA4が余裕をもって入ります。',
    recommendedFor: ['通勤で書類を持ち歩く人', '自立するバッグを探している人'],
    currentPrice: 24800,
    referencePrice: 33000,
    isFeatured: true,
    priority: 10,
    image: '/images/mock/product-bag-a.webp',
  },
  {
    slug: 'maison-lueur-compact-wallet',
    title: 'コンパクト二つ折り財布 カード8枚',
    brandId: 'brand-maison-lueur',
    categoryId: 'cat-fashion',
    editorialComment:
      'カードポケットが8枚ぶん。小銭入れがボックス型で開きが大きく、レジ前で慌てにくい作りです。',
    recommendedFor: ['財布を小さくしたい人', 'カードを8枚前後持ち歩く人'],
    currentPrice: 13200,
    referencePrice: 17600,
    priority: 8,
    image: '/images/mock/product-wallet-a.webp',
  },
  {
    slug: 'atelier-nove-shoulder-mini',
    title: 'ミニショルダーバッグ 斜めがけ',
    brandId: 'brand-atelier-nove',
    categoryId: 'cat-fashion',
    editorialComment:
      'ストラップの長さが2段階。肩掛けと斜めがけを切り替えられるので、コートの上からでも使えます。',
    recommendedFor: ['荷物が少ない日が多い人', '休日用の小さいバッグを探している人'],
    currentPrice: 16500,
    referencePrice: null,
    priority: 6,
    image: '/images/mock/product-bag-b.webp',
  },
  {
    slug: 'maison-lueur-leather-key-case',
    title: 'レザーキーケース 4連',
    brandId: 'brand-maison-lueur',
    categoryId: 'cat-fashion',
    editorialComment:
      '自分では買い替えないものなので、贈りものにも向きます。厚みが出にくい4連のつくりです。',
    recommendedFor: ['贈りものを探している人', '鍵をまとめたい人'],
    currentPrice: 6800,
    referencePrice: 8800,
    priority: 4,
    image: '/images/mock/product-small-a.webp',
  },

  // ---------------- BEAUTY ----------------
  {
    slug: 'neri-beauty-serum-30ml',
    title: '保湿セラム 30mL 無香料',
    brandId: 'brand-neri-beauty',
    categoryId: 'cat-beauty',
    editorialComment:
      '香りがほとんどないので、香水を使う日でも重なりません。ポンプ式で最後まで出しやすい容器です。',
    recommendedFor: ['香りが苦手な人', '朝のスキンケアを短くしたい人'],
    currentPrice: 4980,
    referencePrice: 6600,
    isFeatured: true,
    priority: 9,
    image: '/images/mock/product-beauty-a.webp',
  },
  {
    slug: 'neri-beauty-cleansing-balm',
    title: 'クレンジングバーム 90g',
    brandId: 'brand-neri-beauty',
    categoryId: 'cat-beauty',
    editorialComment:
      '固さがちょうどよく、手のひらで溶けるまでが早いタイプ。詰め替えが用意されています。',
    recommendedFor: ['メイク落としに時間をかけたくない人'],
    currentPrice: 3520,
    referencePrice: 4400,
    priority: 5,
    image: '/images/mock/product-beauty-b.webp',
  },
  {
    slug: 'studio-aube-facial-steamer',
    title: 'フェイシャルスチーマー 卓上',
    brandId: 'brand-studio-aube',
    categoryId: 'cat-beauty',
    editorialComment:
      'タンクが上から開くので、水を入れるのが億劫になりにくい形です。動作音は控えめでした。',
    recommendedFor: ['夜のスキンケアを習慣にしたい人'],
    currentPrice: null,
    referencePrice: null,
    priority: 3,
    availabilityStatus: 'unknown',
    confirmedAt: null,
    image: '/images/mock/product-beauty-c.webp',
  },
  {
    slug: 'maison-lueur-fragrance-mist',
    title: 'フレグランスミスト 100mL',
    brandId: 'brand-maison-lueur',
    categoryId: 'cat-beauty',
    editorialComment:
      '香りの立ち上がりがおだやかで、オフィスでも使いやすい濃度です。持ち歩ける大きさ。',
    recommendedFor: ['強い香りが苦手な人', '衣類にも使いたい人'],
    currentPrice: 5280,
    referencePrice: 6600,
    priority: 4,
    image: '/images/mock/product-beauty-d.webp',
  },

  // ---------------- HOME ----------------
  {
    slug: 'calma-objects-table-lamp',
    title: 'テーブルランプ 調光3段階',
    brandId: 'brand-calma-objects',
    categoryId: 'cat-home',
    editorialComment:
      '光がまっすぐ下に落ちるので、手元を照らす用途に向きます。真上から見ても眩しくありません。',
    recommendedFor: ['寝室に間接照明を足したい人', '読書灯を探している人'],
    currentPrice: 12800,
    referencePrice: 16800,
    isFeatured: true,
    priority: 9,
    image: '/images/mock/product-home-a.webp',
  },
  {
    slug: 'calma-objects-stoneware-plate-set',
    title: 'ストーンウェア プレート 4枚組',
    brandId: 'brand-calma-objects',
    categoryId: 'cat-home',
    editorialComment:
      '直径22cmで、主菜にも取り分けにも使える中間の大きさ。重ねたときの高さが低く収納しやすいです。',
    recommendedFor: ['食器を減らしたい人', '来客用を兼ねたい人'],
    currentPrice: 8800,
    referencePrice: 11000,
    priority: 6,
    image: '/images/mock/product-home-b.webp',
  },
  {
    slug: 'calma-objects-linen-storage-box',
    title: 'リネン収納ボックス 2個組',
    brandId: 'brand-calma-objects',
    categoryId: 'cat-home',
    editorialComment:
      '使わないときは畳めます。棚の上に置いたままでも生活感が出にくい色を選びました。',
    recommendedFor: ['出しっぱなしになりがちな小物をまとめたい人'],
    currentPrice: 4400,
    referencePrice: null,
    priority: 3,
    image: '/images/mock/product-home-c.webp',
  },
  {
    slug: 'studio-aube-wall-clock',
    title: '掛け時計 連続秒針',
    brandId: 'brand-studio-aube',
    categoryId: 'cat-home',
    editorialComment: '秒針の音がしないタイプ。寝室やワークスペースに向きます。文字盤は無地です。',
    recommendedFor: ['時計の音が気になる人'],
    currentPrice: 6600,
    referencePrice: 8250,
    priority: 4,
    image: '/images/mock/product-home-d.webp',
  },

  // ---------------- LIFE TECH ----------------
  {
    slug: 'studio-aube-hair-dryer',
    title: 'ヘアドライヤー 大風量 折りたたみ',
    brandId: 'brand-studio-aube',
    categoryId: 'cat-life-tech',
    editorialComment:
      '本体が軽く、腕が疲れにくい重さです。折りたためるので旅行にも持っていけます。',
    recommendedFor: ['髪を乾かす時間を短くしたい人', '出張や旅行が多い人'],
    currentPrice: 15800,
    referencePrice: 21800,
    isFeatured: true,
    priority: 10,
    image: '/images/mock/product-tech-a.webp',
  },
  {
    slug: 'studio-aube-straight-iron',
    title: 'ストレートアイロン 25mm',
    brandId: 'brand-studio-aube',
    categoryId: 'cat-life-tech',
    editorialComment:
      '立ち上がりが早く、朝に使いやすいタイプ。プレートの幅は25mmで前髪にも使えます。',
    recommendedFor: ['朝の支度を短くしたい人'],
    currentPrice: 8980,
    referencePrice: 11800,
    priority: 7,
    image: '/images/mock/product-tech-b.webp',
  },
  {
    slug: 'studio-aube-electric-kettle',
    title: '電気ケトル 温度調節つき 0.8L',
    brandId: 'brand-studio-aube',
    categoryId: 'cat-life-tech',
    editorialComment:
      '注ぎ口が細く、湯量を調整しやすい形。温度を5度きざみで設定できます。容量は0.8Lです。',
    recommendedFor: ['コーヒーや紅茶をよく淹れる人'],
    currentPrice: 9900,
    referencePrice: 12800,
    priority: 6,
    image: '/images/mock/product-tech-c.webp',
  },
  {
    slug: 'studio-aube-humidifier',
    title: '加湿器 上から給水 4.5L',
    brandId: 'brand-studio-aube',
    categoryId: 'cat-life-tech',
    editorialComment:
      '上から水を注げるので、タンクを外して運ぶ手間がありません。手入れする部品が少ない構造です。',
    recommendedFor: ['手入れの手間を減らしたい人', '寝室で使いたい人'],
    currentPrice: 11800,
    referencePrice: 14800,
    priority: 5,
    availabilityStatus: 'out_of_stock',
    image: '/images/mock/product-tech-d.webp',
  },
];

export const MOCK_PRODUCTS: Product[] = SEEDS.map((seed, index) => {
  const asin = `B0MOCK${String(index + 1).padStart(4, '0')}`;
  return {
    id: `product-${seed.slug}`,
    asin,
    marketplace: 'JP',
    slug: seed.slug,
    title: seed.title,
    brandId: seed.brandId,
    categoryId: seed.categoryId,
    editorialComment: seed.editorialComment,
    recommendedFor: seed.recommendedFor,
    imageUrl: seed.image,
    additionalImages: [],
    // サンプルのため実在しないASIN。本番は API の detailPageURL を使う。
    amazonUrl: `https://www.amazon.co.jp/dp/${asin}`,
    price: {
      currency: 'JPY',
      currentPrice: seed.currentPrice,
      referencePrice: seed.referencePrice,
      // discountRate は data-source 側で計算する（捏造しない）
      discountRate: null,
      displayStatus: 'available',
      confirmedAt: seed.confirmedAt === undefined ? NOW : seed.confirmedAt,
    },
    availabilityStatus: seed.availabilityStatus ?? 'in_stock',
    publicationStatus: 'published',
    isFeatured: seed.isFeatured ?? false,
    priority: seed.priority ?? 1,
    apiLastFetchedAt: NOW,
    createdAt: '2026-08-01T09:00:00+09:00',
    updatedAt: NOW,
    isMock: true,
  } satisfies Product;
});
