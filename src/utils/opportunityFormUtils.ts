import { OpportunityInsertDto, OpportunityUpdateDto } from "api/generated/api";

// Form data type - sadece backend DTO alanlarını kullanıyor
export interface OpportunityFormData {
    customerId: string;
    title: string;
    stage?: number;
    amount?: number | null;
    currency?: string | null;
    probability?: number | null;
    expectedCloseDate?: string | null;
    source?: string | null;
    ownerUserId: string;
    description?: string | null;
}

// Backend'den gelen opportunity verisini form formatına çevirme
export function createOpportunityFormData(dto: any): OpportunityFormData {
    return {
        customerId: dto.customerId || "",
        title: dto.title || "",
        stage: dto.stage || 1,
        amount: dto.amount || null,
        currency: dto.currency || null,
        probability: dto.probability || null,
        expectedCloseDate: dto.expectedCloseDate || null,
        source: dto.source || null,
        ownerUserId: dto.ownerUserId || "",
        description: dto.description || null,
    };
}

// Form verisini backend insert DTO'suna çevirme
export function createInsertDto(formData: OpportunityFormData): OpportunityInsertDto {
    return {
        customerId: formData.customerId,
        title: formData.title,
        stage: formData.stage,
        amount: formData.amount,
        currency: formData.currency,
        probability: formData.probability,
        expectedCloseDate: formData.expectedCloseDate,
        source: formData.source,
        ownerUserId: formData.ownerUserId,
        description: formData.description,
    };
}

// Form verisini backend update DTO'suna çevirme
export function createUpdateDto(
    id: string, 
    formData: OpportunityFormData, 
    rowVersion: string
): OpportunityUpdateDto {
    return {
        id,
        customerId: formData.customerId,
        title: formData.title,
        stage: formData.stage,
        amount: formData.amount,
        currency: formData.currency,
        probability: formData.probability,
        expectedCloseDate: formData.expectedCloseDate,
        source: formData.source,
        ownerUserId: formData.ownerUserId,
        description: formData.description,
    };
}

// Stage labels for UI
export const STAGE_LABELS = {
    1: 'Yeni',
    2: 'Nitelikli',
    3: 'Teklif',
    4: 'Pazarlık',
    5: 'Kazanıldı',
    6: 'Kaybedildi'
} as const;

// Stage colors for UI
export const STAGE_COLORS = {
    1: '#2196F3',
    2: '#FF9800',
    3: '#9C27B0',
    4: '#FF5722',
    5: '#4CAF50',
    6: '#F44336'
} as const;
