"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Binary,
  Braces,
  CaseSensitive,
  Clock3,
  Code,
  Crop,
  Database,
  FileDiff,
  FileImage,
  FileKey2,
  FileJson,
  FileText,
  Fingerprint,
  Gauge,
  Grid2X2,
  Hash,
  Image as ImageIcon,
  KeyRound,
  KeySquare,
  ListChecks,
  Link2,
  Network,
  Palette,
  PackageOpen,
  Pipette,
  Regex,
  RefreshCw,
  ScanText,
  Scaling,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Table2,
  WholeWord,
  Wrench,
} from "lucide-react";

type Category = "IMAGE" | "DOCUMENT" | "SECURITY" | "OTHER";
type CategoryFilter = Category | "ALL";
type ToolView = "ALL" | "POPULAR" | "RECOMMENDED";

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
    description: "บีบอัด JPG, PNG และ WebP ในเบราว์เซอร์ พร้อมดูผลและดาวน์โหลดได้ทันที",
    category: "IMAGE",
    href: "/tools/image-compressor",
  },
  {
    id: "file-comparison",
    name: "เปรียบเทียบไฟล์ข้อความ",
    description: "ตรวจดูบรรทัดที่เพิ่ม ลบ หรือเปลี่ยนแปลงระหว่างไฟล์สองฉบับ",
    category: "DOCUMENT",
    href: "/tools/file-comparison",
  },
  {
    id: "pdf-to-word",
    name: "แปลง PDF เป็น Word",
    description: "แปลงข้อความจาก PDF เป็นเอกสาร Word เพื่อดาวน์โหลดและแก้ไขต่อ",
    category: "DOCUMENT",
    href: "/tools/pdf-to-word",
  },
  {
    id: "number-base-converter",
    name: "แปลงเลขฐานพร้อมวิธีทำ",
    description: "แปลงเลขฐาน 2, 8, 10 และ 16 พร้อมแสดงขั้นตอนการคำนวณ",
    category: "OTHER",
    href: "/tools/number-base-converter",
  },
  {
    id: "hash-crypto-toolbox",
    name: "Hash & Crypto Toolbox",
    description: "ทดลอง Hash, Base64 และ AES-GCM เพื่อเรียนรู้หลักการความปลอดภัย",
    category: "SECURITY",
    href: "/tools/hash-crypto-toolbox",
  },
  { id: "json-formatter", name: "จัดรูปแบบและตรวจ JSON", description: "ตรวจ syntax, จัด indent และย่อ JSON ให้อ่านง่ายหรือพร้อมส่งต่อ", category: "OTHER", href: "/tools/json-formatter" },
  { id: "uuid-generator", name: "สร้าง UUID", description: "สร้างรหัส UUID v4 แบบสุ่มด้วยตัวสร้างเลขสุ่มของเบราว์เซอร์", category: "OTHER", href: "/tools/uuid-generator" },
  { id: "regex-tester", name: "ทดลอง Regular Expression", description: "ทดสอบ pattern กับข้อความ ดูตำแหน่งที่ตรงและกลุ่มที่จับได้", category: "OTHER", href: "/tools/regex-tester" },
  { id: "url-encoder", name: "เข้ารหัสและถอดรหัส URL", description: "แปลงข้อความสำหรับ URL และถอด percent-encoding กลับ", category: "OTHER", href: "/tools/url-encoder" },
  { id: "timestamp-converter", name: "แปลง Unix Timestamp", description: "แปลง Unix time เป็นวันเวลา หรือแปลงวันเวลากลับเป็น timestamp", category: "OTHER", href: "/tools/timestamp-converter" },
  { id: "password-generator", name: "สร้างรหัสผ่านสุ่ม", description: "สร้างรหัสผ่านด้วย Web Crypto เลือกความยาวและชุดอักขระได้", category: "SECURITY", href: "/tools/password-generator" },
  { id: "word-counter", name: "นับคำและตัวอักษร", description: "นับตัวอักษร คำ บรรทัด และเวลาอ่านโดยประมาณ", category: "DOCUMENT", href: "/tools/word-counter" },
  { id: "csv-json-converter", name: "แปลง CSV และ JSON", description: "แปลงตาราง CSV เป็น JSON หรือแปลงรายการ JSON เป็น CSV", category: "DOCUMENT", href: "/tools/csv-json-converter" },
  { id: "html-entity", name: "HTML Entity Encoder", description: "เข้ารหัสอักขระพิเศษเป็น HTML entities หรือถอดกลับเป็นข้อความ", category: "OTHER", href: "/tools/html-entity" },
  { id: "jwt-decoder", name: "อ่านข้อมูล JWT", description: "ถอด Header และ Payload ของ JWT ในเครื่องโดยไม่ตรวจลายเซ็น", category: "SECURITY", href: "/tools/jwt-decoder" },
  { id: "color-converter", name: "แปลงค่าสี HEX", description: "แปลงสี HEX เป็นค่า RGB และ HSL พร้อมตัวอย่างสี", category: "OTHER", href: "/tools/color-converter" },
  { id: "chmod-calculator", name: "คำนวณสิทธิ์ไฟล์ chmod", description: "แปลงเลขฐานแปดเป็น rwx และแสดงคำสั่ง chmod", category: "OTHER", href: "/tools/chmod-calculator" },
  { id: "subnet-calculator", name: "คำนวณ IPv4 Subnet", description: "คำนวณ network, broadcast, subnet mask และช่วง IP ใช้งานได้", category: "OTHER", href: "/tools/subnet-calculator" },
  { id: "text-case-converter", name: "แปลงรูปแบบตัวอักษร", description: "แปลงข้อความเป็นตัวพิมพ์ใหญ่ เล็ก camelCase snake_case และ kebab-case", category: "OTHER", href: "/tools/text-case-converter" },
  { id: "sql-formatter", name: "จัดรูปแบบ SQL", description: "จัดบรรทัดคำสั่ง SQL และปรับ keyword ให้อ่านง่ายขึ้น", category: "OTHER", href: "/tools/sql-formatter" },
  { id: "image-resizer", name: "ปรับขนาดรูปภาพ", description: "กำหนดความกว้างหรือความสูงและดาวน์โหลดรูปที่ปรับขนาดแล้ว", category: "IMAGE", href: "/tools/image-resizer" },
  { id: "image-format-converter", name: "แปลงไฟล์รูปภาพ", description: "แปลง JPG, PNG และ WebP พร้อมเลือกคุณภาพไฟล์ผลลัพธ์", category: "IMAGE", href: "/tools/image-format-converter" },
  { id: "image-cropper", name: "ตัดภาพตามขอบเขต", description: "ระบุพิกัดและขนาดพื้นที่ตัด แล้วดาวน์โหลดภาพส่วนที่เลือก", category: "IMAGE", href: "/tools/image-cropper" },
  { id: "image-color-picker", name: "ดูดค่าสีจากรูปภาพ", description: "คลิกตำแหน่งบนรูปเพื่ออ่านค่าสี HEX และ RGB ในเครื่อง", category: "IMAGE", href: "/tools/image-color-picker" },
  { id: "csv-validator", name: "ตรวจสอบโครงสร้าง CSV", description: "ตรวจหัวตาราง ชื่อซ้ำ และจำนวนคอลัมน์ในแต่ละแถว", category: "DOCUMENT", href: "/tools/csv-validator" },
  { id: "password-strength-checker", name: "ตรวจความแข็งแรงรหัสผ่าน", description: "ประเมินความยาวและความหลากหลายของรหัสผ่านในเบราว์เซอร์", category: "SECURITY", href: "/tools/password-strength-checker" },
  { id: "hmac-generator", name: "สร้าง HMAC-SHA-256", description: "คำนวณ message authentication code ด้วย secret key ผ่าน Web Crypto", category: "SECURITY", href: "/tools/hmac-generator" },
  { id: "secure-token-generator", name: "สร้าง Secure Token", description: "สร้าง token สุ่มจาก Web Crypto ได้สูงสุด 512 บิต", category: "SECURITY", href: "/tools/secure-token-generator" },
];

const categories: { label: string; value: CategoryFilter }[] = [
  { label: "ทุกหมวดหมู่", value: "ALL" },
  { label: "รูปภาพ", value: "IMAGE" },
  { label: "เอกสาร", value: "DOCUMENT" },
  { label: "ความปลอดภัย", value: "SECURITY" },
  { label: "คณิตศาสตร์และคอมพิวเตอร์", value: "OTHER" },
];

const categoryLabels: Record<Category, string> = {
  IMAGE: "รูปภาพ",
  DOCUMENT: "เอกสาร",
  SECURITY: "ความปลอดภัย",
  OTHER: "คณิตศาสตร์และคอมพิวเตอร์",
};

const suggestions = [
  { label: "#บีบอัดรูปภาพ", query: "ลดขนาดรูปภาพ" },
  { label: "#เปรียบเทียบไฟล์", query: "เปรียบเทียบไฟล์ข้อความ" },
  { label: "#แปลงไฟล์ PDF", query: "แปลง PDF เป็น Word" },
];

const popularToolIds = new Set([
  "image-compressor", "file-comparison", "pdf-to-word", "number-base-converter",
  "hash-crypto-toolbox", "json-formatter", "password-generator",
]);
const recommendedToolIds = new Set([
  "image-compressor", "pdf-to-word", "json-formatter", "csv-json-converter",
  "password-generator", "subnet-calculator", "image-format-converter",
]);

const toolIcons: Record<string, typeof ImageIcon> = {
  "image-compressor": FileImage,
  "file-comparison": FileDiff,
  "pdf-to-word": FileText,
  "number-base-converter": Binary,
  "hash-crypto-toolbox": ShieldCheck,
  "json-formatter": FileJson,
  "uuid-generator": Fingerprint,
  "regex-tester": Regex,
  "url-encoder": Link2,
  "timestamp-converter": Clock3,
  "password-generator": KeyRound,
  "word-counter": WholeWord,
  "csv-json-converter": Table2,
  "html-entity": Code,
  "jwt-decoder": FileKey2,
  "color-converter": Palette,
  "chmod-calculator": ScanText,
  "subnet-calculator": Network,
  "text-case-converter": CaseSensitive,
  "sql-formatter": Database,
  "image-resizer": Scaling,
  "image-format-converter": RefreshCw,
  "image-cropper": Crop,
  "image-color-picker": Pipette,
  "csv-validator": ListChecks,
  "password-strength-checker": Gauge,
  "hmac-generator": Hash,
  "secure-token-generator": KeySquare,
};

const accents = [
  "bg-sky-100 text-sky-700 ring-sky-200",
  "bg-amber-100 text-amber-700 ring-amber-200",
  "bg-violet-100 text-violet-700 ring-violet-200",
  "bg-emerald-100 text-emerald-700 ring-emerald-200",
  "bg-rose-100 text-rose-700 ring-rose-200",
  "bg-blue-100 text-blue-700 ring-blue-200",
];

function getAccent(tool: Tool) {
  const hash = [...tool.id].reduce((value, character) => value + character.charCodeAt(0), 0);
  return accents[hash % accents.length];
}

function ToolIcon({ tool }: { tool: Tool }) {
  const Icon = toolIcons[tool.id] ?? (tool.category === "IMAGE" ? ImageIcon : tool.category === "DOCUMENT" ? FileText : tool.category === "SECURITY" ? ShieldCheck : tool.category === "OTHER" ? Binary : Sparkles);
  const accent = getAccent(tool);

  return (
    <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ring-1 sm:size-14 ${accent}`}>
      <Icon size={27} strokeWidth={1.8} aria-hidden="true" />
    </span>
  );
}

function DecorativeToolIcon({ tool }: { tool: Tool }) {
  const Icon = toolIcons[tool.id] ?? Sparkles;
  return <span aria-hidden="true" className={`pointer-events-none absolute right-5 top-5 grid size-12 place-items-center rounded-2xl opacity-25 transition duration-200 group-hover:rotate-6 group-hover:scale-110 group-hover:opacity-70 ${getAccent(tool)}`}><Icon size={27} strokeWidth={1.7} /></span>;
}

export default function ToolCatalog() {
  const [category, setCategory] = useState<CategoryFilter>("ALL");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ToolView>("ALL");

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("th");
    return tools.filter((tool) =>
      (category === "ALL" || tool.category === category)
      && `${tool.name} ${tool.description} ${categoryLabels[tool.category]}`
        .toLocaleLowerCase("th")
        .includes(normalizedQuery)
      && (view === "ALL" || (view === "POPULAR" ? popularToolIds : recommendedToolIds).has(tool.id)),
    );
  }, [category, query, view]);

  const viewOptions: { value: ToolView; label: string }[] = [
    { value: "ALL", label: "ทั้งหมด" },
    { value: "POPULAR", label: "ยอดนิยม" },
    { value: "RECOMMENDED", label: "แนะนำ" },
  ];

  return (
    <main className="min-h-screen bg-surface text-on-surface">
      <header className="relative isolate overflow-hidden bg-gradient-to-b from-sky-100 via-blue-50 to-surface px-4 pb-8 pt-10 sm:pb-11 sm:pt-14">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(to_right,rgba(59,130,246,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,.06)_1px,transparent_1px)] [background-size:34px_34px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-36 -z-10 size-96 rounded-full bg-blue-300/30 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-2 -z-10 size-72 rounded-full bg-cyan-200/40 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute left-[8%] top-8 hidden size-16 rotate-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-blue-500 to-violet-600 text-white shadow-xl shadow-blue-500/25 md:flex"><Braces size={34} /></div>
        <div aria-hidden="true" className="pointer-events-none absolute left-[18%] top-24 hidden size-11 -rotate-12 items-center justify-center rounded-xl border border-white/80 bg-white/60 text-violet-600 shadow-lg backdrop-blur md:flex"><Sparkles size={23} /></div>
        <div aria-hidden="true" className="pointer-events-none absolute right-[13%] top-10 hidden size-14 rotate-12 items-center justify-center rounded-2xl border border-white/80 bg-white/60 text-blue-700 shadow-lg backdrop-blur md:flex"><Settings size={30} /></div>
        <div aria-hidden="true" className="pointer-events-none absolute right-[7%] top-20 hidden size-16 -rotate-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 text-white shadow-xl shadow-indigo-500/25 md:flex"><FileText size={32} /></div>
        <div className="mx-auto max-w-screen-xl text-center">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-4 py-1.5 text-xs font-bold tracking-wide text-blue-900 shadow-sm backdrop-blur sm:text-sm"><Sparkles size={15} aria-hidden="true" />CSMJU · COMPUTER SCIENCE</p>
          <h1 className="m-0 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl md:text-5xl">เครื่องมือดิจิทัล</h1>
          <p className="mx-auto mb-0 mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">ค้นหาเครื่องมือที่ต้องการ แล้วเริ่มใช้งานได้จากที่เดียว</p>
        </div>
      </header>

      <section className="mx-auto max-w-screen-xl px-4 pb-12 pt-5 sm:px-8 sm:pt-7 md:px-12" aria-labelledby="catalog-title">
        <div className="mb-6 grid gap-4 md:grid-cols-[minmax(210px,.68fr)_minmax(0,2fr)] md:items-stretch md:gap-5">
          <div className="relative isolate overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-sky-50 to-violet-50 p-4 shadow-[0_7px_22px_rgba(59,130,246,.09)] sm:p-5">
            <div aria-hidden="true" className="pointer-events-none absolute -right-4 top-2 -z-10 text-blue-200/70"><PackageOpen size={94} strokeWidth={1.2} /></div>
            <div aria-hidden="true" className="pointer-events-none absolute right-8 top-4 grid size-9 rotate-[-10deg] place-items-center rounded-xl border border-white bg-white/90 text-sky-600 shadow-md"><ImageIcon size={18} /></div>
            <div aria-hidden="true" className="pointer-events-none absolute right-2 top-10 grid size-8 rotate-12 place-items-center rounded-lg border border-white bg-white/90 text-violet-600 shadow-md"><Wrench size={16} /></div>
            <h2 id="catalog-title" className="relative m-0 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">เลือกเครื่องมือ</h2>
            <p className="relative mb-0 mt-1 text-xs font-medium text-slate-600" aria-live="polite">พบ {filteredTools.length} รายการ</p>
            <div className="relative mt-4 grid grid-cols-3 gap-1.5 rounded-full bg-white/75 p-1 shadow-sm ring-1 ring-white">
              {viewOptions.map(({ value, label }) => (
                <button key={value} type="button" aria-pressed={view === value} onClick={() => setView(value)} className={`inline-flex min-h-8 items-center justify-center whitespace-nowrap rounded-full px-1.5 text-[10px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:px-2 sm:text-[11px] ${view === value ? "bg-gradient-to-r from-blue-700 to-sky-500 text-white shadow-sm" : "text-slate-600 hover:bg-blue-50 hover:text-blue-800"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 p-[1.5px] shadow-[0_8px_28px_rgba(59,130,246,.15)]">
            <div className="rounded-[15px] bg-white/95 p-3 sm:p-3.5">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1.5fr)_minmax(190px,.7fr)] sm:items-end">
                <div>
                  <label htmlFor="tool-search" className="mb-1.5 block text-sm font-medium text-slate-700">ค้นหาเครื่องมือ</label>
                  <div className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 shadow-[0_3px_10px_rgba(15,23,42,.08)] transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
                    <Search size={19} className="shrink-0 text-slate-500" aria-hidden="true" />
                    <input id="tool-search" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="ค้นหาจากชื่อเครื่องมือ..." value={query} onChange={(event) => setQuery(event.target.value)} aria-describedby="tool-search-hint" />
                    {query && <button type="button" onClick={() => setQuery("")} className="rounded-md px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50">ล้าง</button>}
                  </div>
                </div>

                <div>
                  <label htmlFor="category-filter" className="mb-1.5 block text-sm font-medium text-slate-700">หมวดหมู่</label>
                  <div className="relative">
                    <Grid2X2 size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <select id="category-filter" value={category} onChange={(event) => setCategory(event.target.value as CategoryFilter)} className="min-h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
                      {categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                    </select>
                    <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">⌄</span>
                  </div>
                </div>
              </div>
              <p id="tool-search-hint" className="sr-only">ค้นหาจากชื่อเครื่องมือ คำอธิบาย หรือหมวดหมู่</p>
              <div className="mt-2 flex flex-wrap gap-2" aria-label="คำค้นแนะนำ">
                {suggestions.map((suggestion) => <button key={suggestion.query} type="button" onClick={() => { setQuery(suggestion.query); setCategory("ALL"); }} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800">{suggestion.label}</button>)}
              </div>
            </div>
          </div>
        </div>

        {filteredTools.length > 0 ? (
          <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
            {filteredTools.map((tool) => (
              <li key={tool.id}>
                <Link href={tool.href} className="group relative flex h-full min-h-56 flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_5px_16px_rgba(15,23,42,.07)] transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_14px_28px_rgba(59,130,246,.17)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:p-6">
                  <DecorativeToolIcon tool={tool} />
                  <div className="flex items-center gap-3">
                    <ToolIcon tool={tool} />
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getAccent(tool)}`}>{categoryLabels[tool.category]}</span>
                  </div>
                  <div className="mt-4 flex-1">
                    <h3 className="m-0 pr-11 text-lg font-bold leading-snug text-slate-900 sm:text-xl">{tool.name}</h3>
                    <p className="mb-0 mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{tool.description}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-gradient-to-r from-blue-700 to-sky-500 px-3.5 text-xs font-semibold text-white shadow-sm shadow-blue-700/20 transition group-hover:from-blue-800 group-hover:to-sky-600">
                      เปิดเครื่องมือ<ArrowRight size={15} strokeWidth={1.9} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                    </span>
                    <span aria-hidden="true" className="grid size-8 place-items-center rounded-full text-blue-700 transition group-hover:translate-x-0.5 group-hover:bg-blue-50"><ArrowUpRight size={19} /></span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center shadow-sm">
            <Search size={28} className="mx-auto text-slate-400" aria-hidden="true" />
            <h3 className="mb-0 mt-3 text-lg font-semibold">ไม่พบเครื่องมือที่ค้นหา</h3>
            <p className="mb-0 mt-2 text-sm text-slate-600">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น</p>
            <button type="button" onClick={() => { setQuery(""); setCategory("ALL"); }} className="mt-4 min-h-10 rounded-lg bg-blue-50 px-4 text-sm font-semibold text-blue-800 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">ล้างตัวกรอง</button>
          </div>
        )}
      </section>
    </main>
  );
}
