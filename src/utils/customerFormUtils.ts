import { CustomerLifecycleStage, convertFormStatusToApi, convertLifecycleStageToApi } from 'constants/customerConstants';
import { CustomerInsertDto as ApiCustomerInsertDto, CustomerUpdateDto } from 'api/generated/api';

export interface CustomerFormData {
  name: string;
  legalName?: string;
  code?: string;
  customerTypeId?: string;
  categoryId?: string;
  status: "active" | "inactive";
  lifecycleStage?: CustomerLifecycleStage;
  ownerId?: string;
  nextActivityDate?: string;
  isReferenceCustomer?: boolean;
  logoFilePath?: string;
  taxOffice?: string;
  taxNumber?: string;
  website?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  // defaultNotificationEmail alanı kaldırıldı
  concurrencyToken?: number; // Optimistic locking için
}

// Reference yapısı kaldırıldı - sadece form değerleri kullanılacak
// API'den gelen DTO tiplerini doğrudan kullanıyoruz

export const createInsertDto = (
  formData: CustomerFormData,
  additionalData: {
    emails?: any[];
    addresses?: any[];
    phones?: any[];
    notes?: any[];
    officials?: any[];
    customFields?: any[];
    documents?: any[];
  } = {}
): ApiCustomerInsertDto => {
  // NOT: rowVersion CREATE işleminde gönderilmez (sadece UPDATE'te gerekli)
  return {
    name: formData.name,
    legalName: formData.legalName || "",
    code: formData.code || null,
    customerTypeId: formData.customerTypeId || null,
    categoryId: formData.categoryId || null,
    status: convertFormStatusToApi(formData.status),
    lifecycleStage: formData.lifecycleStage ? convertLifecycleStageToApi(formData.lifecycleStage) : undefined,
    ownerId: formData.ownerId || null,
    nextActivityDate: formData.nextActivityDate || null,
    isReferenceCustomer: !!formData.isReferenceCustomer,
    website: formData.website || null,
    taxOffice: formData.taxOffice || null,
    taxNumber: formData.taxNumber || null,
    twitterUrl: formData.twitterUrl || null,
    facebookUrl: formData.facebookUrl || null,
    linkedinUrl: formData.linkedinUrl || null,
    instagramUrl: formData.instagramUrl || null,
    logoFilePath: formData.logoFilePath || null,
    defaultNotificationEmail: null,
    officials: additionalData.officials || null,
    customFields: additionalData.customFields || null,
    emails: additionalData.emails || null,
    addresses: additionalData.addresses || null,
    phones: additionalData.phones || null,
    notes: additionalData.notes || null,
  };
};

export const createUpdateDto = (
  id: string,
  formData: CustomerFormData
): CustomerUpdateDto => {
  return {
    id,
    concurrencyToken: formData.concurrencyToken || 0,
    name: formData.name || "",
    legalName: formData.legalName || "",
    code: formData.code || "",
    customerTypeId: formData.customerTypeId ? formData.customerTypeId : null,
    categoryId: formData.categoryId ? formData.categoryId : null,
    status: convertFormStatusToApi(formData.status),
    lifecycleStage: formData.lifecycleStage ? convertLifecycleStageToApi(formData.lifecycleStage) : null,
    ownerId: formData.ownerId || null,
    nextActivityDate: formData.nextActivityDate || null,
    isReferenceCustomer: !!formData.isReferenceCustomer,
    website: formData.website || null,
    taxOffice: formData.taxOffice || null,
    taxNumber: formData.taxNumber || null,
    // defaultNotificationEmail alanı kaldırıldı
    twitterUrl: formData.twitterUrl || null,
    facebookUrl: formData.facebookUrl || null,
    linkedinUrl: formData.linkedinUrl || null,
    instagramUrl: formData.instagramUrl || null,
    logoFilePath: formData.logoFilePath || null,
  };
};
