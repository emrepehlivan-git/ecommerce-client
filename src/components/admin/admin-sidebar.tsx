"use client"

import type * as React from "react"

import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar"
import { navMain, navSecondary } from "./sidebar/nav-data"
import { AdminSidebarHeader } from "./sidebar/sidebar-header"
import { AdminSidebarFooter } from "./sidebar/sidebar-footer"
import { AdminSidebarNav } from "./sidebar/sidebar-nav"

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
