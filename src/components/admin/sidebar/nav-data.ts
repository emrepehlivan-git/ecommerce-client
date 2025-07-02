import { BarChart3, FileText, Home, Settings, Shield, Users, Zap } from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  isActive?: boolean;
  items?: NavSubItem[];
};

export type NavSubItem = {
  title: string;
  url: string;
};

export const navMain: NavItem[] = [
  {
    title: "Go to app",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
    isActive: true,
  },
  {
    title: "Identity Management",
    url: "/admin/users",
    icon: Users,
    items: [
      {
        title: "All Users",
        url: "/admin/users",
      },
      {
        title: "Roles",
        url: "/admin/roles",
      },
    ],
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: FileText,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: FileText,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: BarChart3,
  },
  {
    title: "Stock Management",
    url: "/admin/stock",
    icon: Zap,
  },
];

export const navSecondary: NavItem[] = [
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Security",
    url: "/admin/security",
    icon: Shield,
  },
];
