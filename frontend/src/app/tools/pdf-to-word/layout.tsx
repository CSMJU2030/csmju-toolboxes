import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "แปลง PDF เป็น Word · CS Toolboxes · CSMJU",
  description: "อ่านข้อความจาก PDF แล้วดาวน์โหลดเป็นเอกสาร Word",
};

export default function PdfToWordLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
