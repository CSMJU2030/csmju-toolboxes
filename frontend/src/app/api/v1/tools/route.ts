import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const backendUrl = process.env.TOOLBOXES_BACKEND_URL ?? "http://localhost:4237";
const sessionCookie = "csmju_toolboxes_access_token";

export async function GET() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHENTICATED", message: "กรุณาเข้าสู่ระบบผ่าน CSMJU ก่อนดูรายการเครื่องมือ" } },
      { status: 401 },
    );
  }

  try {
    const response = await fetch(`${backendUrl.replace(/\/$/, "")}/api/v1/tools`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const body = await response.json();
    return NextResponse.json(body, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "SERVICE_UNAVAILABLE", message: "ติดต่อระบบเครื่องมือไม่ได้ กรุณาลองอีกครั้ง" } },
      { status: 502 },
    );
  }
}
