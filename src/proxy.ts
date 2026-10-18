import { NextResponse, type NextRequest } from "next/server";
import { LOCALES } from "@/lib/i18n";

// 언어가 없는 주소는 브라우저 언어로 /ko 또는 /en 에 보낸다.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (LOCALES.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))) return;

  // 가장 먼저 원하는 언어가 한국어면 ko, 아니면 en.
  const preferred = request.headers.get("accept-language")?.split(",")[0]?.trim().toLowerCase() ?? "";
  const locale = preferred.startsWith("ko") ? "ko" : "en";
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
