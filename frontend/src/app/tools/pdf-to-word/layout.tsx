import type { Metadata } from "next";
import { RememberRecent } from "@/components/tools/remember-recent";

export const metadata: Metadata = {
  title: "แปลง PDF เป็น Word",
  description: "อ่านข้อความจาก PDF แล้วดาวน์โหลดเป็นเอกสาร Word",
};

export default function PdfToWordLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <RememberRecent slug="pdf-to-word" />
      {children}
    </>
  );
}
