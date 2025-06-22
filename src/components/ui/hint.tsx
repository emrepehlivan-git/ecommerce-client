"use client";

import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface HintProps {
  children: ReactNode;
  label: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  asChild?: boolean;
}

export function Hint({
  children,
  label,
  side = "top",
  align = "center", 
  sideOffset = 0,
  asChild = false
}: HintProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild={asChild}>
        {children}
      </TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        sideOffset={sideOffset}
      >
        <p className="font-medium text-xs">
          {label}
        </p>
      </TooltipContent>
    </Tooltip>
  );
} 