import { type NextRequest, NextResponse } from "next/server";
import { getAuth } from "./action/auth";

export async function proxy(req: NextRequest) {
  const auth = await getAuth();

  const signInPage = req.nextUrl.pathname.startsWith("/sign-in");
  const signUpPage = req.nextUrl.pathname.startsWith("/sign-up");

  if (!signUpPage && !auth) {
    return NextResponse.redirect(new URL("/sign-up", req.url));
  }

  if (auth && signUpPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!signInPage && !auth) {
    return NextResponse.redirect(new URL("/sign-up", req.url));
  }

  if (auth && signInPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
