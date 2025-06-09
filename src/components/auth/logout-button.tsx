"use client";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <Button onClick={() => signOut()} variant="ghost" className="w-full">
      <LogOut className="mr-2 size-3.5" />
      Logout
    </Button>
  );
}
