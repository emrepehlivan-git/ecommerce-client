import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";
import type { CategoryDto } from "@/api/generated/model";

interface CategoryNavigationProps {
  categories: CategoryDto[];
  showAll?: boolean;
  maxVisible?: number;
}

export function CategoryNavigation({ 
  categories, 
  showAll = false, 
  maxVisible = 8 
}: CategoryNavigationProps) {
  const pathname = usePathname();
  
  const displayCategories = showAll ? categories : categories.slice(0, maxVisible);
  const remainingCount = categories.length - maxVisible;

  return (
    <div className="w-full">
      <ScrollArea className="w-full">
        <div className="flex items-center gap-2 pb-2 min-w-max">
          {displayCategories.map((category) => {
            const href = `/category/${category.id}`;
            const isActive = pathname?.startsWith(href);
            
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "flex-shrink-0 transition-all duration-200 whitespace-nowrap",
                  isActive 
                    ? "bg-primary hover:bg-primary/90 text-white" 
                    : "hover:bg-primary/10 hover:text-primary text-gray-700"
                )}
                asChild
              >
                <Link href={href}>
                  {category.name}
                </Link>
              </Button>
            );
          })}
          
          {!showAll && remainingCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0 text-gray-500 hover:text-gray-700"
            >
              <ChevronRight className="h-3 w-3 mr-1" />
              +{remainingCount} daha
            </Button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
} 