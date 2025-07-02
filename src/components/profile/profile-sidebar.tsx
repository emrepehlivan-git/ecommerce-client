"use client";
import { MapPin, Package, Pencil, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { User } from "next-auth";
import { useState } from "react";
import EditProfileModal from "./edit-profile-modal";

interface ProfileSidebarProps {
  user: User;
}

export default function ProfileSidebar({ user }: ProfileSidebarProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const links = [
    {
      href: "/profile/orders",
      label: "Orders",
      icon: Package,
    },
    {
      href: "/profile/addresses",
      label: "Addresses",
      icon: MapPin,
    },
    {
      href: "/profile/reviews",
      label: "Reviews",
      icon: Star,
    },
  ];

  // Kullanıcı bilgilerinin default değerleri
  const defaultProfileValues = {
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    birthDate: "",
  };

  return (
    <>
      <aside className="w-72 mr-8 bg-white rounded-xl shadow-md p-6 flex flex-col gap-6 h-fit">
        <div className="flex flex-col items-start gap-2">
          <span className="font-semibold text-lg">{user?.name}</span>
          <span className="text-sm text-muted-foreground font-medium">{user?.email}</span>
          <Button
            variant="outline"
            className="w-full mt-5"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Pencil className="size-4" />
            Edit Profile
          </Button>
        </div>
        <nav className="flex flex-col gap-2 mt-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="p-2 rounded-md hover:bg-accent transition flex items-center gap-2 font-medium"
            >
              <link.icon className="size-5 text-muted-foreground" /> {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        defaultValues={defaultProfileValues}
      />
    </>
  );
}
