import { SettingsBundle, SettingsCategory, SettingsParameter, SettingsScope } from "./types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const mockCategories: SettingsCategory[] = [
    { id: "general", name: "Genel", description: "Genel uygulama ayarları", orderNo: 1 },
    { id: "crm", name: "CRM", description: "Müşteri ve satış parametreleri", orderNo: 2 },
    { id: "email", name: "E-posta", description: "SMTP ve bildirimler", orderNo: 3 },
];

const mockParameters: SettingsParameter[] = [
    {
        id: "locale", categoryId: "general", name: "Varsayılan Dil", type: "select", options: [
            { value: "tr", label: "Türkçe" }, { value: "en", label: "English" }
        ], defaultValue: "tr", orderNo: 1
    },
    { id: "feature-advanced", categoryId: "general", name: "Gelişmiş Özellikler", type: "boolean", defaultValue: false, orderNo: 2 },
    {
        id: "customer-types", categoryId: "crm", name: "Müşteri Tipleri", type: "multiselect", options: [
            { value: "gold", label: "Gold" }, { value: "silver", label: "Silver" }, { value: "standard", label: "Standart" }
        ], orderNo: 1
    },
    { id: "max-attachments", categoryId: "crm", name: "Maksimum Ek Boyutu (MB)", type: "number", defaultValue: 25, orderNo: 2 },
    { id: "smtp-host", categoryId: "email", name: "SMTP Host", type: "string", defaultValue: "smtp.example.com", orderNo: 1 },
    { id: "smtp-secure", categoryId: "email", name: "TLS Zorunlu", type: "boolean", defaultValue: true, orderNo: 2 },
];

export async function listCategories(): Promise<SettingsCategory[]> {
    await delay(200);
    return [...mockCategories].sort((a, b) => (a.orderNo || 0) - (b.orderNo || 0));
}

export async function getCategoryBundle(categoryId: string, scope: SettingsScope): Promise<SettingsBundle> {
    await delay(300);
    const category = mockCategories.find((c) => c.id === categoryId) || mockCategories[0];
    const parameters = mockParameters.filter((p) => p.categoryId === category.id).sort((a, b) => (a.orderNo || 0) - (b.orderNo || 0));
    const values = Object.fromEntries(parameters.map((p) => [p.id, { parameterId: p.id, scope, value: p.defaultValue }]));
    return { category, parameters, values };
}

export async function saveValues(categoryId: string, scope: SettingsScope, data: Record<string, unknown>): Promise<void> {
    await delay(300);
    console.log("[mock save]", categoryId, scope, data);
}


