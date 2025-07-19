export interface CloudinaryTransformation {
  width: number;
  height: number;
  quality: number;
  crop: string;
  format: string;
}

export interface CloudinaryTransformations {
  thumbnail: CloudinaryTransformation;
  small: CloudinaryTransformation;
  medium: CloudinaryTransformation;
  large: CloudinaryTransformation;
}

export interface CloudinaryUploadSettings {
  maxFileSizeBytes: number;
  allowedFormats: string[];
  uploadFolder: string;
  uniqueFilename: boolean;
  overwriteExisting: boolean;
  maxImagesPerProduct: number;
}

export interface CloudinarySettings {
  cloudName: string;
  apiKey: string;
  secure: boolean;
  upload: CloudinaryUploadSettings;
  transformations: CloudinaryTransformations;
}

export interface UpdateCloudinarySettingsCommand {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  secure: boolean;
  upload: CloudinaryUploadSettings;
  transformations: CloudinaryTransformations;
}

export interface TestCloudinaryConnectionRequest {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export interface TestCloudinaryConnectionResponse {
  isSuccess: boolean;
  message: string;
  uploadTestUrl?: string;
}