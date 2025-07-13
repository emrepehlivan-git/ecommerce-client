"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { useSearchParams } from "next/navigation";

export default function LoginButton() {
  const t = useI18n();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const handleSignIn = (callbackUrl: string) => {
    signIn("keycloak", { callbackUrl });
  };

  return (
    <Button onClick={() => handleSignIn(returnUrl)} type="button" variant="outline">
      <LogIn className="size-3.5" />
      {t("user_actions.login")}
    </Button>
  );
}
