import type { Metadata } from 'next';

import './globals.css';

import MotionRoot from '@/components/layout/MotionRoot';
import SiteFooter from '@/components/layout/SiteFooter';
import SiteHeader from '@/components/layout/SiteHeader';
import MockNotice from '@/components/ui/MockNotice';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  // 本番URLが未設定なら metadataBase を出さない（架空のURLを出力しない）
  ...(SITE.url ? { metadataBase: new URL(SITE.url) } : {}),
  title: {
    default: `${SITE.name}｜${SITE.nameJa}`,
    template: `%s｜${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name}｜${SITE.nameJa}`,
    description: SITE.description,
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name}｜${SITE.nameJa}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <a href="#main" className="u-skip-link">
          本文へスキップ
        </a>
        <MockNotice />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <MotionRoot />
      </body>
    </html>
  );
}
