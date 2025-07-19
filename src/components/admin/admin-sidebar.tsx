"use client"

import type * as React from "react"

import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar"
import { getNavMain, getNavSecondary } from "./sidebar/nav-data"
import { AdminSidebarHeader } from "./sidebar/sidebar-header"
import { AdminSidebarFooter } from "./sidebar/sidebar-footer"
import { AdminSidebarNav } from "./sidebar/sidebar-nav"
import { useI18n } from "@/i18n/client"

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useI18n()
  const navMain = getNavMain(t)
  const navSecondary = getNavSecondary(t)

  return (
    <Sidebar collapsible="icon" {...props}>
      <AdminSidebarHeader />
      <SidebarContent>
        <AdminSidebarNav label="Platform" navItems={navMain} />
        <AdminSidebarNav label="Administration" navItems={navSecondary} className="group-data-[collapsible=icon]:hidden" />
      </SidebarContent>
      <AdminSidebarFooter />
      <SidebarRail />
    </Sidebar>
  )
}
