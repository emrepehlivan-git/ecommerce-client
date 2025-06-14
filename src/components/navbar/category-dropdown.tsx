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
      variant="link"
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        pathname?.startsWith(href) ? "text-primary" : "text-foreground"
      )}
    >
      <Link href={href}>{category.name}</Link>
    </Button>
  );
}
