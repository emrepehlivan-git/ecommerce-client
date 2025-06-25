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
  const href = `/category/${category.id}`;

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary hover:bg-primary/10 px-3 py-2 h-auto",
        pathname?.startsWith(href) ? "text-primary bg-primary/10" : "text-gray-700"
      )}
    >
      <Link href={href}>{category.name}</Link>
    </Button>
  );
}
