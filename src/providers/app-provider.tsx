"use client";

import { Toaster } from "@/components/ui/sonner";
import { I18nProviderClient } from "@/i18n/client";
import { Session } from "next-auth";
import AuthSessionProvider from "./auth-session-provider";
import { QueryProvider } from "./query-provider";
import { BackToTop } from "@/components/ui/back-to-top";
import { initializeStore } from "@/stores/useAppStore";
import { CartProvider } from "./cart-provider";

interface UserData {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  roles?: string[] | null;
  [key: string]: any;
}

export function AppProvider({
  children,
  locale,
  session,
  userInfo,
}: {
  children: React.ReactNode;
  locale: string;
  session: Session | null;
  userInfo: UserData | null;
}) {
  initializeStore(userInfo);
  return (
    <I18nProviderClient locale={locale}>
      <AuthSessionProvider session={session}>
        <QueryProvider>
          <CartProvider session={session}>
            {children}
            <Toaster />
            <BackToTop />
          </CartProvider>
        </QueryProvider>
      </AuthSessionProvider>
    </I18nProviderClient>
  );
} 