export default function Loading() {
  return (
    <main className="min-h-screen bg-surface px-4 py-8 sm:px-8 sm:py-12" aria-label="กำลังเปิดเครื่องมือลดขนาดรูปภาพ">
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="h-6 w-44 rounded-md bg-surface-variant" />
        <div className="mt-6 h-28 rounded-xl bg-surface-container" />
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-h-96 rounded-xl border border-surface-variant bg-surface-container" />
          <div className="h-80 rounded-xl border border-surface-variant bg-surface-container" />
        </div>
      </div>
    </main>
  );
}
