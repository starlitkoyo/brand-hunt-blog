import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ArticleBody from '@/components/articles/ArticleBody';
import StoryCard from '@/components/editorial/StoryCard';
import AmazonDisclosure from '@/components/products/AmazonDisclosure';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import {
  getArticleBySlug,
  getArticles,
  getCategoryById,
  getRelatedArticles,
} from '@/lib/data-source';
import { formatDate } from '@/lib/format';
import { SITE } from '@/lib/site';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: '記事が見つかりません' };
  return {
    title: article.title,
    description: article.description,
    ...(SITE.url ? { alternates: { canonical: `/journal/${article.slug}` } } : {}),
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.description,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [category, related] = await Promise.all([
    article.categoryId ? getCategoryById(article.categoryId) : Promise.resolve(null),
    getRelatedArticles(article.slug, 2),
  ]);

  const published = formatDate(article.publishedAt);
  const updated = formatDate(article.updatedAt);

  return (
    <div className="u-container pb-20">
      <Breadcrumbs
        items={[
          { href: '/', label: 'ホーム' },
          { href: '/journal', label: '読みもの' },
          { label: article.title },
        ]}
      />

      <article className="u-container-text !px-0">
        <header className="border-b border-[var(--color-border)] pb-8">
          <p className="u-label">JOURNAL</p>
          <h1 className="mt-4 text-[1.75rem] leading-snug lg:text-[2.4rem]">{article.title}</h1>
          <p className="mt-5 text-[0.95rem] leading-[2] text-[var(--color-muted-strong)]">
            {article.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 font-[family-name:var(--font-utility)] text-xs text-[var(--color-muted)]">
            {published ? <span>公開 {published}</span> : null}
            {updated && updated !== published ? <span>更新 {updated}</span> : null}
            {category ? <span>{category.name}</span> : null}
          </div>
        </header>

        <div className="mt-10">
          <ArticleBody blocks={article.body} />
        </div>

        <div className="mt-14 border-t border-[var(--color-border)] pt-6">
          <AmazonDisclosure compact />
        </div>
      </article>

      {related.length > 0 ? (
        <section className="mt-20">
          <h2 className="u-label">NEXT</h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {related.map((item) => (
              <StoryCard key={item.id} article={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
