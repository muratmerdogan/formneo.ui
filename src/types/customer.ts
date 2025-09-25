export type CustomerStatus = "active" | "inactive";
export type Health = "good" | "warning" | "risk";

export interface Customer {
    id: string;
    name: string;
    logoUrl?: string;
    sector: string;
    country: string;
    city?: string;
    website?: string;
    email?: string;
    phone?: string;
    taxId?: string;
    tags: string[];
    status: CustomerStatus;
    health: Health;
    lastContactAt?: string; // ISO
    kpis: {
        totalRevenue: number;
        openOpportunities: number;
        arRisk: number; // alacak riski %
        nps?: number;
    };
    notes?: string;
    createdAt: string;
    updatedAt: string;
    // Lookup text alanları
    customerType?: string;
    category?: string;
    lifecycleStage?: string;
}

export interface Opportunity {
    id: string;
    customerId: string;
    name: string;
    amount: number;
    stage: "new" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
    probability: number;
    closeDate?: string;
}

export interface Activity {
    id: string;
    customerId: string;
    type: "call" | "meeting" | "email" | "task";
    title: string;
    at: string; // ISO
    owner: string;
    description?: string;
}

export interface Paginated<T> {
    items: T[];
    total: number;
}
