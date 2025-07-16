"use client";

import { useInitializeCart } from "@/stores/useAppStore";
import { Session } from "next-auth";

interface CartProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export function CartProvider({ children, session }: CartProviderProps) {
  useInitializeCart(session);
  return <>{children}</>;
}