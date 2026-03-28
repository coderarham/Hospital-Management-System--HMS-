import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { ROLE_DASHBOARDS, UserRole } from "@/types";

const PUBLIC_PATHS = ["/", "/login", "/staff-select", "/doctors", "/services", "/about", "/contact", "/terms", "/privacy"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  const decoded = verifyToken(token || "") as { id: string; role: UserRole; name: string } | null;

  if (!decoded) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const allowedBase = ROLE_DASHBOARDS[decoded.role];
  if (pathname.startsWith("/admin") && decoded.role !== "Admin") {
    return NextResponse.redirect(new URL(allowedBase, req.url));
  }
  if (pathname.startsWith("/doctor") && decoded.role !== "Doctor") {
    return NextResponse.redirect(new URL(allowedBase, req.url));
  }
  if (pathname.startsWith("/patient") && decoded.role !== "Patient") {
    return NextResponse.redirect(new URL(allowedBase, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
