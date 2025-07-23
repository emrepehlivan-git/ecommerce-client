import { auth } from "@/lib/auth";
import { createI18nMiddleware } from "next-international/middleware";
import { defaultLocale, locales } from "@/i18n";
import { NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/auth-utils";

const I18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale,
  urlMappingStrategy: "rewrite",
});

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // Temporarily disabled for testing
  // if (pathname.includes('/admin')) {
  //   if (!req.auth?.user) {
  //     const loginUrl = new URL('/', req.url);
  //     return NextResponse.redirect(loginUrl);
  //   }
  //   
  //   const hasAdmin = checkAdminAccess(req.auth.user.roles);
  //   if (!hasAdmin) {
  //     const homeUrl = new URL('/', req.url);
  //     return NextResponse.redirect(homeUrl);
  //   }
  // }
  
  return I18nMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
