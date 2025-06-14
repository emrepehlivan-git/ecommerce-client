import Link from "next/link";
import { User, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import LogoutButton from "../auth/logout-button";
import LoginButton from "../auth/login-button";

interface UserActionsProps {
  cartItemCount: number;
}

export function UserActions({ cartItemCount }: UserActionsProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <>
        <div className="hidden md:flex md:items-center md:gap-2 ml-auto">
          <Button variant="ghost" size="icon" disabled>
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" disabled>
            <Heart className="h-5 w-5" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="relative" disabled>
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <div className="hidden md:flex md:items-center md:gap-2 ml-auto">
          <LoginButton />
        </div>
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link href="/sepet">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Sepetim</span>
            {cartItemCount > 0 && (
              <Badge
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                variant="destructive"
              >
                {cartItemCount}
              </Badge>
            )}
          </Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <div className="hidden md:flex md:items-center md:gap-2 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Hesabım</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Hesap Bilgilerim</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/siparislerim">Siparişlerim</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/favoriler">Favorilerim</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <LogoutButton className="w-full" variant="ghost" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" asChild>
          <Link href="/favoriler">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Favorilerim</span>
          </Link>
        </Button>
      </div>

      <Button variant="ghost" size="icon" className="relative" asChild>
        <Link href="/sepet">
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Sepetim</span>
          {cartItemCount > 0 && (
            <Badge
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
              variant="destructive"
            >
              {cartItemCount}
            </Badge>
          )}
        </Link>
      </Button>
    </>
  );
}
