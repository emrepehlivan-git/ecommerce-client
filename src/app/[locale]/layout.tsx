import { Inter } from "next/font/google";
import type { Metadata } from "next";

import "./globals.css";

import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import AuthSessionProvider from "@/providers/auth-session-provider";
import { auth } from "@/lib/auth";
import { BackToTop } from "@/components/ui/back-to-top";
import NavbarWrapper from "@/components/navbar/navbar-wrapper";
import { getCurrentLocale, getI18n } from "@/i18n/server";
import { I18nProviderClient } from "@/i18n/client";
import { cn } from "@/lib/utils";
import { getStaticParams } from "@/i18n/server";

const font = Inter({
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getI18n();
  return {
    title: {
      template: "%s | ECommerce",
      default: t("layout.metadata.title"),
    },
    description: t("layout.metadata.description"),
    keywords: [t("layout.metadata.keywords")],
    alternates: {
      canonical: "/",
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export function generateStaticParams() {
  return getStaticParams();
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  const session = await auth();
  const currentLocale = await getCurrentLocale();

  return (
    <html lang={currentLocale} suppressHydrationWarning>
      <body className={cn(font.className, "antialiased")}>
        <I18nProviderClient locale={locale}>
          <AuthSessionProvider session={session}>
            <QueryProvider>
              <NavbarWrapper>{children}</NavbarWrapper>
              <BackToTop />
              <Toaster />
            </QueryProvider>
          </AuthSessionProvider>
        </I18nProviderClient>
      </body>
    </html>
  );
}
