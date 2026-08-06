import { getDataSourceMode } from '@/lib/data-source';

/**
 * サンプルデータで動いていることを開発者に明示する。
 * 本番でモックのまま公開されていた場合も気づけるようにする。
 */
export default function MockNotice() {
  if (getDataSourceMode() !== 'mock') return null;

  return (
    <div className="border-b border-[var(--color-signal)] bg-[var(--color-signal)] text-[var(--color-white)]">
      <div className="u-container py-2">
        <p className="font-[family-name:var(--font-utility)] text-[0.7rem] tracking-[0.12em]">
          SAMPLE DATA — 商品・ブランド・価格は開発用のサンプルです。実在の価格ではありません。
        </p>
      </div>
    </div>
  );
}
