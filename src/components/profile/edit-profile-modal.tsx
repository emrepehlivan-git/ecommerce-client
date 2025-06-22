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
  const [calendarOpen, setCalendarOpen] = useState(false);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(values: ProfileFormValues) {
    // TODO: API isteği ile güncelleme yapılacak
    alert(JSON.stringify(values, null, 2));
    onOpenChange(false);
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
                    <FormItem>
                      <FormLabel>Doğum Tarihi</FormLabel>
                      <FormControl>
                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left h-11"
                            >
                              <CalendarIcon className="w-4 h-4 inline mr-1" />
                              {field.value
                                ? new Date(field.value).toLocaleDateString()
                                : "Doğum Tarihi Seçin"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) => {
                                field.onChange(date?.toISOString());
                                setCalendarOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
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