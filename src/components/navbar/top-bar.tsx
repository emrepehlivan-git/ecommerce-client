"use client";

import Link from "next/link";
import { MapPin, Truck } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-gray-100 px-4 py-2 text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-gray-600 text-xs sm:text-sm">MegaMart&apos;a hoş geldiniz!</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="hidden sm:flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Teslimat</span>
            <span className="font-medium">423651</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-gray-500" />
            <Link href="/" className="text-xs sm:text-sm">
              Siparişini takip et
            </Link>
          </div>
          <Link href="/" className="text-xs sm:text-sm hidden sm:inline">
            Tüm Kampanyalar
          </Link>
        </div>
      </div>
    </div>
  );
}
