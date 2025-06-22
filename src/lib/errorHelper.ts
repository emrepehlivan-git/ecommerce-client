import { AxiosError } from 'axios';
import { ProblemDetails } from '@/api/generated/model';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse extends ProblemDetails {
  ValidationErrors?: Array<{
    Identifier?: string;
    ErrorMessage?: string;
    ErrorCode?: string | null;
    Severity?: number;
  }>;
  Errors?: any[];
}

export class ErrorHelper {
  /**
   * API hatalarını parse eder ve uygun hata mesajlarını döndürür
   */
  static parseApiError(error: unknown): string {
    if (!error) {
      return 'Bilinmeyen bir hata oluştu';
    }

    // Axios hatası mı kontrol et
    if (this.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      
      // Network hatası
      if (!axiosError.response) {
        if (axiosError.code === 'NETWORK_ERR') {
          return 'Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.';
        }
        if (axiosError.code === 'ECONNABORTED') {
          return 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.';
        }
        return 'Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.';
      }

      const status = axiosError.response.status;
      const data = axiosError.response.data;

             // Status koduna göre özel mesajlar
       switch (status) {
         case 400:
           return this.handleBadRequest(data);
         case 401:
           return 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
         case 403:
           return 'Bu işlem için yetkiniz bulunmuyor.';
         case 404:
           return 'Aradığınız kaynak bulunamadı.';
         case 409:
           return 'Bu işlem zaten gerçekleştirilmiş veya çakışma var.';
         case 422:
           return this.handleValidationError(data);
         case 429:
           return 'Çok fazla istek gönderildi. Lütfen bekleyin.';
         case 500:
           return 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
         case 503:
           return 'Servis geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin.';
         default:
           // Boş response body kontrolü
           if (!data || Object.keys(data).length === 0) {
             return `HTTP ${status} hatası oluştu. Sunucu detay döndürmedi.`;
           }
           return this.extractErrorMessage(data) || `HTTP ${status} hatası oluştu`;
       }
    }

    // Normal Error objesi
    if (error instanceof Error) {
      return error.message || 'Bir hata oluştu';
    }

    // String hata
    if (typeof error === 'string') {
      return error;
    }

    // Bilinmeyen hata tipi
    return 'Beklenmeyen bir hata oluştu';
  }

  /**
   * 400 Bad Request hatalarını handle eder
   */
  private static handleBadRequest(data: ApiErrorResponse): string {
    // Data boş ise spesifik mesaj döndür
    if (!data || Object.keys(data).length === 0) {
      return 'İşlem gerçekleştirilemedi. Geçersiz veri gönderildi veya sunucu hatası oluştu.';
    }

    // Backend'den gelen ValidationErrors (büyük harfle)
    if (data.ValidationErrors && data.ValidationErrors.length > 0) {
      const firstError = data.ValidationErrors[0];
      return firstError.ErrorMessage || 'Geçersiz veri gönderildi';
    }

    // Backend'den gelen Errors (büyük harfle)
    if (data.Errors) {
      const errorMessages = Object.values(data.Errors).flat();
      if (errorMessages.length > 0) {
        return errorMessages[0];
      }
    }

    // ASP.NET Core model validation errors (küçük harfle)
    if (data.errors) {
      const errorMessages = Object.values(data.errors).flat();
      if (errorMessages.length > 0) {
        return errorMessages[0];
      }
    }

    return this.extractErrorMessage(data) || 'Geçersiz istek';
  }

  /**
   * 422 Validation hatalarını handle eder
   */
  private static handleValidationError(data: ApiErrorResponse): string {
    // Data boş ise genel mesaj döndür
    if (!data || Object.keys(data).length === 0) {
      return 'Doğrulama hatası oluştu';
    }

    // Backend'den gelen ValidationErrors (büyük harfle)
    if (data.ValidationErrors && data.ValidationErrors.length > 0) {
      const errors = data.ValidationErrors
        .map(err => err.ErrorMessage)
        .filter(Boolean)
        .join(', ');
      
      return errors || 'Doğrulama hatası oluştu';
    }

    // Backend'den gelen Errors (büyük harfle)
    if (data.Errors) {
      const errorMessages = Object.values(data.Errors).flat();
      if (errorMessages.length > 0) {
        return errorMessages.join(', ');
      }
    }

    // ASP.NET Core model validation errors (küçük harfle)
    if (data.errors) {
      const errorMessages = Object.values(data.errors).flat();
      if (errorMessages.length > 0) {
        return errorMessages.join(', ');
      }
    }

    return this.extractErrorMessage(data) || 'Doğrulama hatası oluştu';
  }

  /**
   * API response'dan hata mesajı çıkarır
   */
  private static extractErrorMessage(data: ApiErrorResponse): string | null {
    if (data.detail) return data.detail;
    if (data.title) return data.title;
    return null;
  }

  /**
   * Validation hatalarını ayrıştırır ve döndürür
   */
  static getValidationErrors(error: unknown): ValidationError[] {
    if (!this.isAxiosError(error)) {
      return [];
    }

    const axiosError = error as AxiosError<ApiErrorResponse>;
    const data = axiosError.response?.data;
    
    if (!data) return [];

    const validationErrors: ValidationError[] = [];

    // Backend'den gelen ValidationErrors (büyük harfle)
    if (data.ValidationErrors) {
      data.ValidationErrors.forEach(err => {
        if (err.Identifier && err.ErrorMessage) {
          validationErrors.push({
            field: err.Identifier,
            message: err.ErrorMessage
          });
        }
      });
    }

    // ASP.NET Core model validation errors
    if (data.errors) {
      Object.entries(data.errors).forEach(([field, messages]) => {
        messages.forEach((message: string) => {
          validationErrors.push({
            field: field,
            message: message
          });
        });
      });
    }

    return validationErrors;
  }

  /**
   * Axios hatası olup olmadığını kontrol eder
   */
  private static isAxiosError(error: unknown): error is AxiosError {
    return error !== null && 
           typeof error === 'object' && 
           'isAxiosError' in error && 
           (error as AxiosError).isAxiosError === true;
  }

  /**
   * Console'a hata loglar (development için)
   */
  static logError(error: unknown, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔴 Error${context ? ` in ${context}` : ''}`);
      console.error('Error details:', error);
      if (this.isAxiosError(error)) {
        const response = error.response;
        console.error('Status:', response?.status);
        console.error('Status Text:', response?.statusText);
        console.error('Response data:', response?.data);
        console.error('Request URL:', error.config?.url);
        console.error('Request Method:', error.config?.method?.toUpperCase());
        console.error('Request Data:', error.config?.data);
        
        // Boş response data uyarısı
        if (response?.data && Object.keys(response.data).length === 0) {
          console.warn('⚠️ API boş response döndürdü. Backend kontrol edilmeli.');
          console.warn(`   URL: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
          console.warn(`   Status: ${response.status} ${response.statusText}`);
        }
      }
      console.groupEnd();
    }
  }

  /**
   * Hata mesajını toast için formatlar
   */
  static getToastErrorMessage(error: unknown, fallbackMessage?: string): string {
    const message = this.parseApiError(error);
    return message || fallbackMessage || 'Bir hata oluştu';
  }
} 