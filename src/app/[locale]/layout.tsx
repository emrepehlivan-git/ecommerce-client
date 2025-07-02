import "./globals.css";

import { Poppins } from "next/font/google";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import AuthSessionProvider from "@/providers/auth-session-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { BackToTop } from "@/components/ui/back-to-top";
import { I18nProviderClient } from "@/i18n/client";
import { StoreInitializer } from "@/stores/StoreInitializer";

const font = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
});


export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  const session = await auth();
  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", font.variable)}>
        <I18nProviderClient locale={locale}>
          <AuthSessionProvider session={session}>
            <QueryProvider>
              <StoreInitializer session={session} />
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">{children}</main>
              </div>
              <Toaster />
              <BackToTop />
            </QueryProvider>
          </AuthSessionProvider>
        </I18nProviderClient>
      </body>
    </html>
  );
}
