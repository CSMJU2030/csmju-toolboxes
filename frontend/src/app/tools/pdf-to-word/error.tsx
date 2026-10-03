"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="min-h-screen bg-surface px-4 py-10 text-on-surface"><section className="mx-auto max-w-xl rounded-lg border border-surface-variant bg-surface-container p-6 text-center"><h1 className="text-xl font-semibold">เปิดเครื่องมือ PDF เป็น Word ไม่ได้</h1><p className="mt-2 text-sm leading-relaxed text-on-surface-variant">ลองเปิดหน้านี้อีกครั้ง หากยังพบปัญหาให้กลับไปหน้ารวมเครื่องมือ</p><button type="button" onClick={reset} className="mt-4 min-h-11 rounded-md bg-primary-container px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container">ลองอีกครั้ง</button></section></main>;
}
