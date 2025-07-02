import { auth } from "@/lib/auth";
import { createI18nMiddleware } from "next-international/middleware";
import { defaultLocale, locales } from "@/i18n";

const I18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale,
  urlMappingStrategy: "rewrite",
});

export default auth((req) => {
  return I18nMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
