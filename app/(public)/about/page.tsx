import type { Metadata } from 'next';
import Link from 'next/link';

import AmazonDisclosure from '@/components/products/AmazonDisclosure';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { PLACEHOLDERS, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'このサイトについて',
  description: `${SITE.name}の目的と編集方針についてご説明します。`,
};

export default function AboutPage() {
  return (
    <div className="u-container pb-20">
      <Breadcrumbs items={[{ href: '/', label: 'ホーム' }, { label: 'このサイトについて' }]} />

      <article className="u-container-text !px-0">
        <p className="u-label">ABOUT</p>
        <h1 className="mt-4 text-[1.9rem] leading-snug lg:text-[2.5rem]">{SITE.name} について</h1>
        <p className="mt-6 text-[1.05rem] leading-[2]">{SITE.copy}</p>

        <div className="prose-editorial mt-10">
          <h2>{SITE.name} とは</h2>
          <p>
            Amazonにある膨大な商品の中から、価格だけではなく、ブランド、デザイン、品質、用途、
            暮らしへのなじみ方まで考えて紹介するメディアです。値下げ速報ではなく、
            「今、選ぶ価値のあるもの」を編集してお届けします。
          </p>

          <h2>どのように商品を選ぶか</h2>
          <p>
            価格が下がっていることは、掲載する理由のひとつでしかありません。
            長く使えるか、置き場所に困らないか、手入れが続けられるか。
            そうした点を見たうえで掲載を決めています。
          </p>
          <p>
            APIから取得しただけの商品を自動で公開することはありません。
            編集担当が確認したものだけを公開しています。
          </p>

          <h2>価格情報について</h2>
          <p>
            掲載している価格は、当サイトが取得できた時点のものです。
            確認した日時を各商品に表示しています。Amazonの商品ページで価格が変わっていることがあるため、
            購入の前には必ず移動先で最新の価格をご確認ください。
          </p>
          <p>
            価格や参考価格を取得できなかった場合は、推測値を表示せず
            「Amazonで価格を確認」とだけ表示します。割引率も、
            現在価格と比較できる参考価格の両方が確認できたときにのみ表示します。
          </p>

          <h2>Amazonとの関係</h2>
          <p>
            当サイトはAmazon.co.jpの運営者ではありません。商品の販売、発送、返品対応は
            すべてAmazonおよび各出品者が行います。当サイトは商品を紹介する立場です。
          </p>

          <h2>広告・アフィリエイトについて</h2>
          <p>
            当サイトはAmazonアソシエイト・プログラムに参加しています。詳しくは
            <Link href="/advertising-policy">広告・アフィリエイトポリシー</Link>
            をご覧ください。
          </p>

          <h2>記事の更新方針</h2>
          <p>
            記事は公開後も内容を見直します。価格情報の更新日時と、記事本文の更新日時は
            それぞれ別に表示しています。
          </p>

          <h2>運営者情報</h2>
          <p>運営者：{PLACEHOLDERS.operator}</p>
          <p>
            お問い合わせ方法は<Link href="/contact">お問い合わせ</Link>をご覧ください。
          </p>
        </div>

        <div className="mt-12 border-t border-[var(--color-border)] pt-6">
          <AmazonDisclosure />
        </div>
      </article>
    </div>
  );
}
