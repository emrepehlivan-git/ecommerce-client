/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * ECommerce API
 * ECommerce API with Keycloak Authentication and Versioning
 * OpenAPI spec version: v1
 */
import type { ProductImageResponseDto } from './productImageResponseDto';

export interface UploadProductImagesResponse {
  /** @nullable */
  uploadedImages?: ProductImageResponseDto[] | null;
  successfulCount?: number;
  totalCount?: number;
  /** @nullable */
  errors?: string[] | null;
}
