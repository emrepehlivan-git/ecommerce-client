"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Truck } from "lucide-react";

export function TopBar() {
  return (
    <div className="hidden bg-gray-100 px-4 py-2 text-sm md:flex md:items-center md:justify-between">
      <div className="flex items-center">
        <span className="text-gray-600">Welcome to worldwide Megamart!</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">Deliver to</span>
          <span className="font-medium">423651</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-gray-500" />
          <Link href="/track-order" className="text-gray-600 hover:text-blue-600">
            Track your order
          </Link>
        </div>
        <Link href="/offers" className="text-gray-600 hover:text-blue-600">
          All Offers
        </Link>
      </div>
    </div>
  );
}
