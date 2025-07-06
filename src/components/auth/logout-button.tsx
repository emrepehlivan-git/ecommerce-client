import { logoutServerAction } from "./logout-server-action";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { useI18n } from "@/i18n/client";

export default function LogoutButton({
  className,
  variant = "ghost",
}: {
  className?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
}) {
  const t = useI18n();

  return (
    <form action={logoutServerAction}>
      <Button type="submit" variant={variant} className={cn(className)}>
        <LogOut className="mr-2 size-3.5" />
        {t("user_actions.logout")}
      </Button>
    </form>
  );
}
