"use client";

import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageType } from "@/api/generated/model";

export interface ProductImageData {
  file: File;
  imageType: ImageType;
  displayOrder: number;
  altText?: string;
  preview: string;
}

interface ProductImageUploadProps {
  images: ProductImageData[];
  onImagesChange: (images: ProductImageData[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ProductImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 4,
  disabled = false 
}: ProductImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFiles = useCallback((fileList: File[]) => {
    const imageFiles = fileList.filter(file => file.type.startsWith('image/'));
    const availableSlots = maxImages - images.length;
    const filesToProcess = imageFiles.slice(0, availableSlots);

    filesToProcess.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: ProductImageData = {
          file,
          imageType: images.length === 0 && index === 0 ? ImageType.NUMBER_1 : ImageType.NUMBER_2,
          displayOrder: images.length + index + 1,
          altText: '',
          preview: e.target?.result as string,
        };
        
        onImagesChange([...images, newImage]);
      };
      reader.readAsDataURL(file);
    });
  }, [images, maxImages, onImagesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || images.length >= maxImages) return;

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, [disabled, images.length, maxImages, processFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, displayOrder: i + 1 }));
    onImagesChange(newImages);
  };

  const updateImageData = (index: number, field: keyof ProductImageData, value: any) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    onImagesChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    
    const reorderedImages = newImages.map((img, i) => ({ ...img, displayOrder: i + 1 }));
    onImagesChange(reorderedImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Product Images</Label>
        <span className="text-sm text-muted-foreground">
          {images.length}/{maxImages} images
        </span>
      </div>

      {images.length < maxImages && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? "border-primary bg-primary/5" 
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && document.getElementById('image-upload')?.click()}
        >
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />
          
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB each</p>
            </div>
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid gap-4">
          {images.map((image, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <img
                      src={image.preview}
                      alt={image.altText || `Product image ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removeImage(index)}
                      disabled={disabled}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Image Type</Label>
                        <Select
                          value={image.imageType.toString()}
                          onValueChange={(value) => updateImageData(index, 'imageType', parseInt(value))}
                          disabled={disabled}
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
                          value={image.displayOrder}
                          onChange={(e) => updateImageData(index, 'displayOrder', parseInt(e.target.value) || 1)}
                          className="h-8"
                          disabled={disabled}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Alt Text (Optional)</Label>
                      <Input
                        placeholder="Describe the image for accessibility"
                        value={image.altText || ''}
                        onChange={(e) => updateImageData(index, 'altText', e.target.value)}
                        className="h-8"
                        disabled={disabled}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveImage(index, Math.max(0, index - 1))}
                        disabled={disabled || index === 0}
                        className="h-7 px-2"
                      >
                        ↑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveImage(index, Math.min(images.length - 1, index + 1))}
                        disabled={disabled || index === images.length - 1}
                        className="h-7 px-2"
                      >
                        ↓
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}