import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ToolView } from '@/components/pages/tool-view';
import { RememberRecent } from '@/components/tools/remember-recent';
import { findTool, IMAGE_TOOL_SLUGS } from '@/lib/tools/registry';
import ImageTool from './image-tool';

type Props = { params: Promise<{ toolId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = findTool((await params).toolId);

  return tool ? { title: tool.name, description: tool.description } : { title: 'ไม่พบเครื่องมือ' };
}

/// เครื่องมือแบบสเปก (ทะเบียน lib/tools) และเครื่องมือรูปภาพของ AIE (`ImageTool`)
/// เครื่องมือที่มีโฟลเดอร์ของตัวเอง (image-compressor ฯลฯ) Next จับเส้นทางนั้นก่อนหน้านี้อยู่แล้ว
export default async function ToolPage({ params }: Props) {
  const { toolId } = await params;

  if (IMAGE_TOOL_SLUGS.has(toolId)) {
    return (
      <>
        <RememberRecent slug={toolId} />
        <ImageTool toolId={toolId} />
      </>
    );
  }

  const tool = findTool(toolId);

  if (!tool || tool.kind !== 'spec') notFound();

  return <ToolView slug={tool.slug} />;
}
