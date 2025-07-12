import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { redirect } from "next/navigation"
import { hasAdminAccess } from "@/lib/auth-utils"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdminUser = await hasAdminAccess();

  if (!isAdminUser) {
    redirect("/")
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="w-full px-4">
        <SidebarTrigger className="mb-3"/>
        {children}
      </main>
    </SidebarProvider>
  )
}