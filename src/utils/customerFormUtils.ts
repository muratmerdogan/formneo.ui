import { CustomerLifecycleStage, convertFormStatusToApi, convertLifecycleStageToApi } from 'constants/customerConstants';

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
  rowVersion?: string; // Optimistic locking için
}

// Reference yapısı kaldırıldı - sadece form değerleri kullanılacak

export interface CustomerInsertDto {
  name: string;
  legalName?: string | null;
  code?: string | null;
  customerTypeId?: string | null;
  categoryId?: string | null;
  status?: number;
  lifecycleStage?: number | null;
  ownerId?: string | null;
  nextActivityDate?: string | null;
  isReferenceCustomer?: boolean;
  website?: string | null;
  taxOffice?: string | null;
  taxNumber?: string | null;
  twitterUrl?: string | null;
  facebookUrl?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  logoFilePath?: string | null;
  // Additional fields for insert
  emails?: any[] | null;
  addresses?: any[] | null;
  phones?: any[] | null;
  notes?: any[] | null;
  officials?: any[] | null;
  customFields?: any[] | null;
  documents?: any[] | null;
}

export interface CustomerUpdateDto {
  id: string;
  rowVersion?: string | null; // Optimistic locking için - API'dan gelir
  name: string;
  legalName?: string | null;
  code?: string | null;
  customerTypeId?: string | null;
  categoryId?: string | null;
  status?: number;
  lifecycleStage?: number | null;
  ownerId?: string | null;
  nextActivityDate?: string | null;
  isReferenceCustomer?: boolean;
  website?: string | null;
  taxOffice?: string | null;
  taxNumber?: string | null;
  // defaultNotificationEmail alanı kaldırıldı
  twitterUrl?: string | null;
  facebookUrl?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  logoFilePath?: string | null;
}

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
): CustomerInsertDto => {
  return {
    name: formData.name,
    legalName: formData.legalName || null,
    code: formData.code || null,
    customerTypeId: formData.customerTypeId || null,
    categoryId: formData.categoryId || null,
    status: convertFormStatusToApi(formData.status),
    lifecycleStage: formData.lifecycleStage ? convertLifecycleStageToApi(formData.lifecycleStage) : null,
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
    // Additional data
    emails: additionalData.emails || null,
    addresses: additionalData.addresses || null,
    phones: additionalData.phones || null,
    notes: additionalData.notes || null,
    officials: additionalData.officials || null,
    customFields: additionalData.customFields || null,
    documents: additionalData.documents || null,
  };
};

export const createUpdateDto = (
  id: string,
  formData: CustomerFormData
): CustomerUpdateDto => {
  return {
    id,
    rowVersion: formData.rowVersion || null, // Optimistic locking için
    name: formData.name,
    legalName: formData.legalName || null,
    code: formData.code || null,
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
