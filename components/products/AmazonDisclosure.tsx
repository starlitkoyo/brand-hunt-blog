import { AMAZON_DISCLOSURE } from '@/lib/site';

type Props = { compact?: boolean };

/** Amazonアソシエイトであることの表示。文言は公開前に規約を確認して差し替える。 */
export default function AmazonDisclosure({ compact = false }: Props) {
  return (
    <p
      className={
        compact
          ? 'text-xs leading-relaxed text-[var(--color-muted)]'
          : 'max-w-3xl text-sm leading-relaxed text-[var(--color-muted-strong)]'
      }
    >
      {AMAZON_DISCLOSURE}
    </p>
  );
}
