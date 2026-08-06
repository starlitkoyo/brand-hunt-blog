type Props = {
  title?: string;
  description?: string;
};

/** 公開画面には秘密情報やスタックトレースを出さない。 */
export default function ErrorState({
  title = '情報を読み込めませんでした',
  description = '時間をおいて再度お試しください。ほかのページはご覧いただけます。',
}: Props) {
  return (
    <div
      role="status"
      className="border border-[var(--color-signal)] bg-[var(--color-canvas-soft)] px-6 py-12 text-center"
    >
      <p className="font-[family-name:var(--font-display)] text-lg text-[var(--color-signal)]">
        {title}
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--color-muted-strong)]">
        {description}
      </p>
    </div>
  );
}
