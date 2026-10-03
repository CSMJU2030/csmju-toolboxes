import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface px-4 py-12 text-on-surface sm:px-8">
      <section className="mx-auto max-w-xl rounded-xl border border-surface-variant bg-surface-container p-6 text-center">
        <ImageIcon size={28} className="mx-auto text-primary-container" aria-hidden="true" />
        <h1 className="mb-0 mt-4 text-xl font-semibold">ไม่พบเครื่องมือลดขนาดรูปภาพ</h1>
        <p className="mb-0 mt-3 text-base leading-relaxed text-on-surface-variant">
          ลิงก์อาจไม่ถูกต้อง หรือเครื่องมือนี้ไม่มีในระบบ
        </p>
        <Link href="/" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-primary-container px-5 text-sm font-semibold text-white hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container">
          กลับหน้ารวมเครื่องมือ
        </Link>
      </section>
    </main>
  );
}
