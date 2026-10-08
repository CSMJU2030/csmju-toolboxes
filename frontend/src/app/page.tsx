import type { Metadata } from 'next';
import { HomeView } from '@/components/pages/home-view';

export const metadata: Metadata = {
  title: { absolute: 'CS Toolboxes · เครื่องมือออนไลน์ฟรีกว่า 100 ชิ้น' },
  description: 'แปลง JSON สร้าง QR นับคำภาษาไทย คำนวณเกรดเฉลี่ย ภาษี เงินกู้ และอีกมาก — ทำงานในเบราว์เซอร์ ข้อมูลไม่ออกจากเครื่อง',
};

export default function Home() {
  return <HomeView />;
}
