/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * ECommerce API
 * ECommerce API with Keycloak Authentication and Versioning
 * OpenAPI spec version: v1
 */
import type { BulkNotificationTarget } from './bulkNotificationTarget';

export interface SendBulkNotificationCommand {
  /** @nullable */
  title?: string | null;
  /** @nullable */
  message?: string | null;
  target?: BulkNotificationTarget;
  /** @nullable */
  userIds?: string[] | null;
  /** @nullable */
  groups?: string[] | null;
}
