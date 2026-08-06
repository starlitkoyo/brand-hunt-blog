import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="u-container py-24 text-center">
      <p className="u-label">404</p>
      <h1 className="mt-4 text-[1.8rem] leading-snug lg:text-[2.2rem]">
        ページが見つかりませんでした
      </h1>
      <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[var(--color-muted-strong)]">
        URLが変更されたか、削除された可能性があります。
      </p>
      <p className="mt-8">
        <Link href="/" className="u-underline-link u-label !text-[var(--color-ink)]">
          トップページへ戻る
        </Link>
      </p>
    </div>
  );
}
