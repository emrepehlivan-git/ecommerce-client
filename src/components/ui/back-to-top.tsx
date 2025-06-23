"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Hint } from "./hint";

interface BackToTopProps {
  showAfter?: number;
  className?: string;
}

export function BackToTop({ showAfter = 300, className }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > showAfter) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

    if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Hint label="Başa dön" asChild>
        <Button
          onClick={scrollToTop}
          size="icon"
          variant="outline"
          className={cn(
            "size-8 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl animate-in fade-in-0 slide-in-from-bottom-2",
            className
          )}
          aria-label="Başa dön"
        >
          <ChevronUp className="size-4" />
        </Button>
      </Hint>
    </div>
  );
} 