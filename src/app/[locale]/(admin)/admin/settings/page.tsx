import { Suspense } from "react"
import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Settings, Mail, Shield, Database, Globe } from "lucide-react"
import Link from "next/link"
import { getI18n } from "@/i18n/server"

export const metadata: Metadata = {
  title: "Settings",
  description: "System configuration and settings",
}

function SettingsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

async function SettingsPageContent() {
  const t = await getI18n();
  
  const settingsCategories = [
    {
      title: t("admin.settings.emailSettings.title"),
      description: t("admin.settings.emailSettings.description"),
      icon: Mail,
      href: "/admin/settings/email",
      available: true,
    },
    {
      title: "Security Settings",
      description: "Manage authentication and security policies",
      icon: Shield,
      href: "/admin/settings/security",
      available: false,
    },
    {
      title: "Database Settings",
      description: "Configure database connections and backups",
      icon: Database,
      href: "/admin/settings/database",
      available: false,
    },
    {
      title: "General Settings",
      description: "Basic system configuration and preferences",
      icon: Globe,
      href: "/admin/settings/general",
      available: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-6 w-6" />
            {t("admin.settings.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("admin.settings.description")}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsCategories.map((category) => {
          const IconComponent = category.icon;
          
          return (
            <Card key={category.href} className={!category.available ? "opacity-60" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5" />
                  {category.title}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {category.available ? (
                  <Button asChild className="w-full">
                    <Link href={category.href}>
                      Configure
                    </Link>
                  </Button>
                ) : (
                  <Button disabled className="w-full">
                    Coming Soon
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsPageSkeleton />}>
      <SettingsPageContent />
    </Suspense>
  );
}