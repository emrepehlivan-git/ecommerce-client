import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { hasRole } from "@/lib/auth-utils"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!hasRole(session, "Admin")) {
    redirect("/")
  }

  return (
    <html lang="tr">
      <body>
        <SidebarProvider>
          <AdminSidebar />
          <main className="w-full px-4">
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  )
}