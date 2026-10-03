import type { Metadata } from "next";

import ToolCatalog from "./tool-catalog";

export const metadata: Metadata = {
  title: "เครื่องมือดิจิทัล | CS Toolboxes",
  description: "รวมเครื่องมือดิจิทัลสำหรับการเรียนและการทำงานของนักศึกษาวิทยาการคอมพิวเตอร์",
};

export default function Home() {
  return <ToolCatalog />;
}
