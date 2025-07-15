import { useI18n } from "./client";

export function useT(): (key: string) => string {
  const i18n = useI18n() as any;
  if (typeof i18n === "function") return i18n;
  if (i18n && typeof i18n.t === "function") return i18n.t;
  return (k: string) => k;
} 