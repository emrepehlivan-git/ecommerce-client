import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Category } from "./category-data";

interface CategoryDropdownProps {
  category: Category;
}

export function CategoryDropdown({ category }: CategoryDropdownProps) {
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="link"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname?.startsWith(category.href)
              ? "text-primary"
              : "text-foreground"
          )}
        >
          {category.name} <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Alt Kategoriler</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`${category.href}/yeni-gelenler`}>Yeni Gelenler</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`${category.href}/cok-satanlar`}>Çok Satanlar</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`${category.href}/indirimli`}>İndirimli Ürünler</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
