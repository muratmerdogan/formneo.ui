/**
 * Backend'den gelen API hatalarını kullanıcı dostu mesajlara çeviren utility fonksiyonları
 */

export interface ApiErrorResponse {
    data?: {
        statusCode?: number;
        errors?: string[];
        message?: string;
    };
    status?: number;
    statusText?: string;
}

export interface ApiError {
    response?: ApiErrorResponse;
    message?: string;
}

/**
 * Backend API hatalarından kullanıcı dostu hata mesajı çıkarır
 * @param error - API'den gelen hata objesi
 * @param defaultMessage - Varsayılan hata mesajı
 * @returns Kullanıcı dostu hata mesajı
 */
export function extractErrorMessage(error: ApiError, defaultMessage: string = "Bir hata oluştu"): string {
    // Backend response kontrolü
    if (error?.response?.data) {
        const responseData = error.response.data;
        
        // Validasyon hataları (array format)
        if (responseData.errors && Array.isArray(responseData.errors)) {
            return responseData.errors.join(", ");
        }
        
        // Tek mesaj
        if (responseData.message) {
            return responseData.message;
        }
        
        // Status code'a göre genel mesajlar
        if (responseData.statusCode === 400) {
            return "Geçersiz veriler gönderildi. Lütfen formu kontrol edin.";
        } else if (responseData.statusCode === 401) {
            return "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.";
        } else if (responseData.statusCode === 403) {
            return "Bu işlem için yetkiniz bulunmuyor.";
        } else if (responseData.statusCode === 404) {
            return "Aranan kaynak bulunamadı.";
        } else if (responseData.statusCode === 409) {
            return "Bu kayıt zaten mevcut.";
        } else if (responseData.statusCode === 500) {
            return "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.";
        }
    }
    
    // HTTP status kontrolü
    if (error?.response?.status) {
        const status = error.response.status;
        if (status === 401) {
            return "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.";
        } else if (status === 403) {
            return "Bu işlem için yetkiniz bulunmuyor.";
        } else if (status === 404) {
            return "Aranan kaynak bulunamadı.";
        } else if (status >= 500) {
            return "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.";
        }
    }
    
    // Network error veya diğer hatalar
    if (error?.message) {
        // Network hataları
        if (error.message.includes("Network Error")) {
            return "İnternet bağlantınızı kontrol edin.";
        } else if (error.message.includes("timeout")) {
            return "İstek zaman aşımına uğradı. Lütfen tekrar deneyin.";
        }
        
        return error.message;
    }
    
    return defaultMessage;
}

/**
 * Form submission hatalarını işlemek için özel fonksiyon
 * @param error - API hatası
 * @param operation - Yapılan işlem ("create", "update", "delete")
 * @param entityName - Varlık adı ("müşteri", "fırsat", vb.)
 * @returns Kullanıcı dostu hata mesajı
 */
export function extractFormErrorMessage(
    error: ApiError, 
    operation: "create" | "update" | "delete", 
    entityName: string = "kayıt"
): string {
    const operationTexts = {
        create: "oluşturulurken",
        update: "güncellenirken", 
        delete: "silinirken"
    };
    
    const defaultMessage = `${entityName} ${operationTexts[operation]} hata oluştu`;
    
    return extractErrorMessage(error, defaultMessage);
}

/**
 * Data loading hatalarını işlemek için özel fonksiyon
 * @param error - API hatası
 * @param entityName - Varlık adı ("müşteri", "fırsat", vb.)
 * @returns Kullanıcı dostu hata mesajı
 */
export function extractLoadingErrorMessage(error: ApiError, entityName: string = "veriler"): string {
    const defaultMessage = `${entityName} yüklenirken hata oluştu`;
    return extractErrorMessage(error, defaultMessage);
}
