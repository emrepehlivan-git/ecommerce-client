import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CategoryDto } from "@/api/generated/model";

interface DesktopNavigationProps {
  categories: CategoryDto[];
}

export function DesktopNavigation({ categories }: DesktopNavigationProps) {
  const pathname = usePathname();
 
  return (
    <nav className="hidden md:flex md:items-center md:gap-1">
      {categories.map((category) => {
        return (
          <Button
            key={category.id}
            variant="ghost"
            className={cn(
              "text-sm font-medium transition-colors hover:text-blue-600 hover:bg-blue-50 px-3 py-2 h-auto",
              pathname?.startsWith(`/kategori/${category.id}`) ? "text-blue-600 bg-blue-50" : "text-gray-700"
            )}
            asChild
          >
            <Link href={`/kategori/${category.id}`} className="flex items-center gap-1">
              {category.name}
              <ChevronDown className="h-3 w-3" />
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
