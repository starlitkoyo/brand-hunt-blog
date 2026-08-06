import type { Metadata } from 'next';
import Link from 'next/link';

import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { PLACEHOLDERS } from '@/lib/site';

export const metadata: Metadata = {
  title: '編集方針',
  description: 'ブランドと商品の選定基準、価格情報の扱い、記事の更新ルールをまとめています。',
};

export default function EditorialPolicyPage() {
  return (
    <div className="u-container pb-20">
      <Breadcrumbs items={[{ href: '/', label: 'ホーム' }, { label: '編集方針' }]} />

      <article className="u-container-text !px-0">
        <p className="u-label">EDITORIAL POLICY</p>
        <h1 className="mt-4 text-[1.9rem] leading-snug lg:text-[2.4rem]">編集方針</h1>

        <div className="prose-editorial mt-10">
          <h2>ブランドの選定基準</h2>
          <ul>
            <li>Amazonで正規に流通していることを確認できること</li>
            <li>商品情報がAmazonの公式APIから取得できること</li>
            <li>継続して取り扱いがあること</li>
          </ul>
          <p>
            ブランドの歴史、受賞歴、創業年などは、一次資料で確認できたものだけを記載します。
            確認できない情報は書きません。
          </p>

          <h2>商品の選定基準</h2>
          <ul>
            <li>用途がはっきりしていること</li>
            <li>サイズ、素材、容量などの仕様がAmazonの商品情報から確認できること</li>
            <li>編集担当が「今、選ぶ価値がある」と判断できること</li>
          </ul>
          <p>価格が下がっていることは掲載理由のひとつであり、それだけでは掲載しません。</p>

          <h2>価格情報の扱い</h2>
          <ul>
            <li>取得できた価格と、その確認日時だけを表示します</li>
            <li>参考価格が取得できない場合、取り消し線を表示しません</li>
            <li>割引率は、現在価格と比較できる参考価格の両方が確認できたときにのみ表示します</li>
            <li>「通常価格」とは断定せず、Amazon上の定義に合う表記を使います</li>
            <li>確認から時間が経った価格には、その旨を添えます</li>
          </ul>

          <h2>情報の確認日時</h2>
          <p>
            価格情報の確認日時と、記事本文の更新日時は別のものとして表示します。
            混同しないよう、表示上も区別しています。
          </p>

          <h2>記事の更新ルール</h2>
          <p>公開後に状況が変わった場合、記事を更新します。更新した場合は更新日を表示します。</p>

          <h2>広告と編集判断の分離</h2>
          <p>
            当サイトはAmazonアソシエイト・プログラムに参加していますが、
            紹介料の有無で掲載順や評価を変えることはありません。詳しくは
            <Link href="/advertising-policy">広告・アフィリエイトポリシー</Link>
            をご覧ください。
          </p>

          <h2>書かないこと</h2>
          <p>次の内容は、確認できる根拠がない限り記載しません。</p>
          <ul>
            <li>売上順位、No.1、満足度、販売数、在庫数</li>
            <li>口コミの要約、効能、受賞歴</li>
            <li>限定期間、セール終了時刻</li>
            <li>真贋の判定</li>
          </ul>

          <h2>誤りの訂正</h2>
          <p>
            掲載内容に誤りが見つかった場合は、速やかに修正し、必要に応じて記事内に訂正の旨を記載します。
            お気づきの点があれば<Link href="/contact">お問い合わせ</Link>からご連絡ください。
          </p>

          <p>編集責任者：{PLACEHOLDERS.operator}</p>
        </div>
      </article>
    </div>
  );
}
