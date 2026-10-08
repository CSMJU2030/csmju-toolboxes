import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DirectoryView } from '@/components/pages/directory-view';
import { ShellSkeleton } from '@/components/shell/shell-skeleton';

export const metadata: Metadata = { title: 'เครื่องมือทั้งหมด', description: 'ค้นหาและเลือกใช้เครื่องมือออนไลน์ฟรีทุกหมวดของ CS Toolboxes' };

export default function ToolsPage() {
  return (
    <Suspense fallback={<ShellSkeleton />}>
      <DirectoryView />
    </Suspense>
  );
}
