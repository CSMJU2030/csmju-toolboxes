import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const backendUrl = process.env.TOOLBOXES_BACKEND_URL ?? "http://localhost:4237";
const sessionCookie = "csmju_toolboxes_access_token";

async function proxy(request: Request, method: "GET" | "POST") {
  const token = (await cookies()).get(sessionCookie)?.value;
  const authorization = token
    ? `Bearer ${token}`
    : request.headers.get("authorization");
  if (!authorization) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "กรุณาเข้าสู่ระบบผ่าน CSMJU ก่อนใช้รายการเครื่องมือ" } },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const targetUrl = new URL(`${backendUrl.replace(/\/$/, "")}/api/v1/tools`);
    targetUrl.search = new URL(request.url).search;
    const response = await fetch(targetUrl, {
      method,
      headers: {
        Authorization: authorization,
        ...(method === "POST" ? { "Content-Type": request.headers.get("content-type") ?? "application/json" } : {}),
      },
      body: method === "POST" ? await request.text() : undefined,
      cache: "no-store",
    });
    const body = await response.json();
    return NextResponse.json(body, {
      status: response.status,
      headers: { "Cache-Control": "no-store", ...(response.headers.get("retry-after") ? { "Retry-After": response.headers.get("retry-after")! } : {}) },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "SERVICE_UNAVAILABLE", message: "ติดต่อระบบเครื่องมือไม่ได้ กรุณาลองอีกครั้ง" } },
      { status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "5" } },
    );
  }
}

export async function GET(request: Request) {
  return proxy(request, "GET");
}

export async function POST(request: Request) {
  return proxy(request, "POST");
}
