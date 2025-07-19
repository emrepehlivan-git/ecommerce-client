import { Suspense } from "react"
import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmailSettingsPageClient } from "@/components/admin/settings/email-settings-page-client"
import { getI18n } from "@/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18n()
  
  return {
    title: t("admin.settings.emailSettings.title"),
    description: t("admin.settings.emailSettings.description"),
  }
}

function EmailSettingsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <div className="flex gap-2 pt-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function EmailSettingsPage() {
  return (
    <Suspense fallback={<EmailSettingsPageSkeleton />}>
      <EmailSettingsPageClient />
    </Suspense>
  )
}