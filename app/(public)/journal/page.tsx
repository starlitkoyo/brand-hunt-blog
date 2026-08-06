import type { Metadata } from 'next';

import StoryCard from '@/components/editorial/StoryCard';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import EmptyState from '@/components/ui/EmptyState';
import SectionHeading from '@/components/ui/SectionHeading';
import { getArticles } from '@/lib/data-source';

export const metadata: Metadata = {
  title: '読みもの',
  description: 'Amazonでブランド品を買う前に確認しておきたいことを、編集部がまとめています。',
};

export default async function JournalPage() {
  const articles = await getArticles();
  const [lead, ...rest] = articles;

  return (
    <div className="u-container pb-20">
      <Breadcrumbs items={[{ href: '/', label: 'ホーム' }, { label: '読みもの' }]} />

      <SectionHeading
        label="JOURNAL"
        title="読みもの"
        description="買う前に見ておくと、あとで納得しやすくなることを書いています。"
      />

      {articles.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="公開中の記事はありません。" />
        </div>
      ) : (
        <>
          {lead ? (
            <div className="mt-12">
              <StoryCard article={lead} size="lg" />
            </div>
          ) : null}

          <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <StoryCard key={article.id} article={article} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
