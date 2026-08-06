import ProductCard from '@/components/products/ProductCard';
import EmptyState from '@/components/ui/EmptyState';
import type { Brand, Category, Product } from '@/types';

type Props = {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  emptyTitle?: string;
  emptyDescription?: string;
  /** 一覧は比較しやすさを優先して、同じ大きさで並べる */
  columns?: 2 | 3 | 4;
};

export default function ProductGrid({
  products,
  brands,
  categories,
  emptyTitle = '現在、公開中の商品はありません。',
  emptyDescription,
  columns = 4,
}: Props) {
  if (products.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const cols =
    columns === 2
      ? 'sm:grid-cols-2'
      : columns === 3
        ? 'sm:grid-cols-2 lg:grid-cols-3'
        : 'sm:grid-cols-2 lg:grid-cols-4';

  return (
    <ul className={`grid grid-cols-1 gap-x-6 gap-y-12 ${cols}`}>
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            brand={brands.find((b) => b.id === product.brandId) ?? null}
            category={categories.find((c) => c.id === product.categoryId) ?? null}
            priority={index < 2}
          />
        </li>
      ))}
    </ul>
  );
}
