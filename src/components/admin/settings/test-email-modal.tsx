"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, TestTube } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useI18n } from "@/i18n/client";

type TestEmailForm = {
  toEmail: string;
  subject: string;
  message: string;
};

interface TestEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TestEmailModal({ isOpen, onClose }: TestEmailModalProps) {
  const [isSending, setIsSending] = useState(false);
  const t = useI18n();

  const testEmailSchema = z.object({
    toEmail: z.string().email(t("admin.settings.emailSettings.validation.fromEmailValid")),
    subject: z.string().min(1, t("admin.settings.emailSettings.validation.fromNameRequired")),
    message: z.string().min(1, t("admin.settings.emailSettings.validation.fromNameRequired")),
  });

  const form = useForm<TestEmailForm>({
    resolver: zodResolver(testEmailSchema),
    defaultValues: {
      toEmail: "",
      subject: t("admin.settings.emailSettings.testEmail.modal.subjectDefault"),
      message: t("admin.settings.emailSettings.testEmail.modal.messageDefault"),
    },
  });

  const handleSubmit = async (data: TestEmailForm) => {
    setIsSending(true);
    try {
      // TODO: Implement test email API call when available
      // await testEmailAPI(data);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(t("admin.settings.emailSettings.testEmail.modal.successMessage", { email: data.toEmail }));
      onClose();
      form.reset();
    } catch (error) {
      toast.error(t("admin.settings.emailSettings.testEmail.modal.errorMessage"));
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    if (!isSending) {
      onClose();
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            {t("admin.settings.emailSettings.testEmail.modal.title")}
          </DialogTitle>
          <DialogDescription>
            {t("admin.settings.emailSettings.testEmail.modal.description")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="toEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.settings.emailSettings.testEmail.modal.toEmailLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("admin.settings.emailSettings.testEmail.modal.toEmailPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.settings.emailSettings.testEmail.modal.subjectLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("admin.settings.emailSettings.testEmail.modal.subjectDefault")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.settings.emailSettings.testEmail.modal.messageLabel")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("admin.settings.emailSettings.testEmail.modal.messageDefault")}
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isSending}
              >
                {t("admin.settings.emailSettings.testEmail.modal.cancelButton")}
              </Button>
              <Button type="submit" disabled={isSending} className="gap-2">
                <Send className="h-4 w-4" />
                {isSending ? t("admin.settings.emailSettings.testEmail.modal.sendingButton") : t("admin.settings.emailSettings.testEmail.modal.sendButton")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}