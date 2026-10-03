import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CS Toolboxes | เครื่องมือดิจิทัล",
  description: "ศูนย์รวมเครื่องมือดิจิทัลสำหรับนักศึกษาและบุคลากรสาขาวิทยาการคอมพิวเตอร์",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body>{children}</body></html>;
}
