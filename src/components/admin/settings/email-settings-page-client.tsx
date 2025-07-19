"use client";

import { useState } from "react";
import { Mail, Settings, TestTube } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmailSettingsForm } from "./email-settings-form";
import { TestEmailModal } from "./test-email-modal";

import {
  useGetApiV1ConfigurationEmailSettings,
  usePutApiV1ConfigurationEmailSettings,
  getGetApiV1ConfigurationEmailSettingsQueryKey,
} from "@/api/generated/configuration/configuration";
import type { UpdateEmailSettingsCommand } from "@/api/generated/model";

import { useErrorHandler } from "@/hooks/use-error-handling";
import { useI18n } from "@/i18n/client";

export function EmailSettingsPageClient() {
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const { handleError } = useErrorHandler();
  const queryClient = useQueryClient();
  const t = useI18n();

  const {
    data: emailSettings,
    isLoading,
    error,
  } = useGetApiV1ConfigurationEmailSettings();

  const updateMutation = usePutApiV1ConfigurationEmailSettings({
    mutation: {
      onSuccess: () => {
        toast.success(t("admin.settings.emailSettings.messages.updateSuccess"));
        const queryKey = getGetApiV1ConfigurationEmailSettingsQueryKey();
        queryClient.invalidateQueries({ queryKey });
      },
      onError: (error) => {
        handleError(error);
      },
    },
  });

  const handleSave = async (data: UpdateEmailSettingsCommand) => {
    updateMutation.mutate({ data });
  };

  const handleTestEmail = () => {
    setIsTestModalOpen(true);
  };

  const handleCloseTestModal = () => {
    setIsTestModalOpen(false);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Settings className="h-6 w-6" />
              {t("admin.settings.emailSettings.title")}
            </h2>
            <p className="text-muted-foreground">{t("admin.settings.emailSettings.description")}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">{t("admin.settings.emailSettings.messages.loadError")}</CardTitle>
            <CardDescription>
              {t("admin.settings.emailSettings.messages.loadErrorDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()}>
              {t("admin.settings.emailSettings.messages.retryButton")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-6 w-6" />
            {t("admin.settings.emailSettings.title")}
          </h2>
          <p className="text-muted-foreground">{t("admin.settings.emailSettings.description")}</p>
        </div>
        <Button 
          onClick={handleTestEmail} 
          variant="outline" 
          className="gap-2"
          disabled={!emailSettings}
        >
          <TestTube className="h-4 w-4" />
          {t("admin.settings.emailSettings.testEmail.button")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {t("admin.settings.emailSettings.smtpConfiguration")}
          </CardTitle>
          <CardDescription>
            {t("admin.settings.emailSettings.configurationDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmailSettingsForm
            initialData={emailSettings as any}
            onSave={handleSave}
            isLoading={isLoading}
            isSaving={updateMutation.isPending}
          />
        </CardContent>
      </Card>

      <TestEmailModal
        isOpen={isTestModalOpen}
        onClose={handleCloseTestModal}
      />
    </div>
  );
}