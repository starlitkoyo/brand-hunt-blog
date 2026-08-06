type Props = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export default function EmptyState({ title, description, children }: Props) {
  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-canvas-soft)] px-6 py-16 text-center">
      <p className="font-[family-name:var(--font-display)] text-lg">{title}</p>
      {description ? (
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--color-muted-strong)]">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}
