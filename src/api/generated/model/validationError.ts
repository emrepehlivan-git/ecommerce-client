/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * ECommerce API
 * ECommerce API with Keycloak Authentication and Versioning
 * OpenAPI spec version: v1
 */
import type { ValidationSeverity } from './validationSeverity';

export interface ValidationError {
  /** @nullable */
  identifier?: string | null;
  /** @nullable */
  errorMessage?: string | null;
  /** @nullable */
  errorCode?: string | null;
  severity?: ValidationSeverity;
}
