import type { Metadata } from "next";
import { RememberRecent } from "@/components/tools/remember-recent";

export const metadata: Metadata = {
  title: "เปรียบเทียบไฟล์ข้อความ",
  description: "เปรียบเทียบข้อความสองไฟล์และดูบรรทัดที่เปลี่ยนแปลง",
};

export default function FileComparisonLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <RememberRecent slug="file-comparison" />
      {children}
    </>
  );
}
