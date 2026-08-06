import type { PublicationStatus } from '@/types';

const LABEL: Record<PublicationStatus, string> = {
  draft: '下書き',
  review: '確認待ち',
  published: '公開中',
  archived: '取り下げ',
};

export default function PublicationStatusBadge({ status }: { status: PublicationStatus }) {
  const tone =
    status === 'published'
      ? 'border-[var(--color-ink)] text-[var(--color-ink)]'
      : status === 'archived'
        ? 'border-[var(--color-stone)] text-[var(--color-muted)]'
        : 'border-[var(--color-signal)] text-[var(--color-signal)]';
  return (
    <span
      className={`inline-block border px-2 py-1 font-[family-name:var(--font-utility)] text-[0.68rem] tracking-[0.1em] ${tone}`}
    >
      {LABEL[status]}
    </span>
  );
}
