import Link from "next/link";
import { User, ShoppingCart } from "lucide-react";
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
import { useSession, signIn } from "next-auth/react";
import LogoutButton from "../auth/logout-button";

interface UserActionsProps {
  cartItemCount: number;
}

export function UserActions({ cartItemCount }: UserActionsProps) {
  const { data: session, status } = useSession();

  const handleSignIn = () => {
    signIn("openiddict");
  };

  if (status === "loading") {
    return (
      <div className="flex items-center gap-4">
        <Button variant="ghost" disabled className="text-gray-600">
          <User className="h-5 w-5 mr-2" />
          Sign Up/Sign In
        </Button>
        <Button variant="ghost" size="icon" className="relative" disabled>
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={handleSignIn}
          className="text-gray-600 hover:text-blue-600"
        >
          <User className="h-5 w-5 mr-2" />
          Sign Up/Sign In
        </Button>
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link href="/sepet">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
            {cartItemCount > 0 && (
              <Badge
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs bg-blue-600"
                variant="default"
              >
                {cartItemCount}
              </Badge>
            )}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
            <User className="h-5 w-5 mr-2" />
            My Account
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">Account Information</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/siparislerim">My Orders</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/favoriler">My Favorites</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <LogoutButton className="w-full" variant="ghost" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="ghost" size="icon" className="relative" asChild>
        <Link href="/sepet">
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Cart</span>
          {cartItemCount > 0 && (
            <Badge
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs bg-blue-600"
              variant="default"
            >
              {cartItemCount}
            </Badge>
          )}
        </Link>
      </Button>
    </div>
  );
}
