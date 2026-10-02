"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Binary, FileText, Image as ImageIcon, Search, ShieldCheck, Sparkles } from "lucide-react";

type Category = "IMAGE" | "DOCUMENT" | "SECURITY" | "OTHER";
type Tool = { id: string; name: string; description: string; category: Category; href: string };

// Local catalog lets us finish the tool experience before connecting Core Hub SSO.
const tools: Tool[] = [
  {
    id: "image-compressor",
    name: "ลดขนาดรูปภาพ",
    description: "บีบอัดและปรับขนาดรูปภาพในเบราว์เซอร์ แล้วดาวน์โหลดไฟล์ที่เล็กลง",
    category: "IMAGE",
    href: "/tools/image-compressor",
  },
  {
    id: "file-comparison",
    name: "เปรียบเทียบไฟล์ข้อความ",
    description: "ตรวจความแตกต่างระหว่างไฟล์ข้อความ พร้อมไฮไลต์บรรทัดที่เพิ่มและลบ",
    category: "DOCUMENT",
    href: "/tools/file-comparison",
  },
  {
    id: "pdf-to-word",
    name: "แปลง PDF เป็น Word",
    description: "อ่านข้อความจาก PDF และดาวน์โหลดเป็น Word เพื่อแก้ไขต่อ ประมวลผลในเบราว์เซอร์",
    category: "DOCUMENT",
    href: "/tools/pdf-to-word",
  },
  {
    id: "number-base-converter",
    name: "แปลงเลขฐานพร้อมวิธีทำ",
    description: "แปลงเลขฐาน 2, 8, 10 และ 16 พร้อมแสดงการกระจายค่าตามหลักและวิธีคำนวณ",
    category: "OTHER",
    href: "/tools/number-base-converter",
  },
  {
    id: "hash-crypto-toolbox",
    name: "Hash & Crypto Toolbox",
    description: "เรียนรู้ SHA, Base64 และ AES-GCM พร้อมทดลองเข้ารหัสและถอดรหัสข้อความ",
    category: "SECURITY",
    href: "/tools/hash-crypto-toolbox",
  },
];

const categories: { label: string; value: Category | "ALL" }[] = [
  { label: "ทั้งหมด", value: "ALL" },
  { label: "รูปภาพ", value: "IMAGE" },
  { label: "เอกสาร", value: "DOCUMENT" },
  { label: "ความปลอดภัย", value: "SECURITY" },
  { label: "อื่น ๆ", value: "OTHER" },
];

const categoryLabels: Record<Category, string> = {
  IMAGE: "รูปภาพ",
  DOCUMENT: "เอกสาร",
  SECURITY: "ความปลอดภัย",
  OTHER: "อื่น ๆ",
};

function ToolMark({ category }: { category: Category }) {
  const Icon = category === "IMAGE" ? ImageIcon : category === "DOCUMENT" ? FileText : category === "SECURITY" ? ShieldCheck : category === "OTHER" ? Binary : Sparkles;
  return <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-surface text-primary-container"><Icon size={22} aria-hidden="true" /></span>;
}

export default function Home() {
  const [category, setCategory] = useState<Category | "ALL">("ALL");
  const [query, setQuery] = useState("");

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("th");
    return tools.filter((tool) =>
      (category === "ALL" || tool.category === category) &&
      `${tool.name} ${tool.description}`.toLocaleLowerCase("th").includes(normalizedQuery),
    );
  }, [category, query]);

  return (
    <main className="min-h-screen bg-surface px-4 py-8 text-on-surface sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 border-b border-surface-variant pb-6">
          <div>
            <p className="mb-1 text-sm font-semibold text-primary-container">CSMJU · COMPUTER SCIENCE</p>
            <h1 className="text-2xl font-bold sm:text-3xl">เครื่องมือดิจิทัล</h1>
            <p className="mt-1 text-sm text-on-surface-variant">เลือกเครื่องมือแล้วเริ่มใช้งานได้ทันที</p>
          </div>
        </header>

        <p className="mb-8 text-sm leading-6 text-on-surface-variant">เครื่องมือที่พร้อมใช้งานในขณะนี้</p>

        <section aria-labelledby="catalog-title">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="catalog-title" className="text-xl font-semibold">เครื่องมือทั้งหมด</h2>
              <p className="mt-1 text-sm leading-6 text-on-surface-variant">พบ {filteredTools.length} รายการ</p>
            </div>
            <label className="flex h-11 w-full max-w-sm items-center gap-2 rounded-md border border-surface-variant bg-surface-container px-3 focus-within:border-primary-container">
              <Search size={18} className="shrink-0 text-on-surface-variant" aria-hidden="true" />
              <input className="w-full bg-transparent text-sm outline-none placeholder:text-on-surface-variant" aria-label="ค้นหาเครื่องมือ" placeholder="ค้นหาชื่อหรือคำอธิบาย" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
          </div>

          <div className="mb-5 flex flex-wrap gap-2" aria-label="กรองตามหมวดหมู่">
            {categories.map((item) => (
              <button key={item.value} type="button" aria-pressed={category === item.value} onClick={() => setCategory(item.value)} className={`min-h-10 rounded-md border px-4 text-sm ${category === item.value ? "border-primary-container bg-primary-container text-white" : "border-surface-variant bg-surface-container text-on-surface hover:bg-surface-variant"}`}>
                {item.label}
              </button>
            ))}
          </div>

          {filteredTools.length ? (
            <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <li key={tool.id}>
                  <Link href={tool.href} className="block h-full rounded-lg border border-surface-variant bg-surface-container p-4 hover:border-primary-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container">
                    <div className="flex items-start gap-3">
                      <ToolMark category={tool.category} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-6 text-on-surface-variant">{categoryLabels[tool.category]}</p>
                        <h3 className="mt-1 font-semibold">{tool.name}</h3>
                      </div>
                    </div>
                    <p className="mt-3 min-h-10 text-sm leading-6 text-on-surface-variant">{tool.description}</p>
                    <span className="mt-3 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary-container">เปิดเครื่องมือ <ArrowRight size={16} aria-hidden="true" /></span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-lg border border-surface-variant bg-surface-container px-5 py-10 text-center">
              <h3 className="font-semibold">ไม่พบเครื่องมือที่ค้นหา</h3>
              <p className="mt-1 text-sm leading-6 text-on-surface-variant">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น</p>
              <button type="button" onClick={() => { setQuery(""); setCategory("ALL"); }} className="mt-3 min-h-10 rounded-md border border-surface-variant px-4 text-sm hover:bg-surface">ล้างตัวกรอง</button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
