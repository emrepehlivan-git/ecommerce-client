"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Save, TestTube, Cloud } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import type { 
  CloudinarySettings, 
  UpdateCloudinarySettingsCommand,
  TestCloudinaryConnectionRequest 
} from "@/types/cloudinary";

interface CloudinarySettingsFormProps {
  initialData?: CloudinarySettings;
  onSave: (data: UpdateCloudinarySettingsCommand) => Promise<void>;
  onTest: (data: TestCloudinaryConnectionRequest) => Promise<void>;
  isLoading?: boolean;
  isSaving?: boolean;
  isTesting?: boolean;
}

export function CloudinarySettingsForm({ 
  initialData, 
  onSave,
  onTest,
  isLoading = false, 
  isSaving = false,
  isTesting = false
}: CloudinarySettingsFormProps) {
  const [showApiSecret, setShowApiSecret] = useState(false);

  const cloudinarySettingsSchema = z.object({
    cloudName: z.string().min(1, "Cloud name is required").max(100, "Cloud name must not exceed 100 characters"),
    apiKey: z.string().min(1, "API key is required").max(255, "API key must not exceed 255 characters"),
    apiSecret: z.string().optional(),
    secure: z.boolean().default(true),
    upload: z.object({
      maxFileSizeBytes: z.number().min(1, "Max file size must be greater than 0").max(52428800, "Max file size cannot exceed 50MB"),
      allowedFormats: z.array(z.string()).min(1, "At least one format must be allowed"),
      uploadFolder: z.string().min(1, "Upload folder is required"),
      uniqueFilename: z.boolean().default(true),
      overwriteExisting: z.boolean().default(false),
      maxImagesPerProduct: z.number().min(1, "Must allow at least 1 image per product").max(20, "Cannot exceed 20 images per product")
    }),
    transformations: z.object({
      thumbnail: z.object({
        width: z.number().min(1, "Width must be greater than 0").max(2000, "Width cannot exceed 2000px"),
        height: z.number().min(1, "Height must be greater than 0").max(2000, "Height cannot exceed 2000px"),
        quality: z.number().min(1, "Quality must be at least 1").max(100, "Quality cannot exceed 100"),
        crop: z.string().default("fill"),
        format: z.string().default("auto")
      }),
      small: z.object({
        width: z.number().min(1, "Width must be greater than 0").max(2000, "Width cannot exceed 2000px"),
        height: z.number().min(1, "Height must be greater than 0").max(2000, "Height cannot exceed 2000px"),
        quality: z.number().min(1, "Quality must be at least 1").max(100, "Quality cannot exceed 100"),
        crop: z.string().default("fill"),
        format: z.string().default("auto")
      }),
      medium: z.object({
        width: z.number().min(1, "Width must be greater than 0").max(2000, "Width cannot exceed 2000px"),
        height: z.number().min(1, "Height must be greater than 0").max(2000, "Height cannot exceed 2000px"),
        quality: z.number().min(1, "Quality must be at least 1").max(100, "Quality cannot exceed 100"),
        crop: z.string().default("fill"),
        format: z.string().default("auto")
      }),
      large: z.object({
        width: z.number().min(1, "Width must be greater than 0").max(2000, "Width cannot exceed 2000px"),
        height: z.number().min(1, "Height must be greater than 0").max(2000, "Height cannot exceed 2000px"),
        quality: z.number().min(1, "Quality must be at least 1").max(100, "Quality cannot exceed 100"),
        crop: z.string().default("fill"),
        format: z.string().default("auto")
      })
    })
  });

  type CloudinaryFormData = z.infer<typeof cloudinarySettingsSchema>;

  const form = useForm<CloudinaryFormData>({
    resolver: zodResolver(cloudinarySettingsSchema),
    defaultValues: {
      cloudName: "dc2vphjj0", // From appsettings.json
      apiKey: "159668118693129", // From appsettings.json
      apiSecret: "",
      secure: true,
      upload: {
        maxFileSizeBytes: 10485760, // 10MB
        allowedFormats: ["jpg", "jpeg", "png", "webp"],
        uploadFolder: "ecommerce/products",
        uniqueFilename: true,
        overwriteExisting: false,
        maxImagesPerProduct: 10
      },
      transformations: {
        thumbnail: { width: 150, height: 150, quality: 80, crop: "fill", format: "auto" },
        small: { width: 300, height: 300, quality: 85, crop: "fill", format: "auto" },
        medium: { width: 600, height: 600, quality: 90, crop: "fill", format: "auto" },
        large: { width: 1200, height: 1200, quality: 95, crop: "fill", format: "auto" }
      }
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        cloudName: initialData.cloudName || "",
        apiKey: initialData.apiKey || "",
        apiSecret: "", // Never populate secret from server
        secure: initialData.secure ?? true,
        upload: {
          maxFileSizeBytes: initialData.upload?.maxFileSizeBytes || 10485760,
          allowedFormats: initialData.upload?.allowedFormats || ["jpg", "jpeg", "png", "webp"],
          uploadFolder: initialData.upload?.uploadFolder || "ecommerce/products",
          uniqueFilename: initialData.upload?.uniqueFilename ?? true,
          overwriteExisting: initialData.upload?.overwriteExisting ?? false,
          maxImagesPerProduct: initialData.upload?.maxImagesPerProduct || 10
        },
        transformations: {
          thumbnail: initialData.transformations?.thumbnail || { width: 150, height: 150, quality: 80, crop: "fill", format: "auto" },
          small: initialData.transformations?.small || { width: 300, height: 300, quality: 85, crop: "fill", format: "auto" },
          medium: initialData.transformations?.medium || { width: 600, height: 600, quality: 90, crop: "fill", format: "auto" },
          large: initialData.transformations?.large || { width: 1200, height: 1200, quality: 95, crop: "fill", format: "auto" }
        }
      });
    }
  }, [initialData, form]);

  const handleSubmit = (data: CloudinaryFormData) => {
    // Only include apiSecret in the update if it's provided
    const updateData = { ...data };
    if (!data.apiSecret) {
      delete updateData.apiSecret;
    }
    onSave(updateData);
  };

  const handleTestConnection = () => {
    const { cloudName, apiKey, apiSecret } = form.getValues();
    if (!apiSecret) {
      alert("API Secret is required for testing connection");
      return;
    }
    onTest({ cloudName, apiKey, apiSecret });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 8 }, (_, i) => (
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
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="upload">Upload Settings</TabsTrigger>
            <TabsTrigger value="transformations">Transformations</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Cloudinary Configuration
                </CardTitle>
                <CardDescription>
                  Configure your Cloudinary account credentials and basic settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="cloudName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cloud Name</FormLabel>
                        <FormControl>
                          <Input placeholder="your-cloud-name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your Cloudinary cloud name (found in your dashboard)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                          <Input placeholder="159668118693129" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your Cloudinary API key
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="apiSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Secret</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showApiSecret ? "text" : "password"}
                            placeholder="Your API secret"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowApiSecret(!showApiSecret)}
                          >
                            {showApiSecret ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Your Cloudinary API secret (only needed for updates and testing)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secure"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Use HTTPS</FormLabel>
                        <FormDescription>
                          Generate secure HTTPS URLs for your images
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="gap-2"
                  >
                    <TestTube className="h-4 w-4" />
                    {isTesting ? "Testing..." : "Test Connection"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Configuration</CardTitle>
                <CardDescription>
                  Configure file upload limits and folder structure.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="upload.maxFileSizeBytes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max File Size (Bytes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Current: {formatBytes(field.value)} (Max: 50MB)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="upload.maxImagesPerProduct"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Images Per Product</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum number of images allowed per product
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="upload.uploadFolder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Folder</FormLabel>
                      <FormControl>
                        <Input placeholder="ecommerce/products" {...field} />
                      </FormControl>
                      <FormDescription>
                        Cloudinary folder where images will be uploaded
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="upload.uniqueFilename"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Generate Unique Filenames</FormLabel>
                          <FormDescription>
                            Automatically generate unique filenames to prevent conflicts
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="upload.overwriteExisting"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Overwrite Existing Files</FormLabel>
                          <FormDescription>
                            Replace existing files with the same name
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transformations" className="space-y-6">
            {(['thumbnail', 'small', 'medium', 'large'] as const).map((size) => (
              <Card key={size}>
                <CardHeader>
                  <CardTitle className="capitalize">{size} Images</CardTitle>
                  <CardDescription>
                    Configure {size} image transformation settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name={`transformations.${size}.width`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Width (px)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`transformations.${size}.height`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (px)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`transformations.${size}.quality`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quality (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="100"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isSaving} className="gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
}