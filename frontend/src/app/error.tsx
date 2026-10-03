"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-surface px-4 py-12 text-on-surface sm:px-8">
      <section className="mx-auto max-w-xl rounded-xl border border-surface-variant bg-surface-container p-6 text-center sm:p-8">
        <h1 className="m-0 text-xl font-semibold">เปิดหน้าเครื่องมือไม่ได้</h1>
        <p className="mb-0 mt-3 text-base leading-relaxed text-on-surface-variant">
          ระบบขัดข้องชั่วคราว กรุณาลองอีกครั้ง
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 min-h-11 rounded-lg bg-primary-container px-5 text-sm font-semibold text-white hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container active:brightness-90"
        >
          ลองอีกครั้ง
        </button>
      </section>
    </main>
  );
}
