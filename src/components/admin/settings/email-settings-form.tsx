"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Save } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import type { UpdateEmailSettingsCommand } from "@/api/generated/model";
import { useI18n } from "@/i18n/client";

type EmailSettingsForm = {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
};

interface EmailSettingsFormProps {
  initialData?: UpdateEmailSettingsCommand;
  onSave: (data: UpdateEmailSettingsCommand) => Promise<void>;
  isLoading?: boolean;
  isSaving?: boolean;
}

export function EmailSettingsForm({ 
  initialData, 
  onSave, 
  isLoading = false, 
  isSaving = false 
}: EmailSettingsFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const t = useI18n();

  const emailSettingsSchema = z.object({
    smtpHost: z.string().min(1, t("admin.settings.emailSettings.validation.smtpHostRequired")).max(255, t("admin.settings.emailSettings.validation.smtpHostMaxLength")),
    smtpPort: z.number().min(1, t("admin.settings.emailSettings.validation.smtpPortRange")).max(65535, t("admin.settings.emailSettings.validation.smtpPortRange")),
    smtpUser: z.string().min(1, t("admin.settings.emailSettings.validation.smtpUserRequired")).max(255, t("admin.settings.emailSettings.validation.smtpUserMaxLength")),
    smtpPassword: z.string().min(6, t("admin.settings.emailSettings.validation.smtpPasswordMinLength")),
    fromEmail: z.string().email(t("admin.settings.emailSettings.validation.fromEmailValid")).max(255, t("admin.settings.emailSettings.validation.fromEmailMaxLength")),
    fromName: z.string().min(1, t("admin.settings.emailSettings.validation.fromNameRequired")).max(100, t("admin.settings.emailSettings.validation.fromNameMaxLength")),
  });

  const form = useForm<EmailSettingsForm>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpHost: "",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
      fromEmail: "",
      fromName: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        smtpHost: initialData.smtpHost || "",
        smtpPort: initialData.smtpPort || 587,
        smtpUser: initialData.smtpUser || "",
        smtpPassword: initialData.smtpPassword || "",
        fromEmail: initialData.fromEmail || "",
        fromName: initialData.fromName || "",
      });
    }
  }, [initialData, form]);

  const handleSubmit = (data: EmailSettingsForm) => {
    onSave(data);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const commonPorts = [
    { port: 25, description: "Standard SMTP (non-encrypted)" },
    { port: 587, description: "SMTP with STARTTLS (recommended)" },
    { port: 465, description: "SMTP over SSL" },
    { port: 2525, description: "Alternative SMTP" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-10 w-full bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="smtpHost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("admin.settings.emailSettings.form.smtpHost.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("admin.settings.emailSettings.form.smtpHost.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {t("admin.settings.emailSettings.form.smtpHost.description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="smtpPort"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("admin.settings.emailSettings.form.smtpPort.label")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t("admin.settings.emailSettings.form.smtpPort.placeholder")}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  {t("admin.settings.emailSettings.form.smtpPort.description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="smtpUser"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("admin.settings.emailSettings.form.smtpUser.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("admin.settings.emailSettings.form.smtpUser.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {t("admin.settings.emailSettings.form.smtpUser.description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="smtpPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("admin.settings.emailSettings.form.smtpPassword.label")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("admin.settings.emailSettings.form.smtpPassword.placeholder")}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  {t("admin.settings.emailSettings.form.smtpPassword.description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="fromEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("admin.settings.emailSettings.form.fromEmail.label")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("admin.settings.emailSettings.form.fromEmail.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {t("admin.settings.emailSettings.form.fromEmail.description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fromName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("admin.settings.emailSettings.form.fromName.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("admin.settings.emailSettings.form.fromName.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {t("admin.settings.emailSettings.form.fromName.description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isSaving} className="gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? t("admin.settings.emailSettings.form.savingButton") : t("admin.settings.emailSettings.form.saveButton")}
          </Button>
        </div>

        {/* Common SMTP configurations help */}
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">{t("admin.settings.emailSettings.help.title")}</h4>
          <div className="grid gap-2 text-sm">
            <div>{t("admin.settings.emailSettings.help.gmail")}</div>
            <div>{t("admin.settings.emailSettings.help.outlook")}</div>
            <div>{t("admin.settings.emailSettings.help.yahoo")}</div>
            <div>{t("admin.settings.emailSettings.help.sendgrid")}</div>
          </div>
        </div>
      </form>
    </Form>
  );
}