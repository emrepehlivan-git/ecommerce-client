"use server";
import { signOut } from "@/lib/auth";

export async function logoutServerAction() {
  await signOut();
}
