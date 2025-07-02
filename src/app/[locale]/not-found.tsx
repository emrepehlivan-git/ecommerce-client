"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useI18n } from "@/i18n/client";

export default function NotFound() {
  const t = useI18n();
  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-gray-50 text-gray-800 text-center p-8">
      <div className="relative mb-6 w-full max-w-md aspect-square">
        <Image
          src="/images/not-found.webp"
          alt={t("notFound.alt")}
          className="rounded-lg object-cover"
          priority
          fill
        />
      </div>
      <Link href="/">
        <Button variant="outline">
          <ArrowLeftIcon className="w-4 h-4" />
          {t("notFound.backToHome")}
        </Button>
      </Link>
    </div>
  );
}
