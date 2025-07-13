"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, X, User, Mail, Phone, CalendarIcon, TextIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePutApiV1UsersIdBirthday } from "@/api/generated/users/users";
import { useSession } from "next-auth/react";
import { useErrorHandler } from "@/hooks/use-error-handling";
import { format } from "date-fns";
import { useI18n } from "@/i18n/client";

const getFormSchema = (t: any) =>
  z.object({
    name: z.string().min(2, t("profile.editModal.validation.nameMin")),
    email: z.string().email(t("profile.editModal.validation.emailInvalid")),
    phone: z.string(),
    birthDate: z.string(),
  });

type ProfileFormValues = {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
};

interface EditProfileModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: ProfileFormValues;
}

export default function EditProfileModal({
  isOpen,
  onOpenChange,
  defaultValues,
}: EditProfileModalProps) {
  const { handleError } = useErrorHandler();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const t = useI18n();
  const formSchema = getFormSchema(t);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const birthdayMutation = usePutApiV1UsersIdBirthday();

  async function onSubmit(values: ProfileFormValues) {
    if (!userId) {
      handleError(t("profile.editModal.userNotFound"));
      return;
    }
    try {
      await birthdayMutation.mutateAsync({
        id: userId,
        data: values.birthDate ? new Date(values.birthDate).toISOString() : "",
      });
      onOpenChange(false);
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {t("profile.editModal.title")}
          </DialogTitle>
          <DialogDescription>{t("profile.editModal.description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <TextIcon className="w-4 h-4 inline mr-1" />
                        {t("profile.editModal.nameLabel")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-11"
                          placeholder={t("profile.editModal.namePlaceholder")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Mail className="w-4 h-4 inline mr-1" />
                        {t("profile.editModal.emailLabel")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          disabled
                          className="h-11 font-semibold disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Phone className="w-4 h-4 inline mr-1" />
                        {t("profile.editModal.phoneLabel")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-11"
                          placeholder={t("profile.editModal.phonePlaceholder")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("profile.editModal.birthDateLabel")}</FormLabel>
                      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={
                                "w-[240px] pl-3 text-left font-normal" +
                                (!field.value ? " text-muted-foreground" : "")
                              }
                              type="button"
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>{t("profile.editModal.pickDate")}</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              field.onChange(date ? date.toISOString() : "");
                              setCalendarOpen(false);
                            }}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="submit" variant="default">
                  <Save className="w-4 h-4 mr-2" /> {t("profile.editModal.saveButton")}
                </Button>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  <X className="w-4 h-4 mr-2" /> {t("profile.editModal.cancelButton")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
