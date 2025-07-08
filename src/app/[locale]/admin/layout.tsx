import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { redirect } from "next/navigation"
import { hasPermission, hasAdminAccess } from "@/lib/auth-utils"

export default async function Layout({ children }: { children: React.ReactNode }) {
  // Hem admin rolü hem de permission kontrolü yap
  const [canAccess, isAdminUser] = await Promise.all([
    hasPermission("AdminPanel.Access"),
    hasAdminAccess()
  ]);

  if (!canAccess && !isAdminUser) {
    redirect("/")
  }

  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <AdminSidebar />
          <main className="w-full px-4">
            <SidebarTrigger className="mb-3"/>
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  )
}