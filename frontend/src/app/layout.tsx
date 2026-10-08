import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Providers } from '@/components/providers';
import './globals.css';

// ฟอนต์อยู่ใน repo (app/fonts · สัญญาอนุญาต OFL แนบข้างไฟล์) — ห้ามใช้ next/font/google (build บน CI ล้ม)
// ชุดเดียวกับ Core Hub: เนื้อความ Noto Sans Thai · หัวข้อ Plus Jakarta Sans
const notoThai = localFont({ src: './fonts/NotoSansThai-Variable.ttf', variable: '--font-noto-thai', weight: '100 900' });
const jakarta = localFont({ src: './fonts/PlusJakartaSans-Variable.ttf', variable: '--font-jakarta', weight: '200 800' });

export const metadata: Metadata = {
  title: { default: 'CS Toolboxes · เครื่องมือออนไลน์ฟรี', template: '%s · CS Toolboxes' },
  description: 'รวมเครื่องมือกว่า 100 ชิ้นสำหรับนักศึกษาและบุคลากรสาขาวิทยาการคอมพิวเตอร์ — ทำงานในเบราว์เซอร์ ข้อมูลไม่ออกจากเครื่อง',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={`${notoThai.variable} ${jakarta.variable}`}>
      <body className="min-h-dvh antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
