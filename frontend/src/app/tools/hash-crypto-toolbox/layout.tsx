import type { Metadata } from "next";
import { RememberRecent } from "@/components/tools/remember-recent";

export const metadata: Metadata = {
  title: "Hash & Crypto Toolbox",
  description: "ทดลอง Hash, Base64 และ AES-GCM เพื่อเรียนรู้การทำงานของเครื่องมือเข้ารหัส",
};

export default function HashCryptoToolboxLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <RememberRecent slug="hash-crypto-toolbox" />
      {children}
    </>
  );
}
