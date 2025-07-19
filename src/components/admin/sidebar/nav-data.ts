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

export const getNavMain = (t: (key: string) => string) => ([
  {
    title: t("admin.sidebar.goToApp"),
    url: "/",
    icon: Home,
  },
  {
    title: t("admin.sidebar.dashboard"),
    url: "/admin",
    icon: Home,
    isActive: true,
  },
  {
    title: t("admin.sidebar.identityManagement"),
    url: "/admin/users",
    icon: Users,
    items: [
      {
        title: t("admin.sidebar.allUsers"),
        url: "/admin/users",
      },
      {
        title: t("admin.sidebar.roles"),
        url: "/admin/roles",
      },
    ],
  },
  {
    title: t("admin.sidebar.categories"),
    url: "/admin/categories",
    icon: FileText,
  },
  {
    title: t("admin.sidebar.products"),
    url: "/admin/products",
    icon: FileText,
  },
  {
    title: t("admin.sidebar.orders"),
    url: "/admin/orders",
    icon: BarChart3,
  },
  {
    title: t("admin.sidebar.stockManagement"),
    url: "/admin/stock",
    icon: Zap,
  },
]);

export const getNavSecondary = (t: (key: string) => string) => ([
  {
    title: t("admin.sidebar.settings"),
    url: "/admin/settings",
    icon: Settings,
    items: [
      {
        title: t("admin.sidebar.emailSettings"),
        url: "/admin/settings/email",
      },
      {
        title: "Cloudinary Settings",
        url: "/admin/settings/cloudinary",
      },
    ],
  },
  {
    title: t("admin.sidebar.security"),
    url: "/admin/security",
    icon: Shield,
  },
]);
