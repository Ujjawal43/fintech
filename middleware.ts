import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin")) return NextResponse.next();

  const token = process.env.ADMIN_ACCESS_TOKEN;
  if (!token) return NextResponse.next();

  const headerToken = req.headers.get("x-admin-token") || req.cookies.get("admin_token")?.value;
  if (headerToken === token) return NextResponse.next();

  return new NextResponse("Unauthorized admin access. Set x-admin-token header or admin_token cookie.", { status: 401 });
}

export const config = {
  matcher: ["/admin/:path*"]
};
