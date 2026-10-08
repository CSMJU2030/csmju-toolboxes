import type { Metadata } from 'next';
import { FavoritesView } from '@/components/pages/favorites-view';

export const metadata: Metadata = { title: 'รายการโปรด' };

export default function FavoritesPage() {
  return <FavoritesView />;
}
