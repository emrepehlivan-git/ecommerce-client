import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/stores/useAppStore";
import LoginButton from "../auth/login-button";
import LogoutButton from "../auth/logout-button";
import Link from "next/link";

export function UserNav() {
  const { data: session } = useSession();
  const { user, isLoadingUser } = useAppStore();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  if (isLoadingUser) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

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
          <Link href="/profile">{/* <User className="mr-2 h-4 w-4" /> */} Profil</Link>
        </DropdownMenuItem>
        {user?.role?.includes("Admin") && (
          <DropdownMenuItem asChild>
            <Link href="/admin">{/* <Shield className="mr-2 h-4 w-4" /> */} Yönetim</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 