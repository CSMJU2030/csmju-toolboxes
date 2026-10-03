export default function Loading() {
  return (
    <main className="min-h-screen bg-surface px-4 py-8 sm:px-8 sm:py-12 md:px-12" aria-label="กำลังโหลดรายการเครื่องมือ">
      <div className="mx-auto max-w-screen-xl animate-pulse">
        <div className="h-5 w-56 rounded-md bg-surface-variant" />
        <div className="mt-4 h-10 w-64 rounded-md bg-surface-variant" />
        <div className="mt-3 h-6 w-96 max-w-full rounded-md bg-surface-variant" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="min-h-60 rounded-xl border border-surface-variant bg-surface-container p-6">
              <div className="size-12 rounded-lg bg-surface-variant" />
              <div className="mt-5 h-6 w-3/4 rounded-md bg-surface-variant" />
              <div className="mt-3 h-5 w-full rounded-md bg-surface-variant" />
              <div className="mt-2 h-5 w-2/3 rounded-md bg-surface-variant" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
