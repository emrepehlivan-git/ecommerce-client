import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/stores/useAppStore";
import LoginButton from "@/components/auth/login-button";
import LogoutButton from "@/components/auth/logout-button";
import Link from "next/link";
import { useI18n } from "@/i18n/client";
import { LogOut } from "lucide-react";

export function UserNav() {
  const { data: session } = useSession();
  const { user } = useAppStore();
  const t = useI18n();
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  if (!session) {
    return <LoginButton />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.picture ?? undefined} alt={user?.name ?? ""} />
          <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
            <Link href="/profile">{t("user_actions.my_account")}</Link>
        </DropdownMenuItem>
        {user?.role?.includes("Admin") && (
          <DropdownMenuItem asChild>
            <Link href="/admin">{t("user_actions.admin_panel")}</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} variant="destructive">
            <LogOut />
            {t("user_actions.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 