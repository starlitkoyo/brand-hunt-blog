import Link from 'next/link';

import MobileNavigation from '@/components/layout/MobileNavigation';
import { NAV_ITEMS, SITE } from '@/lib/site';

export default function SiteHeader() {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-canvas)]">
      <div className="u-container flex items-center justify-between gap-6 py-5 lg:py-6">
        <Link href="/" className="shrink-0 leading-none" aria-label={`${SITE.name} トップページ`}>
          <span className="block font-[family-name:var(--font-utility)] text-[0.95rem] font-semibold tracking-[0.26em] lg:text-[1.05rem]">
            {SITE.name}
          </span>
          <span className="mt-1 block font-[family-name:var(--font-display)] text-[0.68rem] tracking-[0.18em] text-[var(--color-muted)]">
            {SITE.nameJa}
          </span>
        </Link>

        <nav aria-label="メインナビゲーション" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="u-underline-link u-label block !text-[var(--color-ink)]"
                >
                  {item.label}
                  <span className="u-visually-hidden">（{item.labelJa}）</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <MobileNavigation />
      </div>
    </header>
  );
}
