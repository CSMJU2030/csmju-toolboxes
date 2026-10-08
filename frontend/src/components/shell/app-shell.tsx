'use client';

import { ArrowLeft, ExternalLink, House, LayoutGrid, LogOut, Star, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CORE_HUB_WEB_URL } from '@/lib/csmju/core-hub';
import { useMe, useSignOut, type CoreRole } from '@/lib/csmju/session';
import { TOOLS } from '@/lib/tools/registry';

const NAV = [
  { href: '/', label: 'หน้าหลัก', icon: House },
  { href: '/tools', label: 'เครื่องมือทั้งหมด', icon: LayoutGrid },
  { href: '/favorites', label: 'รายการโปรด', icon: Star },
];

export const ROLE_LABEL: Record<CoreRole, string> = {
  student: 'นักศึกษา',
  alumni: 'ศิษย์เก่า',
  staff: 'บุคลากร',
  lecturer: 'อาจารย์',
  guest: 'ผู้เยี่ยมชม',
  admin: 'ผู้ดูแลระบบ',
};

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  if (href === '/tools') return pathname === '/tools' || pathname.startsWith('/tools/') || pathname.startsWith('/category/');

  return pathname.startsWith(href);
}

/// ชื่อที่แสดง = ส่วนหน้าของอีเมลจาก token (ไม่เก็บลงฐาน · data-dictionary)
function displayName(email: string) {
  return email.split('@')[0] || 'ผู้ใช้';
}

/// โครงหน้าจอแบบ CS Nexus / CS Canvas: แถบซ้ายสีน้ำเงิน Core Hub 72px ขยายเมื่อชี้ · มือถือมีแถบล่าง
/// หน้าแต่ละหน้าเป็นเจ้าของ `<main>` เอง (หน้าของ AIE มี `<main>` อยู่แล้ว)
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-background">
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-surface-container-lowest focus:px-4 focus:py-2">
        ข้ามไปเนื้อหา
      </a>
      <Rail />
      <div id="content" className="min-w-0 flex-1 pb-20 md:pb-0">
        {children}
      </div>
      <MobileBar />
    </div>
  );
}

function Rail() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-40 hidden h-dvh w-18 shrink-0 md:block">
      <nav aria-label="เมนูหลัก" className="csmju-rail absolute inset-y-0 left-0 flex flex-col gap-1 px-3">
        <Link href="/" aria-label="CS Toolboxes หน้าแรก" className="csmju-rail-item csmju-rail-brand">
          <span className="csmju-logo-badge size-9 shrink-0 p-0.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- ไฟล์เล็กใน public ไม่ต้องผ่านตัวย่อรูป */}
            <img src="/csmju-mark.png" alt="" width={32} height={32} className="size-8 rounded-full object-contain" />
          </span>
          <span className="csmju-rail-label font-display text-xl font-bold leading-none text-white">CS Toolboxes</span>
        </Link>

        {NAV.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link key={item.href} href={item.href} aria-label={item.label} aria-current={active ? 'page' : undefined} data-active={active} className="csmju-rail-item">
              <item.icon aria-hidden className="size-6 shrink-0" strokeWidth={active ? 2.4 : 1.9} />
              <span className="csmju-rail-label">{item.label}</span>
            </Link>
          );
        })}

        <div className="mt-auto flex flex-col gap-1 pb-3">
          {/* ปุ่มกลับพอร์ทัลกลาง (ui-design-system.md ข้อ 5.1) — อีก origin จึงใช้ <a> */}
          <a href={CORE_HUB_WEB_URL} aria-label="กลับ CSMJU Portal" className="csmju-rail-item">
            <ArrowLeft aria-hidden className="size-6 shrink-0" strokeWidth={1.9} />
            <span className="csmju-rail-label">ระบบอื่นใน CSMJU2030</span>
          </a>
          <AccountMenu placement="rail" />
        </div>
      </nav>
    </div>
  );
}

function MobileBar() {
  const pathname = usePathname();

  return (
    <nav aria-label="เมนูหลัก (มือถือ)" className="brand-gradient fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around px-2 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-sm ${active ? 'font-bold text-white' : 'text-white/75'}`}>
            <item.icon aria-hidden className="size-5" strokeWidth={active ? 2.4 : 1.9} />
            {item.label === 'เครื่องมือทั้งหมด' ? 'เครื่องมือ' : item.label === 'รายการโปรด' ? 'โปรด' : item.label}
          </Link>
        );
      })}
      <AccountMenu placement="bar" />
    </nav>
  );
}

function AccountMenu({ placement }: { placement: 'rail' | 'bar' }) {
  const me = useMe();
  const signOut = useSignOut();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const name = displayName(me.email);

  useEffect(() => {
    if (!open) return;

    const close = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);

    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={placement === 'bar' ? 'relative flex flex-1' : 'relative'}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`บัญชีของ ${name}`}
        onClick={() => setOpen((v) => !v)}
        className={placement === 'rail' ? 'csmju-rail-item' : 'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-sm text-white/75'}
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/15 font-semibold text-white uppercase">{name.slice(0, 1)}</span>
        {placement === 'rail' ? <span className="csmju-rail-label truncate">{name}</span> : 'บัญชี'}
      </button>

      {open && (
        <div role="menu" className={`soft-shadow absolute z-50 w-72 rounded-2xl border border-outline-variant bg-surface-container-lowest p-3 text-on-surface ${placement === 'rail' ? 'bottom-0 left-full ml-3' : 'right-0 bottom-full mb-2'}`}>
          <div className="flex items-center gap-3 px-2 py-1">
            <span className="brand-gradient grid size-11 place-items-center rounded-full text-lg font-semibold text-white uppercase">{name.slice(0, 1)}</span>
            <div className="min-w-0">
              <p className="truncate font-semibold">{name}</p>
              <p className="text-sm text-on-surface-variant">{ROLE_LABEL[me.coreRole] ?? me.coreRole}</p>
            </div>
          </div>
          <p className="mt-2 px-2 text-sm text-on-surface-variant">เครื่องมือ {TOOLS.length} ชิ้นทำงานในเบราว์เซอร์ของคุณ ข้อมูลที่กรอกไม่ถูกส่งออกจากเครื่อง</p>
          <hr className="my-2 border-outline-variant" />
          <a role="menuitem" href={CORE_HUB_WEB_URL} className="flex min-h-11 items-center gap-3 rounded-lg px-2 hover:bg-surface-container">
            <UserRound aria-hidden className="size-5" />
            บัญชีและความปลอดภัย (Core Hub)
            <ExternalLink aria-hidden className="ml-auto size-4 text-on-surface-variant" />
          </a>
          <button role="menuitem" type="button" onClick={() => void signOut()} className="flex min-h-11 w-full items-center gap-3 rounded-lg px-2 text-left text-error hover:bg-error-container">
            <LogOut aria-hidden className="size-5" />
            ออกจากระบบ
          </button>
        </div>
      )}
    </div>
  );
}
