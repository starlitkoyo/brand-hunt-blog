import type { Metadata } from 'next';

import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { PLACEHOLDERS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: '掲載内容に関するご連絡先です。',
};

/**
 * 問い合わせ方法が未確定のため、実在しない送信処理は作らない。
 * 開発時のみプレースホルダーを表示し、公開前チェックで検出できるようにする。
 */
export default function ContactPage() {
  return (
    <div className="u-container pb-20">
      <Breadcrumbs items={[{ href: '/', label: 'ホーム' }, { label: 'お問い合わせ' }]} />

      <article className="u-container-text !px-0">
        <p className="u-label">CONTACT</p>
        <h1 className="mt-4 text-[1.9rem] leading-snug lg:text-[2.4rem]">お問い合わせ</h1>

        <div className="prose-editorial mt-10">
          <p>掲載内容の誤りのご指摘、掲載についてのご相談は、以下の方法でご連絡ください。</p>
        </div>

        <div className="mt-8 border border-[var(--color-signal)] bg-[var(--color-canvas-soft)] p-6">
          <p className="u-label !text-[var(--color-signal)]">SETUP REQUIRED</p>
          <p className="mt-3 text-sm leading-relaxed">
            お問い合わせ方法が未確定です。公開前に、外部フォームのURLまたはメールアドレスへ
            置き換えてください。
          </p>
          <p className="mt-4 font-[family-name:var(--font-utility)] text-sm">
            {PLACEHOLDERS.contact}
          </p>
        </div>
      </article>
    </div>
  );
}
