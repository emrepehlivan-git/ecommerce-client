import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CategoryDto } from "@/api/generated/model";

interface CategoryDropdownProps {
  category: CategoryDto;
}

export function CategoryDropdown({ category }: CategoryDropdownProps) {
  const pathname = usePathname();
  const href = `/kategori/${category.id}`;

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "text-sm font-medium transition-colors hover:text-blue-600 hover:bg-blue-50 px-3 py-2 h-auto",
        pathname?.startsWith(href) ? "text-blue-600 bg-blue-50" : "text-gray-700"
      )}
    >
      <Link href={href}>{category.name}</Link>
    </Button>
  );
}
