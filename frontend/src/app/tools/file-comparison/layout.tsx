import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "เปรียบเทียบไฟล์ข้อความ · CS Toolboxes · CSMJU",
  description: "เปรียบเทียบข้อความสองไฟล์และดูบรรทัดที่เปลี่ยนแปลง",
};

export default function FileComparisonLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
