"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Binary,
  FileText,
  Image as ImageIcon,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type Category = "IMAGE" | "DOCUMENT" | "SECURITY" | "OTHER";
type Tool = {
  id: string;
  name: string;
  description: string;
  category: Category;
  href: string;
};

const tools: Tool[] = [
  {
    id: "image-compressor",
    name: "ลดขนาดรูปภาพ",
    description: "ปรับขนาดและบีบอัดรูปภาพในเบราว์เซอร์ พร้อมดาวน์โหลดไฟล์ได้ทันที",
    category: "IMAGE",
    href: "/tools/image-compressor",
  },
  {
    id: "file-comparison",
    name: "เปรียบเทียบไฟล์ข้อความ",
    description: "ดูบรรทัดที่เพิ่ม ลบ หรือเปลี่ยนแปลงระหว่างไฟล์สองฉบับ",
    category: "DOCUMENT",
    href: "/tools/file-comparison",
  },
  {
    id: "pdf-to-word",
    name: "แปลง PDF เป็น Word",
    description: "อ่านข้อความจาก PDF และดาวน์โหลดเป็นเอกสาร Word เพื่อแก้ไขต่อ",
    category: "DOCUMENT",
    href: "/tools/pdf-to-word",
  },
  {
    id: "number-base-converter",
    name: "แปลงเลขฐานพร้อมวิธีทำ",
    description: "แปลงเลขฐาน 2, 8, 10 และ 16 พร้อมแสดงขั้นตอนคำนวณ",
    category: "OTHER",
    href: "/tools/number-base-converter",
  },
  {
    id: "hash-crypto-toolbox",
    name: "Hash & Crypto Toolbox",
    description: "ทดลอง Hash, Base64 และ AES-GCM พร้อมเรียนรู้การทำงานของแต่ละวิธี",
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
  OTHER: "คณิตศาสตร์และคอมพิวเตอร์",
};

function ToolIcon({ category }: { category: Category }) {
  const Icon = category === "IMAGE"
    ? ImageIcon
    : category === "DOCUMENT"
      ? FileText
      : category === "SECURITY"
        ? ShieldCheck
        : category === "OTHER"
          ? Binary
          : Sparkles;

  return (
    <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-surface text-primary-container">
      <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
    </span>
  );
}

export default function ToolCatalog() {
  const [category, setCategory] = useState<Category | "ALL">("ALL");
  const [query, setQuery] = useState("");

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("th");
    return tools.filter((tool) =>
      (category === "ALL" || tool.category === category)
      && `${tool.name} ${tool.description}`.toLocaleLowerCase("th").includes(normalizedQuery),
    );
  }, [category, query]);

  return (
    <main className="min-h-screen bg-surface px-4 py-8 text-on-surface sm:px-8 sm:py-12 md:px-12">
      <div className="mx-auto max-w-screen-xl">
        <header className="border-b border-surface-variant pb-7 sm:pb-9">
          <p className="mb-2 text-sm font-semibold text-primary-container">CSMJU · COMPUTER SCIENCE</p>
          <h1 className="m-0 text-2xl font-bold leading-tight sm:text-3xl">เครื่องมือดิจิทัล</h1>
          <p className="mb-0 mt-2 text-base leading-relaxed text-on-surface-variant">
            เลือกเครื่องมือที่ต้องการ แล้วเริ่มใช้งานได้จากที่เดียว
          </p>
        </header>

        <section className="pt-7 sm:pt-9" aria-labelledby="catalog-title">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-on-surface-variant">เครื่องมือที่พร้อมใช้งาน</p>
              <h2 id="catalog-title" className="m-0 text-xl font-semibold sm:text-2xl">เลือกเครื่องมือ</h2>
              <p className="mb-0 mt-1 text-sm leading-relaxed text-on-surface-variant">
                พบ {filteredTools.length} รายการ
              </p>
            </div>
            <div className="w-full md:max-w-md">
              <label htmlFor="tool-search" className="mb-2 block text-sm font-medium">ค้นหาเครื่องมือ</label>
              <span className="flex min-h-12 items-center gap-3 rounded-lg border border-surface-variant bg-surface-container px-4 focus-within:border-primary-container focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary-container">
                <Search size={20} className="shrink-0 text-on-surface-variant" aria-hidden="true" />
                <input
                  id="tool-search"
                  className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-on-surface-variant"
                  placeholder="ค้นหาชื่อหรือคำอธิบาย"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </span>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2" aria-label="กรองตามหมวดหมู่">
            {categories.map((item) => {
              const selected = category === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setCategory(item.value)}
                  className={`min-h-11 rounded-lg border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container ${selected
                    ? "border-primary-container bg-primary-container text-white"
                    : "border-surface-variant bg-surface-container text-on-surface hover:border-primary-container hover:text-primary-container active:brightness-90"
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {filteredTools.length > 0 ? (
            <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
              {filteredTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={tool.href}
                    className="group flex h-full min-h-60 flex-col rounded-xl border border-surface-variant bg-surface-container p-5 transition-colors hover:border-primary-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container active:bg-surface sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <ToolIcon category={tool.category} />
                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className="mb-1 text-sm leading-relaxed text-on-surface-variant">{categoryLabels[tool.category]}</p>
                        <h3 className="m-0 text-lg font-semibold leading-relaxed">{tool.name}</h3>
                      </div>
                    </div>
                    <p className="mb-5 mt-4 flex-1 text-base leading-relaxed text-on-surface-variant">
                      {tool.description}
                    </p>
                    <span className="inline-flex min-h-11 items-center gap-2 border-t border-surface-variant pt-3 text-sm font-semibold text-primary-container">
                      เปิดเครื่องมือ
                      <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-surface-variant bg-surface-container px-5 py-12 text-center">
              <Search size={24} className="mx-auto text-on-surface-variant" aria-hidden="true" />
              <h3 className="mb-0 mt-3 text-lg font-semibold">ไม่พบเครื่องมือที่ค้นหา</h3>
              <p className="mb-0 mt-2 text-base leading-relaxed text-on-surface-variant">
                ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น
              </p>
              <button
                type="button"
                onClick={() => { setQuery(""); setCategory("ALL"); }}
                className="mt-4 min-h-11 rounded-lg border border-surface-variant px-4 text-sm font-medium hover:border-primary-container hover:text-primary-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container active:brightness-90"
              >
                ล้างตัวกรอง
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
