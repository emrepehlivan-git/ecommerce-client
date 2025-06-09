import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, User, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { categories } from "./category-data";

interface MobileNavigationProps {
  cartItemCount: number;
}

export function MobileNavigation({ cartItemCount }: MobileNavigationProps) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menü</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <div className="flex flex-col gap-6 py-6">
          <div className="flex items-center justify-between">
            <Logo />
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
                <span className="sr-only">Kapat</span>
              </Button>
            </SheetClose>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Ürün, kategori veya marka ara..."
              className="w-full pl-8"
            />
          </div>
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              className={cn(
                "flex items-center rounded-md px-2 py-1.5 text-sm font-medium",
                pathname === "/"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              )}
            >
              Ana Sayfa
            </Link>
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={cn(
                  "flex items-center rounded-md px-2 py-1.5 text-sm font-medium",
                  pathname === category.href
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                )}
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/kampanyalar"
              className={cn(
                "flex items-center rounded-md px-2 py-1.5 text-sm font-medium text-destructive",
                pathname === "/kampanyalar"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              )}
            >
              Kampanyalar
            </Link>
          </nav>
          <div className="flex flex-col gap-2">
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/hesabim">
                <User className="mr-2 h-4 w-4" />
                Hesabım
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/favoriler">
                <Heart className="mr-2 h-4 w-4" />
                Favorilerim
              </Link>
            </Button>
            <Button asChild className="w-full justify-start">
              <Link href="/sepet">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Sepetim
                {cartItemCount > 0 && (
                  <Badge
                    variant="outline"
                    className="ml-2 bg-primary text-primary-foreground"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
