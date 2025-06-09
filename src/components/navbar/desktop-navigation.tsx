import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CategoryDropdown } from "./category-dropdown";
import { categories } from "./category-data";
import { Home } from "lucide-react";

export function DesktopNavigation() {
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
        <CategoryDropdown key={category.name} category={category} />
      ))}
      <Link
        href="/kampanyalar"
        className={cn(
          "text-sm font-medium text-destructive transition-colors hover:text-destructive/80",
          pathname === "/kampanyalar"
            ? "text-destructive/80"
            : "text-destructive"
        )}
      >
        Kampanyalar
      </Link>
    </nav>
  );
}
