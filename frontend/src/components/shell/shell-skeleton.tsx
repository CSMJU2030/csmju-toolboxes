/// โครงหน้าจอระหว่างตรวจตัวตน (ส่วนใหญ่ผ่านในเสี้ยววินาที) — รูปร่างเดียวกับ AppShell จะได้ไม่กระตุก
export function ShellSkeleton() {
  return (
    <div className="flex min-h-dvh" aria-busy="true" aria-label="กำลังโหลด">
      <div className="brand-gradient hidden w-18 shrink-0 md:block" />
      <div className="flex-1 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="skeleton h-10 w-72" />
          <div className="skeleton mt-4 h-12 w-full max-w-2xl" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="skeleton h-28" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
