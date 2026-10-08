import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { DirectoryView } from '@/components/pages/directory-view';
import { ShellSkeleton } from '@/components/shell/shell-skeleton';
import { CATEGORIES } from '@/lib/tools/categories';

type Props = { params: Promise<{ slug: string }> };

const find = (slug: string) => CATEGORIES.find((c) => c.key === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = find((await params).slug);

  return category ? { title: `เครื่องมือ${category.label}`, description: category.description } : { title: 'ไม่พบหมวด' };
}

export default async function CategoryPage({ params }: Props) {
  const category = find((await params).slug);

  if (!category) notFound();

  return (
    <Suspense fallback={<ShellSkeleton />}>
      <DirectoryView category={category.key} />
    </Suspense>
  );
}
