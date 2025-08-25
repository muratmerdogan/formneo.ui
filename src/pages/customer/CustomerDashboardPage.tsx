import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import KpiBar from "components/customers/KpiBar";
import Timeline from "components/customers/Timeline";
import { Activity, Customer, Opportunity } from "../../types/customer";
import { currency } from "../../lib/format";
import { getCustomer, listActivities, listOpportunities, updateCustomer } from "../../lib/api";
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
        setLoading(true);
        Promise.all([getCustomer(id), listOpportunities(id), listActivities(id)])
            .then(([c, o, a]) => { setCustomer(c); setOpp(o); setActs(a); })
            .finally(() => setLoading(false));
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
        const next: Customer = {
            ...customer,
            name: values.name,
            sector: values.sector,
            status: values.status,
            email: values.email || undefined,
            phone: values.phone || undefined,
            website: values.website || undefined,
            country: values.country,
            city: values.city || undefined,
            notes: values.notes || undefined,
            tags: values.tags || [],
        };
        const saved = await updateCustomer(next);
        setCustomer(saved);
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
