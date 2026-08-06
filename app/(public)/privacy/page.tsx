import type { Metadata } from 'next';
import Link from 'next/link';

import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { PLACEHOLDERS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: '当サイトにおける情報の取得と利用についてご説明します。',
};

export default function PrivacyPage() {
  return (
    <div className="u-container pb-20">
      <Breadcrumbs items={[{ href: '/', label: 'ホーム' }, { label: 'プライバシーポリシー' }]} />

      <article className="u-container-text !px-0">
        <p className="u-label">PRIVACY</p>
        <h1 className="mt-4 text-[1.9rem] leading-snug lg:text-[2.4rem]">プライバシーポリシー</h1>

        <div className="prose-editorial mt-10">
          <h2>取得する情報</h2>
          <p>
            当サイトでは、閲覧されたページや利用環境に関する情報を取得する場合があります。
            氏名や住所などの個人を特定できる情報を、閲覧のみで取得することはありません。
          </p>

          <h2>アクセス解析</h2>
          <p>
            アクセス解析サービスの導入は現在検討中です。導入する場合は、
            サービス名と取得する情報の範囲をこのページに追記し、必要な同意取得を行います。
          </p>

          <h2>Cookie</h2>
          <p>
            現時点で、当サイトが独自に広告目的のCookieを設定することはありません。
            外部サービスを導入する場合は、その内容をこのページに追記します。
          </p>

          <h2>外部リンク</h2>
          <p>
            当サイトにはAmazonをはじめとする外部サイトへのリンクがあります。
            移動先での情報の取り扱いについては、各サイトのプライバシーポリシーをご確認ください。
          </p>

          <h2>お問い合わせで取得する情報</h2>
          <p>
            お問い合わせをいただいた場合、返信に必要な範囲で連絡先を利用します。
            返信以外の目的には利用しません。
          </p>

          <h2>保存期間</h2>
          <p>
            取得した情報は、利用目的の達成に必要な期間のみ保存し、不要になった時点で削除します。
          </p>

          <h2>お問い合わせ先</h2>
          <p>
            本ポリシーに関するお問い合わせは、<Link href="/contact">お問い合わせ</Link>
            からご連絡ください。
          </p>
          <p>責任者：{PLACEHOLDERS.privacyOwner}</p>
        </div>
      </article>
    </div>
  );
}
