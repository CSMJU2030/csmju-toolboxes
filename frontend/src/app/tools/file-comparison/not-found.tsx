import Link from "next/link";

export default function NotFound() {
  return <main className="min-h-screen bg-surface px-4 py-10 text-on-surface"><section className="mx-auto max-w-xl rounded-lg border border-surface-variant bg-surface-container p-6 text-center"><h1 className="text-xl font-semibold">ไม่พบหน้าเครื่องมือนี้</h1><p className="mt-2 text-sm leading-6 text-on-surface-variant">ลิงก์อาจไม่ถูกต้อง หรือเครื่องมือนี้ไม่มีในระบบ</p><Link href="/" className="mt-4 inline-flex min-h-11 items-center rounded-md bg-primary-container px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container">กลับหน้ารวมเครื่องมือ</Link></section></main>;
}
