"use client";

import { useState } from "react";
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

export function CloudinarySettingsPageClient() {
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const {
    data: cloudinarySettings,
    isLoading: isLoadingSettings,
    refetch,
  } = useGetApiV1ConfigurationCloudinarySettings();

  const { mutateAsync: updateSettings, isPending: isSaving } = usePutApiV1ConfigurationCloudinarySettings({
    mutation: {
      onSuccess: () => {
        toast.success("Cloudinary settings updated successfully!");
        refetch();
      },
      onError: (error: any) => {
        console.error("Failed to update Cloudinary settings:", error);
        toast.error("Failed to update Cloudinary settings. Please try again.");
      },
    },
  });

  const { mutateAsync: testConnection, isPending: isTesting } = usePostApiV1ConfigurationTestCloudinary({
    mutation: {
      onSuccess: (response) => {
        setTestResult({
          success: response.isSuccess,
          message: response.message,
        });
        if (response.isSuccess) {
          toast.success("Cloudinary connection test successful!");
        } else {
          toast.error("Cloudinary connection test failed!");
        }
      },
      onError: (error: any) => {
        console.error("Failed to test Cloudinary connection:", error);
        setTestResult({
          success: false,
          message: "Failed to test connection. Please check your credentials.",
        });
        toast.error("Failed to test Cloudinary connection.");
      },
    },
  });

  const handleSave = async (data: UpdateCloudinarySettingsCommand) => {
    try {
      await updateSettings({ data });
    } catch (error) {
      console.error("Error updating Cloudinary settings:", error);
    }
  };

  const handleTestConnection = async (data: TestCloudinaryConnectionRequest) => {
    try {
      await testConnection({ data });
    } catch (error) {
      console.error("Error testing Cloudinary connection:", error);
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
                  <Link href="/admin">Admin</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/settings">Settings</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Cloudinary Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex items-center gap-2">
            <Cloud className="h-6 w-6" />
            <h2 className="text-2xl font-bold tracking-tight">Cloudinary Settings</h2>
          </div>
          <p className="text-muted-foreground">
            Configure Cloudinary image upload and transformation settings for your e-commerce system.
          </p>
        </div>
        
        <Button variant="outline" asChild>
          <Link href="/admin/settings" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Settings
          </Link>
        </Button>
      </div>

      {testResult && (
        <Card className={testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <CardHeader>
            <CardTitle className={testResult.success ? "text-green-800" : "text-red-800"}>
              Connection Test {testResult.success ? "Successful" : "Failed"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={testResult.success ? "text-green-700" : "text-red-700"}>
              {testResult.message}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            Configure your Cloudinary settings for image upload, storage, and transformation.
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
          <CardTitle>About Cloudinary</CardTitle>
          <CardDescription>
            Cloudinary is a cloud-based image and video management service that provides upload, storage, 
            manipulation, optimization, and delivery capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Key Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Automatic image optimization and format conversion</li>
              <li>Real-time image transformations via URL parameters</li>
              <li>Global CDN for fast image delivery</li>
              <li>Advanced security and access control</li>
              <li>Comprehensive analytics and monitoring</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Getting Started:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Create a free Cloudinary account at <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">cloudinary.com</a></li>
              <li>Find your Cloud Name, API Key, and API Secret in your dashboard</li>
              <li>Enter your credentials in the form above</li>
              <li>Test the connection to ensure everything is working</li>
              <li>Configure upload and transformation settings as needed</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}