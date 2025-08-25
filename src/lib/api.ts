import { Customer, Paginated, Opportunity, Activity } from "../types/customer";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

let customers: Customer[] = Array.from({ length: 24 }).map((_, i) => ({
    id: String(i + 1),
    name: ["Acme A.Ş.", "Globex Ltd.", "Initech", "Umbrella", "Wayne Corp", "Stark"][i % 6] + " " + (i + 1),
    sector: ["Perakende", "SaaS", "Finans", "İmalat"][i % 4],
    country: ["Türkiye", "Almanya", "ABD"][i % 3],
    city: ["İstanbul", "Berlin", "New York"][i % 3],
    website: "https://example.com",
    email: "contact@example.com",
    phone: "+90 555 000 00 00",
    taxId: "1234567890",
    tags: ["VIP", "Öncelikli", "E-fatura"].slice(0, (i % 3) + 1),
    status: i % 5 === 0 ? "inactive" : "active",
    health: (["good", "warning", "risk"] as const)[i % 3],
    lastContactAt: new Date(Date.now() - i * 86400000).toISOString(),
    kpis: {
        totalRevenue: 250000 * ((i % 5) + 1),
        openOpportunities: (i % 7),
        arRisk: (i % 5) * 7,
        nps: [42, 55, 73, 81][i % 4],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}));

let opportunities: Opportunity[] = Array.from({ length: 40 }).map((_, i) => ({
    id: String(i + 1),
    customerId: String((i % 10) + 1),
    name: "Fırsat " + (i + 1),
    amount: 10000 * ((i % 8) + 1),
    stage: ["new", "qualified", "proposal", "negotiation", "won", "lost"][i % 6] as Opportunity["stage"],
    probability: [10, 25, 50, 75, 90][i % 5],
    closeDate: new Date(Date.now() + i * 86400000).toISOString(),
}));

let activities: Activity[] = Array.from({ length: 50 }).map((_, i) => ({
    id: String(i + 1),
    customerId: String((i % 12) + 1),
    type: ["call", "meeting", "email", "task"][i % 4] as Activity["type"],
    title: "Aktivite " + (i + 1),
    at: new Date(Date.now() - i * 3600000).toISOString(),
    owner: ["Mert", "Elif", "Ayşe"][i % 3],
    description: "Not " + (i + 1),
}));

export async function listCustomers(params: {
    q?: string;
    sector?: string;
    tag?: string;
    status?: "active" | "inactive";
    sort?: "recent" | "revenue" | "name";
    page?: number;
    pageSize?: number;
}): Promise<Paginated<Customer>> {
    await wait(400);
    let data = [...customers];
    const { q, sector, tag, status, sort, page = 1, pageSize = 20 } = params;
    if (q) {
        const s = q.toLowerCase();
        data = data.filter((c) => c.name.toLowerCase().includes(s));
    }
    if (sector) data = data.filter((c) => c.sector === sector);
    if (tag) data = data.filter((c) => c.tags.includes(tag));
    if (status) data = data.filter((c) => c.status === status);

    if (sort === "revenue") data.sort((a, b) => b.kpis.totalRevenue - a.kpis.totalRevenue);
    if (sort === "name") data.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "recent") data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const start = (page - 1) * pageSize;
    const items = data.slice(start, start + pageSize);
    return { items, total: data.length };
}

export async function getCustomer(id: string): Promise<Customer> {
    await wait(300);
    const c = customers.find((x) => x.id === id);
    if (!c) throw new Error("Customer not found");
    return c;
}

export async function updateCustomer(payload: Customer): Promise<Customer> {
    await wait(350);
    customers = customers.map((c) => (c.id === payload.id ? { ...payload, updatedAt: new Date().toISOString() } : c));
    return getCustomer(payload.id);
}

export async function listOpportunities(customerId: string): Promise<Opportunity[]> {
    await wait(350);
    return opportunities.filter((o) => o.customerId === customerId);
}

export async function listActivities(customerId: string): Promise<Activity[]> {
    await wait(350);
    return activities.filter((a) => a.customerId === customerId);
}
