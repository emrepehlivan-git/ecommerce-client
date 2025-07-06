"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useI18n } from "@/i18n/client";

export default function LoginButton() {
  const t = useI18n();

  const handleSignIn = () => {
    signIn("keycloak");
  };

  return (
    <Button onClick={handleSignIn} type="button" variant="outline">
      <LogIn className="size-3.5" />
      {t("user_actions.login")}
    </Button>
  );
}
