import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CategoryDropdown } from "./category-dropdown";
import { Home } from "lucide-react";
import type { CategoryDto } from "@/api/generated/model";

interface DesktopNavigationProps {
  categories: CategoryDto[];
}

export function DesktopNavigation({ categories }: DesktopNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex md:items-center md:gap-6">
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-foreground"
        )}
      >
        <Home className="size-5 text-muted-foreground" />
      </Link>
      {categories.map((category) => (
        <CategoryDropdown key={category.id} category={category} />
      ))}
    </nav>
  );
}
