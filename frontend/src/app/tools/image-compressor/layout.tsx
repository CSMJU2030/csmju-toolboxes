import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ลดขนาดรูปภาพ · CS Toolboxes · CSMJU",
  description: "บีบอัดและปรับขนาดรูปภาพในเบราว์เซอร์ พร้อมดาวน์โหลดไฟล์ที่เล็กลง",
};

export default function ImageCompressorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
