"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "./index";
import { CartProvider } from "@/contexts/cart-context";

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <Navbar />
      {children}
    </CartProvider>
  );
} 