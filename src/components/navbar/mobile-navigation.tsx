import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, ShoppingCart, Folder, Home, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import type { CategoryDto } from "@/api/generated/model";
import { useSession } from "next-auth/react";
import { hasRole } from "@/lib/auth-utils";

interface MobileNavigationProps {
  cartItemCount: number;
  categories: CategoryDto[];
}

export function MobileNavigation({
  cartItemCount,
  categories,
}: MobileNavigationProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden hover:bg-gray-100">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menü</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetTitle className="sr-only">Navigasyon Menüsü</SheetTitle>
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-blue-50">
            <Logo />
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-1">
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
                    Ana Sayfa
                  </Link>
                </SheetClose>
                
                {hasRole(session, "Admin") && (
                  <SheetClose asChild>
                    <Link
                      href="/admin"
                      className={cn(
                        "flex items-center p-3 rounded-lg text-sm font-medium transition-colors",
                        pathname === "/admin"
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <Shield className="mr-3 h-4 w-4" />
                      Admin Paneli
                    </Link>
                  </SheetClose>
                )}
                
                {/* Kategoriler */}
                <div className="mt-6">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <Folder className="inline mr-2 h-3 w-3" />
                    Kategoriler
                  </div>
                  
                  <div className="space-y-1 mt-2">
                    {categories.map((category) => (
                      <SheetClose key={category.id} asChild>
                        <Link
                          href={`/category/${category.id}`}
                          className={cn(
                            "flex items-center p-3 rounded-lg text-sm font-medium transition-colors",
                            pathname === `/category/${category.id}`
                              ? "bg-primary/10 text-primary"
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          <div className="w-2 h-2 rounded-full bg-primary mr-3" />
                          {category.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
          
          {/* Footer */}
          <div className="border-t p-4 space-y-3 bg-gray-50">
            <SheetClose asChild>
              <Button variant="outline" asChild className="w-full justify-start h-12">
                <Link href="/profile">
                  <User className="mr-3 h-4 w-4" />
                  Hesabım
                </Link>
              </Button>
            </SheetClose>
            
            <SheetClose asChild>
              <Button asChild className="w-full justify-start bg-primary hover:bg-primary/90 h-12">
                <Link href="/cart">
                  <ShoppingCart className="mr-3 h-4 w-4" />
                  Sepetim
                  {cartItemCount > 0 && (
                    <Badge variant="secondary" className="ml-auto bg-white text-primary font-semibold">
                      {cartItemCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
