"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max: number;
  disabled?: boolean;
}

export function QuantitySelector({ 
  quantity, 
  onQuantityChange, 
  min = 1, 
  max, 
  disabled = false 
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center border rounded-md">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDecrease}
        disabled={disabled || quantity <= min}
        className="h-8 w-8"
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <span className="px-4 py-2 text-center min-w-[50px]">
        {quantity}
      </span>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleIncrease}
        disabled={disabled || quantity >= max}
        className="h-8 w-8"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
} 