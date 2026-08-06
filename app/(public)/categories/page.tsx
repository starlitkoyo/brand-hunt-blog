import type { Metadata } from 'next';

import CategoryFeature from '@/components/editorial/CategoryFeature';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import EmptyState from '@/components/ui/EmptyState';
import SectionHeading from '@/components/ui/SectionHeading';
import { getCategories } from '@/lib/data-source';

export const metadata: Metadata = {
  title: 'カテゴリー一覧',
  description: 'ファッション、ビューティー、インテリア、女性向け家電の4カテゴリーから探せます。',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="u-container pb-20">
      <Breadcrumbs items={[{ href: '/', label: 'ホーム' }, { label: 'カテゴリー' }]} />

      <SectionHeading
        label="CATEGORIES"
        title="カテゴリーから探す"
        description="暮らしの場面ごとに分けています。"
      />

      <div className="mt-12">
        {categories.length === 0 ? (
          <EmptyState title="現在、公開中のカテゴリーはありません。" />
        ) : (
          <CategoryFeature categories={categories} />
        )}
      </div>
    </div>
  );
}
