import { redirect } from "next/navigation";
import ProfileSidebar from "@/components/profile/profile-sidebar";
import { auth } from "@/lib/auth";
import { User } from "next-auth";

export default async function ProfileLayout({
  children,
  orders,
  addresses,
  reviews,
}: {
  children: React.ReactNode;
  orders: React.ReactNode;
  addresses: React.ReactNode;
  reviews: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex justify-center py-10">
      <ProfileSidebar user={session?.user as User} />
      <div className="flex-1 max-w-xl">
        {orders}
        {addresses}
        {reviews}
        {children}
      </div>
    </div>
  );
}
