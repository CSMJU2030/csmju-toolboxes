import type { Metadata } from "next";
import { RememberRecent } from "@/components/tools/remember-recent";

export const metadata: Metadata = {
  title: "แปลงเลขฐานพร้อมวิธีทำ",
  description: "แปลงเลขฐาน 2, 8, 10 และ 16 พร้อมแสดงขั้นตอนคำนวณ",
};

export default function NumberBaseConverterLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <RememberRecent slug="number-base-converter" />
      {children}
    </>
  );
}
