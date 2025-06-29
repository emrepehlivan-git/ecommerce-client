import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import AuthSessionProvider from "@/providers/auth-session-provider";
import { auth } from "@/lib/auth";
import { BackToTop } from "@/components/ui/back-to-top";
import NavbarWrapper from "@/components/navbar/navbar-wrapper";

const font = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s",
    default: "ECommerce",
  },
  description: "ECommerce app",
  keywords: ["ECommerce"],
  alternates: {
    canonical: "/",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <QueryProvider>
          <AuthSessionProvider session={session}>
            <NavbarWrapper>{children}</NavbarWrapper>
          </AuthSessionProvider>
        </QueryProvider>
        <BackToTop />
        <Toaster />
      </body>
    </html>
  );
}
