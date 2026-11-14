import { type NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const auth = req.cookies.get("better-auth.session_token")?.value;

  const isAuthPage =
    req.nextUrl.pathname.startsWith("/sign-in") ||
    req.nextUrl.pathname.startsWith("/sign-up");

  if (!isAuthPage && !auth) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (isAuthPage && auth) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
