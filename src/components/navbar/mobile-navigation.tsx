import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, User, ShoppingCart, Folder, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

interface MobileNavigationProps {
  cartItemCount: number;
  categories: CategoryDto[];
}

export function MobileNavigation({
  cartItemCount,
  categories,
}: MobileNavigationProps) {
  const pathname = usePathname();

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
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Home className="mr-3 h-4 w-4" />
                    Ana Sayfa
                  </Link>
                </SheetClose>
                
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
                          href={`/kategori/${category.id}`}
                          className={cn(
                            "flex items-center p-3 rounded-lg text-sm font-medium transition-colors",
                            pathname === `/kategori/${category.id}`
                              ? "bg-blue-100 text-blue-700"
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-400 mr-3" />
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
              <Button asChild className="w-full justify-start bg-blue-600 hover:bg-blue-700 h-12">
                <Link href="/cart">
                  <ShoppingCart className="mr-3 h-4 w-4" />
                  Sepetim
                  {cartItemCount > 0 && (
                    <Badge variant="secondary" className="ml-auto bg-white text-blue-600 font-semibold">
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
