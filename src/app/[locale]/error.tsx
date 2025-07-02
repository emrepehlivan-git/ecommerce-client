"use client";

import { useEffect } from "react";
import { useI18n } from "@/i18n/client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useI18n();

  useEffect(() => {
    console.error(t("errorPage.consoleError"), error);
  }, [error, t]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("errorPage.welcome")}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("errorPage.description")}</p>
      </div>

      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t("errorPage.featuredProductsErrorTitle")}
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">{t("errorPage.featuredProductsErrorMessage")}</p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t("errorPage.tryAgain")}
        </button>
      </div>
    </div>
  );
}
