import Link from 'next/link';

import AmazonDisclosure from '@/components/products/AmazonDisclosure';
import { FOOTER_LINKS, NAV_ITEMS, SITE } from '@/lib/site';

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)] bg-[var(--color-canvas-soft)]">
      <div className="u-container grid gap-12 py-14 lg:grid-cols-[1.2fr_1fr_1fr] lg:py-16">
        <div>
          <p className="font-[family-name:var(--font-utility)] text-base font-semibold tracking-[0.24em]">
            THE BRAND EDIT
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-sm tracking-[0.16em] text-[var(--color-muted)]">
            ブランド編集ノート
          </p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-[var(--color-muted-strong)]">
            {SITE.description}
          </p>
        </div>

        <nav aria-label="フッターナビゲーション">
          <p className="u-label">CONTENTS</p>
          <ul className="mt-5 space-y-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="u-underline-link text-sm">
                  {item.labelJa}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="サイト情報">
          <p className="u-label">ABOUT THIS SITE</p>
          <ul className="mt-5 space-y-3">
            {FOOTER_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="u-underline-link text-sm">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-[var(--color-border)]">
        <div className="u-container py-8">
          <AmazonDisclosure />
          <p className="mt-6 font-[family-name:var(--font-utility)] text-xs tracking-[0.1em] text-[var(--color-muted)]">
            © {new Date().getFullYear()} {SITE.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
