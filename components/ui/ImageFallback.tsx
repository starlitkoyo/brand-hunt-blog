type Props = {
  /** ブランド名または商品名。画像が無いときの手がかりにする */
  label: string;
  ratio?: string;
};

/** 画像が無い・読み込めないときの代替表示。 */
export default function ImageFallback({ label, ratio = '4 / 5' }: Props) {
  return (
    <div
      className="flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-canvas-soft)] p-6"
      style={{ aspectRatio: ratio }}
    >
      <span className="text-center font-[family-name:var(--font-display)] text-sm leading-relaxed text-[var(--color-muted)]">
        {label}
      </span>
    </div>
  );
}
