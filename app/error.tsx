'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/** 公開画面には詳細なエラー内容を出さない。 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // 詳細はサーバー側のログで確認する
  }, []);

  return (
    <div className="u-container py-24 text-center">
      <p className="u-label">ERROR</p>
      <h1 className="mt-4 text-[1.8rem] leading-snug lg:text-[2.2rem]">
        情報を読み込めませんでした
      </h1>
      <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[var(--color-muted-strong)]">
        時間をおいて再度お試しください。
      </p>
      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={reset}
          className="border border-[var(--color-ink)] px-6 py-3 font-[family-name:var(--font-utility)] text-sm tracking-[0.08em]"
        >
          再読み込み
        </button>
        <Link href="/" className="u-underline-link u-label !text-[var(--color-ink)]">
          トップページへ
        </Link>
      </div>
    </div>
  );
}
