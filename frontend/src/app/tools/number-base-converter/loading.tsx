export default function Loading() {
  return (
    <main className="min-h-screen bg-surface px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl" aria-label="กำลังเตรียมเครื่องมือแปลงเลขฐาน" aria-busy="true">
        <div className="h-8 w-56 animate-pulse rounded-md bg-surface-variant" />
        <div className="mt-6 h-28 animate-pulse rounded-lg bg-surface-container" />
        <div className="mt-5 h-64 animate-pulse rounded-lg bg-surface-container" />
      </div>
    </main>
  );
}
