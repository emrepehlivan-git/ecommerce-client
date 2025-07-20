import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Zap } from "lucide-react"
import Link from "next/link"
import { useT } from "@/i18n/getT"
import { LanguageSwitcher } from "@/components/navbar/language-switcher"

export function AdminSidebarHeader() {
  const t = useT();
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center justify-between w-full">
            <SidebarMenuButton size="lg" asChild className="flex-1">
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Zap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{t("admin.sidebar.adminPanel")}</span>
                  <span className="truncate text-xs">{t("admin.sidebar.enterprise")}</span>
                </div>
              </Link>
            </SidebarMenuButton>
            <div className="ml-2 group-data-[collapsible=icon]:hidden">
              <LanguageSwitcher />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
} 