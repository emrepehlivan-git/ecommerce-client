"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function LoginButton() {
  const handleSignIn = () => {
    signIn("openiddict");
  };

  return (
    <Button onClick={handleSignIn} type="button" variant="outline">
      <LogIn className="size-3.5" />
      Giriş Yap
    </Button>
  );
}
