import { useCallback } from 'react';
import { toast } from 'sonner';
import { ErrorHelper, ValidationError } from '@/lib/errorHelper';

export interface UseErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  context?: string;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const { showToast = true, logError = true, context } = options;

  const handleError = useCallback((error: unknown, fallbackMessage?: string) => {
    if (logError) {
      ErrorHelper.logError(error, context);
    }

    if (showToast) {
      const message = ErrorHelper.getToastErrorMessage(error, fallbackMessage);
      toast.error(message);
    }

    return ErrorHelper.parseApiError(error);
  }, [showToast, logError, context]);

  const handleValidationError = useCallback((error: unknown): ValidationError[] => {
    if (logError) {
      ErrorHelper.logError(error, context);
    }

    const validationErrors = ErrorHelper.getValidationErrors(error);
    
    if (showToast && validationErrors.length > 0) {
      // İlk validation error'ı göster
      toast.error(validationErrors[0].message);
    } else if (showToast) {
      // Validation error yoksa genel hata mesajı göster
      const message = ErrorHelper.getToastErrorMessage(error, 'Doğrulama hatası oluştu');
      toast.error(message);
    }

    return validationErrors;
  }, [showToast, logError, context]);

  const handleSuccess = useCallback((message: string) => {
    if (showToast) {
      toast.success(message);
    }
  }, [showToast]);

  return {
    handleError,
    handleValidationError,
    handleSuccess,
    parseError: ErrorHelper.parseApiError,
    getValidationErrors: ErrorHelper.getValidationErrors
  };
} 