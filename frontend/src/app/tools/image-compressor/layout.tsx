import type { Metadata } from "next";
import { RememberRecent } from "@/components/tools/remember-recent";

export const metadata: Metadata = {
  title: "ลดขนาดรูปภาพ",
  description: "บีบอัดและปรับขนาดรูปภาพในเบราว์เซอร์ พร้อมดาวน์โหลดไฟล์ที่เล็กลง",
};

export default function ImageCompressorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <RememberRecent slug="image-compressor" />
      {children}
    </>
  );
}
