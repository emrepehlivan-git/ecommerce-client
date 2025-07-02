import { logoutServerAction } from "./logout-server-action";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";

export default function LogoutButton({
  className,
  variant = "ghost",
}: {
  className?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
}) {
  return (
    <form action={logoutServerAction}>
      <Button type="submit" variant={variant} className={cn(className)}>
        <LogOut className="mr-2 size-3.5" />
        Logout
      </Button>
    </form>
  );
}
