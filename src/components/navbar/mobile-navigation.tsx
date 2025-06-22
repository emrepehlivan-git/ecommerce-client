import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, User, ShoppingCart } from "lucide-react";
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
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <div className="flex flex-col gap-6 py-6">
          <div className="flex items-center justify-between">
            <Logo />
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search essentials, groceries and more..."
              className="w-full pl-8"
            />
          </div>
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              className={cn(
                "flex items-center rounded-md px-2 py-1.5 text-sm font-medium",
                pathname === "/"
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-50"
              )}
            >
              Home
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/kategori/${category.id}`}
                className={cn(
                  "flex items-center rounded-md px-2 py-1.5 text-sm font-medium",
                  pathname === `/kategori/${category.id}`
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-50"
                )}
              >
                {category.name}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2">
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                My Account
              </Link>
            </Button>
            <Button asChild className="w-full justify-start bg-blue-600 hover:bg-blue-700">
              <Link href="/sepet">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart
                {cartItemCount > 0 && (
                  <Badge
                    variant="outline"
                    className="ml-2 bg-white text-blue-600 border-white"
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
