import { MapPin, Package, Pencil, Star } from "lucide-react";
import Link from "next/link";
import LogoutButton from "../auth/logout-button";
import { Button } from "../ui/button";
import { User } from "next-auth";

interface ProfileSidebarProps {
  user: User;
}

export default function ProfileSidebar({ user }: ProfileSidebarProps) {
  const links = [
    {
      href: "/profile/orders",
      label: "Siparişlerim",
      icon: Package,
    },
    {
      href: "/profile/addresses",
      label: "Adreslerim",
      icon: MapPin,
    },
    {
      href: "/profile/reviews",
      label: "Değerlendirmelerim",
      icon: Star,
    },
  ];

  return (
    <aside className="w-72 mr-8 bg-white rounded-xl shadow-md p-6 flex flex-col gap-6 h-fit">
      <div className="flex flex-col items-start gap-2">
        <span className="font-semibold text-lg">{user?.name}</span>
        <span className="text-sm text-muted-foreground font-medium">
          {user?.email}
        </span>
        <Link href="/profile/edit">
          <Button variant="outline" className="w-full mt-5">
            <Pencil className="size-4" />
            Profili Düzenle
          </Button>
        </Link>
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
        <LogoutButton className="w-full" variant="destructiveOutline" />
      </nav>
    </aside>
  );
}
