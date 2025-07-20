"use client";

import { toast } from "sonner";
import { Cloud, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { CloudinarySettingsForm } from "./cloudinary-settings-form";
import {
  useGetApiV1ConfigurationCloudinarySettings,
  usePutApiV1ConfigurationCloudinarySettings,
  usePostApiV1ConfigurationTestCloudinary,
} from "@/api/cloudinary-settings";
import type { 
  UpdateCloudinarySettingsCommand,
  TestCloudinaryConnectionRequest 
} from "@/types/cloudinary";
import { useI18n } from "@/i18n/client";
import { useErrorHandler } from "@/hooks/use-error-handling";

export function CloudinarySettingsPageClient() {
  const t = useI18n();
  const { handleError } = useErrorHandler();

  const {
    data: cloudinarySettings,
    isLoading: isLoadingSettings,
    refetch,
  } = useGetApiV1ConfigurationCloudinarySettings();

  const { mutateAsync: updateSettings, isPending: isSaving } = usePutApiV1ConfigurationCloudinarySettings({
    mutation: {
      onSuccess: () => {
        toast.success(t("admin.settings.cloudinarySettings.messages.updateSuccess"));
        refetch();
      },
      onError: (error) => {
        handleError(error);
      },
    },
  });

  const { mutateAsync: testConnection, isPending: isTesting } = usePostApiV1ConfigurationTestCloudinary({
    mutation: {
      onSuccess: (response) => {
        if (response.isSuccess) {
          toast.success(t("admin.settings.cloudinarySettings.messages.testSuccess"));
        } else {
          toast.error(t("admin.settings.cloudinarySettings.messages.testError"));
        }
      },
      onError: (error) => {
        handleError(error);
      },
    },
  });

  const handleSave = async (data: UpdateCloudinarySettingsCommand) => {
    try {
      await updateSettings({ data });
    } catch (error) {
      handleError(error);
    }
  };

  const handleTestConnection = async (data: TestCloudinaryConnectionRequest) => {
    try {
      await testConnection({ data });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin">{t("admin.settings.cloudinarySettings.breadcrumb.admin")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/settings">{t("admin.settings.cloudinarySettings.breadcrumb.settings")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t("admin.settings.cloudinarySettings.breadcrumb.cloudinarySettings")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex items-center gap-2">
            <Cloud className="h-6 w-6" />
            <h2 className="text-2xl font-bold tracking-tight">{t("admin.settings.cloudinarySettings.title")}</h2>
          </div>
          <p className="text-muted-foreground">
            {t("admin.settings.cloudinarySettings.description")}
          </p>
        </div>
        
        <Button variant="outline" asChild>
          <Link href="/admin/settings" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("admin.settings.cloudinarySettings.backToSettings")}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("admin.settings.cloudinarySettings.configuration.title")}</CardTitle>
          <CardDescription>
            {t("admin.settings.cloudinarySettings.configuration.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CloudinarySettingsForm
            initialData={cloudinarySettings}
            onSave={handleSave}
            onTest={handleTestConnection}
            isLoading={isLoadingSettings}
            isSaving={isSaving}
            isTesting={isTesting}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("admin.settings.cloudinarySettings.about.title")}</CardTitle>
          <CardDescription>
            {t("admin.settings.cloudinarySettings.about.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">{t("admin.settings.cloudinarySettings.about.keyFeatures")}</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>{t("admin.settings.cloudinarySettings.about.features.optimization")}</li>
              <li>{t("admin.settings.cloudinarySettings.about.features.transformations")}</li>
              <li>{t("admin.settings.cloudinarySettings.about.features.cdn")}</li>
              <li>{t("admin.settings.cloudinarySettings.about.features.security")}</li>
              <li>{t("admin.settings.cloudinarySettings.about.features.analytics")}</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">{t("admin.settings.cloudinarySettings.about.gettingStarted")}</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>{t("admin.settings.cloudinarySettings.about.steps.step1")}</li>
              <li>{t("admin.settings.cloudinarySettings.about.steps.step2")}</li>
              <li>{t("admin.settings.cloudinarySettings.about.steps.step3")}</li>
              <li>{t("admin.settings.cloudinarySettings.about.steps.step4")}</li>
              <li>{t("admin.settings.cloudinarySettings.about.steps.step5")}</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}