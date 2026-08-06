'use client';

import { useEffect } from 'react';

/**
 * 控えめなスクロール演出。
 *
 * - JavaScript が動かない／失敗した場合、要素は最初から見えている
 *   （.m-reveal の初期値は表示。js-motion クラスが付いたときだけ隠す）
 * - prefers-reduced-motion: reduce のときは何もしない
 * - 一度だけ発火する
 */
export default function MotionRoot() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>('.m-reveal'));
    if (targets.length === 0) return;

    document.documentElement.classList.add('js-motion');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = 'true';
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );

    for (const target of targets) observer.observe(target);

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('js-motion');
    };
  }, []);

  return null;
}
