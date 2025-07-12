import "./globals.css";

import { Poppins } from "next/font/google";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { AppProvider } from "@/providers/app-provider";
import { getUserInfo } from "@/lib/auth-utils";

const font = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Ecommerce",
  description: "Ecommerce",
  openGraph: {
    title: "Ecommerce",
    description: "Ecommerce",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  const session = await auth();
  const userInfo = session?.accessToken ? await getUserInfo(session.accessToken) : null;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", font.variable)}>
        <AppProvider session={session} locale={locale} userInfo={userInfo}>
          {children}
        </AppProvider>
      </body>
    </html>
  );
} 