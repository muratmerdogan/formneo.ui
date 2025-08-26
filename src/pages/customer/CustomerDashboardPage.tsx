import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import KpiBar from "components/customers/KpiBar";
import Timeline from "components/customers/Timeline";
import { Activity, Customer, Opportunity } from "../../types/customer";
import { currency } from "../../lib/format";
import { ActivitiesApi, CustomersApi, OpportunitiesApi } from "api/generated/api";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import GeneralTab from "./tabs/GeneralTab";
import ContactsTab from "./tabs/ContactsTab";
import FinanceTab from "./tabs/FinanceTab";
import OpportunitiesTab from "./tabs/OpportunitiesTab";
import ActivitiesTab from "./tabs/ActivitiesTab";
import NotesTab from "./tabs/NotesTab";
import TasksTab from "./tabs/TasksTab";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import getConfiguration from "confiuration";

const schema = z.object({
    name: z.string().min(2),
    sector: z.string().min(1),
    status: z.enum(["active", "inactive"]),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    website: z.string().url().optional().or(z.literal("")),
    country: z.string().min(1),
    city: z.string().optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
    tags: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function CustomerDashboardPage(): JSX.Element {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [opp, setOpp] = useState<Opportunity[]>([]);
    const [acts, setActs] = useState<Activity[]>([]);
    const [tab, setTab] = useState("genel");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        let isMounted = true;
        setLoading(true);
        const customersApi = new CustomersApi(getConfiguration());
        const oppApi = new OpportunitiesApi(getConfiguration());
        const actApi = new ActivitiesApi(getConfiguration());
        Promise.all([
            customersApi.apiCustomersIdGet(id),
            oppApi.apiCrmOpportunitiesCustomerCustomerIdGet(id as string),
            actApi.apiCrmActivitiesCustomerCustomerIdGet(id as string),
        ])
            .then(([cRes, oRes, aRes]: any[]) => {
                if (!isMounted) return;
                const c = normalizeCustomerFromDto(cRes?.data);
                const o: Opportunity[] = Array.isArray(oRes?.data) ? (oRes.data as any[]).map(normalizeOpportunityFromDto) : [];
                const a: Activity[] = Array.isArray(aRes?.data) ? (aRes.data as any[]).map(normalizeActivityFromDto) : [];
                setCustomer(c);
                setOpp(o);
                setActs(a);
            })
            .finally(() => { if (isMounted) setLoading(false); });
        return () => { isMounted = false; };
    }, [id]);

    const methods = useForm<FormValues>({
        resolver: zodResolver(schema),
        values: customer ? {
            name: customer.name,
            sector: customer.sector,
            status: customer.status,
            email: customer.email ?? "",
            phone: customer.phone ?? "",
            website: customer.website ?? "",
            country: customer.country,
            city: customer.city ?? "",
            notes: customer.notes ?? "",
            tags: customer.tags ?? [],
        } : undefined,
        mode: "onBlur",
    });

    const { handleSubmit, formState: { isSubmitting, isDirty } } = methods;

    const onSubmit = async (values: FormValues) => {
        if (!customer) return;
        const api = new CustomersApi(getConfiguration());
        const dto: any = {
            id: customer.id,
            name: values.name,
            sectors: values.sector ? [values.sector] : [],
            status: values.status === "active" ? 1 : 0,
            emailPrimary: values.email || null,
            phone: values.phone || null,
            website: values.website || null,
            tags: values.tags || [],
            note: values.notes || null,
        };
        try {
            const res: any = await api.apiCustomersPut(dto);
            const saved = normalizeCustomerFromDto(res?.data ?? dto);
            setCustomer(saved);
        } catch {
            // sessizce geç
        }
    };

    if (loading || !customer) return (
        <DashboardLayout>
            <DashboardNavbar />
            <div className="px-6 lg:px-10 py-6">Yükleniyor…</div>
            <Footer />
        </DashboardLayout>
    );

    const kpis = [
        { label: "Toplam Ciro", value: currency(customer.kpis.totalRevenue) },
        { label: "Açık Fırsatlar", value: String(customer.kpis.openOpportunities) },
        { label: "AR Riski", value: `${customer.kpis.arRisk}%` },
        { label: "Son İletişim", value: new Date(customer.lastContactAt ?? customer.updatedAt).toLocaleDateString("tr-TR") },
    ];

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="px-6 lg:px-10 py-6 space-y-6">
                    {/* Global Sticky Action Bar */}
                    <div className="sticky top-16 z-10 -mt-2 -mx-6 lg:-mx-10 px-6 lg:px-10 py-2 bg-gradient-to-b from-white/95 to-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b flex items-center justify-end gap-2">
                        <button type="button" onClick={() => navigate(-1)} className="h-9 px-3 rounded-md border">Vazgeç</button>
                        <button disabled={!isDirty || isSubmitting} type="submit" className="h-9 px-4 rounded-md border bg-slate-900 text-white disabled:opacity-50">Kaydet</button>
                    </div>

                    <header className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white grid place-items-center text-sm font-semibold">
                            {(customer.name[0] || "?").toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <div className="text-xl font-semibold text-slate-900">{customer.name}</div>
                            <div className="text-sm text-slate-500">{customer.sector} • {customer.country}{customer.city ? ` / ${customer.city}` : ""}</div>
                        </div>
                    </header>

                    <KpiBar items={kpis} />

                    <nav className="flex items-center gap-2 flex-wrap">
                        {[
                            ["genel", "Genel"],
                            ["iletisim", "İletişim"],
                            ["finans", "Finans"],
                            ["firsatlar", "Fırsatlar"],
                            ["aktiviteler", "Aktiviteler"],
                            ["notlar", "Notlar"],
                            ["gorevler", "Görevler"],
                            ["dokumanlar", "Dokümanlar"],
                        ].map(([k, t]) => (
                            <button key={k} type="button" className={`h-9 px-3 rounded-md border ${tab === k ? "bg-slate-900 text-white" : "bg-white"}`} onClick={() => setTab(k)}>{t}</button>
                        ))}
                    </nav>

                    {tab === "genel" && (
                        <GeneralTab customer={customer} />
                    )}
                    {tab === "iletisim" && <ContactsTab />}
                    {tab === "finans" && <FinanceTab totalRevenue={customer.kpis.totalRevenue} arRisk={customer.kpis.arRisk} nps={customer.kpis.nps ?? 0} />}
                    {tab === "firsatlar" && <OpportunitiesTab rows={opp} />}
                    {tab === "aktiviteler" && <ActivitiesTab items={acts} />}
                    {tab === "notlar" && <NotesTab initial={customer.notes ?? ""} />}
                    {tab === "gorevler" && <TasksTab />}
                    {tab === "dokumanlar" && <div className="rounded-2xl border bg-white shadow-sm p-4">Dokümanlar (mock)</div>}
                </form>
            </FormProvider>
            <Footer />
        </DashboardLayout>
    );
}

function normalizeCustomerFromDto(dto: any): Customer {
    if (!dto) {
        const now = new Date().toISOString();
        return { id: "", name: "", sector: "", country: "", tags: [], status: "active", health: "good", kpis: { totalRevenue: 0, openOpportunities: 0, arRisk: 0 }, createdAt: now, updatedAt: now };
    }
    const id = String(dto?.id ?? dto?.cusid ?? dto?.customerId ?? "");
    const name = String(dto?.name ?? dto?.custx ?? dto?.title ?? "");
    const firstAddress = Array.isArray(dto?.addresses) && dto.addresses.length ? dto.addresses[0] : undefined;
    const country = String(firstAddress?.country ?? dto?.country ?? "");
    const city = (firstAddress?.city ?? dto?.city) ? String(firstAddress?.city ?? dto?.city) : undefined;
    const website = (dto?.website ?? dto?.webSite) ? String(dto?.website ?? dto?.webSite) : undefined;
    const email = (dto?.emailPrimary ?? dto?.email) ? String(dto?.emailPrimary ?? dto?.email) : undefined;
    const phone = (dto?.phone ?? dto?.mobile) ? String(dto?.phone ?? dto?.mobile) : undefined;
    const statusNum = typeof dto?.status === "number" ? dto.status : undefined;
    const status = (dto?.status === "active" || dto?.status === "inactive")
        ? dto.status
        : (statusNum !== undefined ? (statusNum > 0 ? "active" : "inactive") : "active");
    const sectors = Array.isArray(dto?.sectors) ? dto.sectors : (dto?.sector ? [dto.sector] : []);
    const sector = sectors.length ? String(sectors[0]) : "";
    const tags = Array.isArray(dto?.tags) ? dto.tags as string[] : [];
    const nowIso = new Date().toISOString();
    const createdAt = String(dto?.createdDate ?? dto?.createdAt ?? nowIso);
    const updatedAt = String(dto?.updatedDate ?? dto?.updatedAt ?? createdAt);
    return {
        id,
        name,
        logoUrl: undefined,
        sector,
        country,
        city,
        website,
        email,
        phone,
        taxId: dto?.taxNumber ?? undefined,
        tags,
        status,
        health: "good",
        lastContactAt: updatedAt,
        kpis: { totalRevenue: 0, openOpportunities: 0, arRisk: 0 },
        notes: dto?.note ?? undefined,
        createdAt,
        updatedAt,
    };
}

function normalizeOpportunityFromDto(dto: any): Opportunity {
    return {
        id: String(dto?.id ?? ""),
        customerId: String(dto?.customerId ?? ""),
        name: String(dto?.title ?? dto?.name ?? ""),
        amount: Number(dto?.amount ?? 0),
        stage: mapStageNumberToName(dto?.stage),
        probability: Number(dto?.probability ?? 0),
        closeDate: dto?.expectedCloseDate ?? undefined,
    };
}

function normalizeActivityFromDto(dto: any): Activity {
    const type = mapActivityTypeNumberToName(dto?.type);
    const at = dto?.startTime || dto?.dueDate || dto?.endTime || new Date().toISOString();
    const owner = dto?.assignedToUserId ? String(dto.assignedToUserId) : "Sistem";
    return {
        id: String(dto?.id ?? ""),
        customerId: String(dto?.customerId ?? ""),
        type,
        title: String(dto?.subject ?? dto?.description ?? "Aktivite"),
        at: String(at),
        owner,
        description: dto?.description ?? undefined,
    };
}

function mapStageNumberToName(stageNum: any): Opportunity["stage"] {
    const n = Number(stageNum ?? 0);
    switch (n) {
        case 1: return "new";
        case 2: return "qualified";
        case 3: return "proposal";
        case 4: return "negotiation";
        case 5: return "won";
        case 6: return "lost";
        default: return "new";
    }
}

function mapActivityTypeNumberToName(typeNum: any): Activity["type"] {
    const n = Number(typeNum ?? 0);
    switch (n) {
        case 1: return "call";
        case 2: return "meeting";
        case 3: return "email";
        case 4: return "task";
        default: return "task";
    }
}
