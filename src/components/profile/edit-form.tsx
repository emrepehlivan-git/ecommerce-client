"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useRouter } from "next/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
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

interface EditFormProps {
  defaultValues: ProfileFormValues;
}

export default function EditForm({ defaultValues }: EditFormProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const router = useRouter();

  function onSubmit(values: ProfileFormValues) {
    // TODO: API isteği ile güncelleme yapılacak
    alert(JSON.stringify(values, null, 2));
    router.push("/profile");
  }

  return (
    <Card className="max-w-lg w-full mx-auto my-8 md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Profil Bilgileri
        </CardTitle>
        <CardDescription>Profil bilgilerinizi güncelleyin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              field.onChange(date?.toISOString());
                              setOpen(false);
                            }}
                          />
                        </PopoverContent>
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
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CardAction className="flex gap-2 justify-end">
              <Button type="submit" variant="default">
                <Save className="w-4 h-4 mr-2" /> Kaydet
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/profile")}
              >
                <X className="w-4 h-4 mr-2" /> İptal
              </Button>
            </CardAction>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
