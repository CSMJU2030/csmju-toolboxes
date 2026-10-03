import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hash & Crypto Toolbox · CS Toolboxes · CSMJU",
  description: "ทดลอง Hash, Base64 และ AES-GCM เพื่อเรียนรู้การทำงานของเครื่องมือเข้ารหัส",
};

export default function HashCryptoToolboxLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
