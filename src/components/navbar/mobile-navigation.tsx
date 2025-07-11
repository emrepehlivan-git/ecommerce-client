import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { CategoryDto } from "@/api/generated/model";
import { Menu, Shield, Home, Folder } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Logo } from "./logo";
import LogoutButton from "@/components/auth/logout-button";
import { checkAdminAccess } from "@/lib/auth-utils";

interface MobileNavigationProps {
  categories: CategoryDto[];
}

export function MobileNavigation({ categories }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const t  = useI18n();
  
  const hasAdminRole = session?.user?.roles ? checkAdminAccess(session.user.roles) : false;

  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100%-80px)]">
          <nav className="mt-4 flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-2">
              <SheetClose asChild>
                <Link
                  href="/"
                  className={cn(
                    "flex items-center p-3 rounded-lg text-sm font-medium transition-colors",
                    pathname === "/"
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Home className="mr-3 h-4 w-4" />
                  {t("mobile_navigation.home")}
                </Link>
              </SheetClose>
              {hasAdminRole && (
                <SheetClose asChild>
                  <Link
                    href="/admin"
                    className={cn(
                      "flex items-center p-3 rounded-lg text-sm font-medium transition-colors",
                      pathname.startsWith("/admin")
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Shield className="mr-3 h-4 w-4" />
                    {t("mobile_navigation.admin")}
                  </Link>
                </SheetClose>
              )}
            </div>

            {/* Kategoriler */}
            <div className="flex flex-col gap-2">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <Folder className="inline mr-2 h-3 w-3" />
                {t("mobile_navigation.categories")}
              </h3>
              {categories.map((category) => (
                <SheetClose asChild key={category.id}>
                  <Link
                    href={`/category/${category.id}`}
                    className={cn(
                      "flex items-center p-3 rounded-lg text-sm font-medium transition-colors",
                      pathname === `/category/${category.id}`
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {category.name}
                  </Link>
                </SheetClose>
              ))}
            </div>

            {session && (
              <div className="mt-auto">
                <LogoutButton className="w-full!" variant="ghost" />
              </div>
            )}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
