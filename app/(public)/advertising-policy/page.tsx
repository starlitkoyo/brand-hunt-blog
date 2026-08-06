import type { Metadata } from 'next';
import Link from 'next/link';

import AmazonDisclosure from '@/components/products/AmazonDisclosure';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { PLACEHOLDERS } from '@/lib/site';

export const metadata: Metadata = {
  title: '広告・アフィリエイトポリシー',
  description: '当サイトの広告掲載とアフィリエイトの取り扱いについてご説明します。',
};

export default function AdvertisingPolicyPage() {
  return (
    <div className="u-container pb-20">
      <Breadcrumbs
        items={[{ href: '/', label: 'ホーム' }, { label: '広告・アフィリエイトについて' }]}
      />

      <article className="u-container-text !px-0">
        <p className="u-label">ADVERTISING POLICY</p>
        <h1 className="mt-4 text-[1.9rem] leading-snug lg:text-[2.4rem]">
          広告・アフィリエイトポリシー
        </h1>

        <div className="mt-8 border border-[var(--color-border)] bg-[var(--color-canvas-soft)] p-6">
          <AmazonDisclosure />
        </div>

        <div className="prose-editorial mt-10">
          <h2>アフィリエイトリンクについて</h2>
          <p>
            当サイトの商品リンクは、Amazonアソシエイト・プログラムのリンクです。
            リンクを経由して商品が購入された場合、当サイトに紹介料が発生することがあります。
            購入者の負担が増えることはありません。
          </p>

          <h2>リンクの見分け方</h2>
          <p>Amazonへ移動するリンクには、押す前に分かるよう次の表示をしています。</p>
          <ul>
            <li>ボタン文言に「Amazonで現在の価格を見る」と明記</li>
            <li>移動先で価格・在庫・販売条件を確認する旨の補足</li>
            <li>記事本文中のAmazonリンクには［広告］の表示</li>
          </ul>

          <h2>掲載順と紹介料の関係</h2>
          <p>
            紹介料の有無や料率によって、掲載順や評価を変えることはありません。 掲載の基準は
            <Link href="/editorial-policy">編集方針</Link>のとおりです。
          </p>

          <h2>当サイトの立場</h2>
          <p>
            当サイトは商品の販売者ではありません。売買契約はAmazonおよび各出品者と
            購入者の間で成立します。返品、交換、保証についても移動先の条件が適用されます。
          </p>

          <h2>正式な表示文言について</h2>
          <p>
            Amazonアソシエイト・プログラムが定める表示文言は、公開時点の規約を確認したうえで
            適用します。現時点では次の項目が未確定です。
          </p>
          <p>{PLACEHOLDERS.amazonDisclosure}</p>
        </div>
      </article>
    </div>
  );
}
