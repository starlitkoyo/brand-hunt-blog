import Link from 'next/link';

export type Crumb = { href?: string; label: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="パンくずリスト" className="py-6">
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-muted-strong)]">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-3">
            {item.href ? (
              <Link href={item.href} className="u-underline-link">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
            {index < items.length - 1 ? (
              <span aria-hidden="true" className="text-[var(--color-stone)]">
                /
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
