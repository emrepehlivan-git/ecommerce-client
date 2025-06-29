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
import {
  Save,
  X,
  User,
  Mail,
  Phone,
  CalendarIcon,
  TextIcon,
} from "lucide-react";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePutApiUsersIdBirthday } from "@/api/generated/users/users";
import { useSession } from "next-auth/react";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";
import { format } from "date-fns";

const formSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir email girin"),
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
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const birthdayMutation = usePutApiUsersIdBirthday();

  async function onSubmit(values: ProfileFormValues) {
    if (!userId) {
      handleError("Kullanıcı bulunamadı!");
      return;
    }
    try {
      await birthdayMutation.mutateAsync({
        id: userId,
        data: values.birthDate ? new Date(values.birthDate).toISOString() : "",
      });
      onOpenChange(false);
    } catch (e: any) {
      handleError(e?.message || "Bir hata oluştu");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profil Bilgileri
          </DialogTitle>
          <DialogDescription>
            Profil bilgilerinizi güncelleyin
          </DialogDescription>
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
                        Adınız ve Soyadınız
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-11"
                          placeholder="Adınız ve Soyadınız"
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
                        Email
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
                        Telefon Numarası
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-11"
                          placeholder="90 (555) 555-55-55"
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
                      <FormLabel>Doğum Tarihi</FormLabel>
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
                              {field.value
                                ? format(new Date(field.value), "PPP")
                                : <span>Tarih seç</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={date => {
                              field.onChange(date ? date.toISOString() : "");
                              setCalendarOpen(false);
                            }}
                            disabled={date => date > new Date() || date < new Date("1900-01-01")}
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
                  <Save className="w-4 h-4 mr-2" /> Kaydet
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="w-4 h-4 mr-2" /> İptal
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 