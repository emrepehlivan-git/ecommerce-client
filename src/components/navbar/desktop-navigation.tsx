import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CategoryDto } from "@/api/generated/model";

interface DesktopNavigationProps {
  categories: CategoryDto[];
}

export function DesktopNavigation({ categories }: DesktopNavigationProps) {
  const pathname = usePathname();
 
  return (
    <div className="hidden md:block">
      <ScrollArea className="w-full whitespace-nowrap">
        <nav className="flex items-center gap-1 pb-2">
          {categories.map((category) => {
            return (
              <Button
                key={category.id}
                variant="ghost"
                className={cn(
                  "text-sm font-medium transition-colors hover:bg-primary/10 px-3 py-2 h-auto flex-shrink-0",
                  pathname?.startsWith(`/category/${category.id}`) ? "text-primary bg-primary/10" : "text-gray-700"
                )}
                asChild
              >
                <Link href={`/category/${category.id}`}>
                  {category.name}
                </Link>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}
