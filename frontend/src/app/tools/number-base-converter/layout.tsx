import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "แปลงเลขฐานพร้อมวิธีทำ · CS Toolboxes · CSMJU",
  description: "แปลงเลขฐาน 2, 8, 10 และ 16 พร้อมแสดงขั้นตอนคำนวณ",
};

export default function NumberBaseConverterLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
