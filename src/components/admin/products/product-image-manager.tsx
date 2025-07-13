"use client";

import { useState } from "react";
import { Upload, X, Edit2, Save, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

import { 
  ProductImageResponseDto, 
  ImageType,
  PostApiV1ProductIdImagesBody,
  UpdateImageOrderRequest 
} from "@/api/generated/model";
import { 
  useGetApiV1ProductIdImages,
  usePostApiV1ProductIdImages,
  useDeleteApiV1ProductIdImagesImageId,
  usePutApiV1ProductIdImagesReorder
} from "@/api/generated/product/product";
import { useErrorHandler } from "@/hooks/use-error-handling";

interface ProductImageManagerProps {
  productId: string;
  maxImages?: number;
}

interface EditingImage {
  id: string;
  altText: string;
  imageType: ImageType;
  displayOrder: number;
}

export function ProductImageManager({ productId, maxImages = 4 }: ProductImageManagerProps) {
  const { handleError } = useErrorHandler();
  const [editingImage, setEditingImage] = useState<EditingImage | null>(null);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { 
    data: images, 
    refetch: refetchImages,
    isLoading 
  } = useGetApiV1ProductIdImages(productId, undefined, {
    query: { enabled: !!productId }
  });

  const uploadMutation = usePostApiV1ProductIdImages({
    mutation: {
      onSuccess: () => {
        toast.success("Images uploaded successfully");
        setSelectedFiles([]);
        refetchImages();
      },
      onError: (error) => {
        handleError(error);
      },
    },
  });

  const deleteMutation = useDeleteApiV1ProductIdImagesImageId({
    mutation: {
      onSuccess: () => {
        toast.success("Image deleted successfully");
        setDeleteImageId(null);
        refetchImages();
      },
      onError: (error) => {
        handleError(error);
      },
    },
  });

  const reorderMutation = usePutApiV1ProductIdImagesReorder({
    mutation: {
      onSuccess: () => {
        toast.success("Image order updated successfully");
        refetchImages();
      },
      onError: (error) => {
        handleError(error);
      },
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const availableSlots = maxImages - (images?.length || 0);
      const filesToAdd = files.slice(0, availableSlots);
      setSelectedFiles(filesToAdd);
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;

    const imageData: PostApiV1ProductIdImagesBody = {
      Images: selectedFiles.map((file, index) => ({
        file,
        imageType: index === 0 && (!images || images.length === 0) ? ImageType.NUMBER_1 : ImageType.NUMBER_2,
        displayOrder: (images?.length || 0) + index + 1,
        altText: "",
      }))
    };

    uploadMutation.mutate({ id: productId, data: imageData });
  };

  const handleDelete = (imageId: string) => {
    deleteMutation.mutate({ id: productId, imageId });
  };

  const startEditing = (image: ProductImageResponseDto) => {
    setEditingImage({
      id: image.id!,
      altText: image.altText || "",
      imageType: image.imageType || ImageType.NUMBER_2,
      displayOrder: image.displayOrder || 1,
    });
  };

  const saveEdit = () => {
    if (!editingImage) return;

    const currentImages = images || [];
    const imageToUpdate = currentImages.find(img => img.id === editingImage.id);
    
    if (!imageToUpdate) return;

    const hasOrderChanged = imageToUpdate.displayOrder !== editingImage.displayOrder;

    if (hasOrderChanged) {
      const reorderData: UpdateImageOrderRequest = {
        imageOrders: currentImages.reduce((acc, img) => {
          acc[img.id!] = img.id === editingImage.id ? editingImage.displayOrder : img.displayOrder!;
          return acc;
        }, {} as Record<string, number>)
      };

      reorderMutation.mutate({ id: productId, data: reorderData });
    }

    setEditingImage(null);
    toast.success("Image updated successfully");
  };

  const moveImage = (imageId: string, direction: 'up' | 'down') => {
    if (!images) return;

    const currentIndex = images.findIndex(img => img.id === imageId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const reorderedImages = [...images];
    [reorderedImages[currentIndex], reorderedImages[newIndex]] = 
    [reorderedImages[newIndex], reorderedImages[currentIndex]];

    const reorderData: UpdateImageOrderRequest = {
      imageOrders: reorderedImages.reduce((acc, img, index) => {
        acc[img.id!] = index + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    reorderMutation.mutate({ id: productId, data: reorderData });
  };

  const getImageTypeLabel = (type: ImageType) => {
    switch (type) {
      case ImageType.NUMBER_1: return "Primary";
      case ImageType.NUMBER_2: return "Secondary";
      case ImageType.NUMBER_3: return "Detail";
      case ImageType.NUMBER_4: return "Additional";
      default: return "Unknown";
    }
  };

  const getImageTypeVariant = (type: ImageType) => {
    switch (type) {
      case ImageType.NUMBER_1: return "default";
      case ImageType.NUMBER_2: return "secondary";
      case ImageType.NUMBER_3: return "outline";
      case ImageType.NUMBER_4: return "outline";
      default: return "outline";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Product Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Product Images
          <Badge variant="outline">
            {images?.length || 0}/{maxImages}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        {(!images || images.length < maxImages) && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-upload">Upload New Images</Label>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Selected {selectedFiles.length} file(s)
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleUpload}
                    disabled={uploadMutation.isPending}
                    size="sm"
                  >
                    {uploadMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Upload Images
                  </Button>
                  <Button 
                    onClick={() => setSelectedFiles([])}
                    variant="outline"
                    size="sm"
                    disabled={uploadMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Images Grid */}
        {images && images.length > 0 ? (
          <div className="grid gap-4">
            {images
              .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
              .map((image, index) => (
              <Card key={image.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={image.thumbnailUrl || image.imageUrl || "/images/not-found-product.webp"}
                        alt={image.altText || `Product image ${index + 1}`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={getImageTypeVariant(image.imageType!)}>
                            {getImageTypeLabel(image.imageType!)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Order: {image.displayOrder}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveImage(image.id!, 'up')}
                            disabled={index === 0 || reorderMutation.isPending}
                            className="h-7 w-7 p-0"
                          >
                            ↑
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveImage(image.id!, 'down')}
                            disabled={index === images.length - 1 || reorderMutation.isPending}
                            className="h-7 w-7 p-0"
                          >
                            ↓
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditing(image)}
                            className="h-7 w-7 p-0"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteImageId(image.id!)}
                            className="h-7 w-7 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {editingImage?.id === image.id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">Image Type</Label>
                              <Select
                                value={editingImage?.imageType.toString() || ""}
                                onValueChange={(value) => 
                                  setEditingImage(prev => prev ? {...prev, imageType: parseInt(value) as ImageType} : null)
                                }
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={ImageType.NUMBER_1.toString()}>Primary</SelectItem>
                                  <SelectItem value={ImageType.NUMBER_2.toString()}>Secondary</SelectItem>
                                  <SelectItem value={ImageType.NUMBER_3.toString()}>Detail</SelectItem>
                                  <SelectItem value={ImageType.NUMBER_4.toString()}>Additional</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs">Display Order</Label>
                              <Input
                                type="number"
                                min="1"
                                max={maxImages}
                                value={editingImage?.displayOrder.toString() || ""}
                                onChange={(e) => 
                                  setEditingImage(prev => prev ? {...prev, displayOrder: parseInt(e.target.value) || 1} : null)
                                }
                                className="h-8"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">Alt Text</Label>
                            <Input
                              placeholder="Describe the image for accessibility"
                              value={editingImage?.altText || ""}
                              onChange={(e) => 
                                setEditingImage(prev => prev ? {...prev, altText: e.target.value} : null)
                              }
                              className="h-8"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={saveEdit} size="sm" className="h-7">
                              <Save className="h-3 w-3 mr-1" />
                              Save
                            </Button>
                            <Button 
                              onClick={() => setEditingImage(null)} 
                              variant="outline" 
                              size="sm"
                              className="h-7"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">Alt Text:</span>{" "}
                            {image.altText || <span className="text-muted-foreground">Not set</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Size: {image.fileSizeBytes ? Math.round(image.fileSizeBytes / 1024) + ' KB' : 'Unknown'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No images uploaded yet</p>
            <p className="text-sm">Upload some images to get started</p>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteImageId} onOpenChange={() => setDeleteImageId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Delete Image
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this image? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteImageId && handleDelete(deleteImageId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Image
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}