import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import AuthSessionProvider from "@/providers/auth-session-provider";
import { auth } from "@/lib/auth";

const font = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | ECommerce",
    default: "ECommerce app",
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
            <Navbar />
            {children}
          </AuthSessionProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
