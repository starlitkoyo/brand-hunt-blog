'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { FOOTER_LINKS, NAV_ITEMS } from '@/lib/site';

/**
 * モバイルメニュー。
 * - Esc で閉じる
 * - 開いている間はフォーカスをパネル内に留める
 * - 閉じたらトリガーへフォーカスを戻す
 */
export default function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const firstLink = panelRef.current?.querySelector<HTMLElement>('a[href]');
    firstLink?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="u-label border border-[var(--color-border)] px-4 py-3 !text-[var(--color-ink)]"
      >
        MENU
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 bg-[var(--color-canvas)]"
          role="dialog"
          aria-modal="true"
          aria-label="サイトメニュー"
        >
          <div ref={panelRef} className="flex h-full flex-col">
            <div className="u-container flex items-center justify-between py-5">
              <span className="u-label">MENU</span>
              <button
                type="button"
                onClick={() => {
                  close();
                  triggerRef.current?.focus();
                }}
                className="u-label border border-[var(--color-border)] px-4 py-3 !text-[var(--color-ink)]"
              >
                CLOSE
              </button>
            </div>

            <nav
              aria-label="モバイルナビゲーション"
              className="u-container flex-1 overflow-y-auto pb-16"
            >
              <ul className="border-t border-[var(--color-border)]">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href} className="border-b border-[var(--color-border)]">
                    <Link
                      href={item.href}
                      onClick={close}
                      className="flex items-baseline justify-between py-5"
                    >
                      <span className="font-[family-name:var(--font-display)] text-xl">
                        {item.labelJa}
                      </span>
                      <span className="u-label">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="mt-10 space-y-3">
                {FOOTER_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className="text-sm text-[var(--color-muted-strong)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
