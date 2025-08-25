import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import KpiBar from "components/customers/KpiBar";
import Timeline from "components/customers/Timeline";
import { Activity, Customer, Opportunity } from "../../types/customer";
import { currency } from "../../lib/format";
import { getCustomer, listActivities, listOpportunities, updateCustomer } from "../../lib/api";

export default function CustomerDashboardPage(): JSX.Element {
    const { id } = useParams();
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

    if (loading || !customer) return <div className="container-px py-6">Yükleniyor…</div>;

    const kpis = [
        { label: "Toplam Ciro", value: currency(customer.kpis.totalRevenue) },
        { label: "Açık Fırsatlar", value: String(customer.kpis.openOpportunities) },
        { label: "AR Riski", value: `${customer.kpis.arRisk}%` },
        { label: "Son İletişim", value: new Date(customer.lastContactAt ?? customer.updatedAt).toLocaleDateString("tr-TR") },
    ];

    return (
        <div className="container-px py-6 space-y-6">
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
                    <button key={k} className={`h-9 px-3 rounded-md border ${tab === k ? "bg-slate-900 text-white" : "bg-white"}`} onClick={() => setTab(k)}>{t}</button>
                ))}
            </nav>

            {tab === "genel" && <div className="rounded-2xl border bg-white shadow-sm p-4">Genel (form mock)</div>}
            {tab === "iletisim" && <div className="rounded-2xl border bg-white shadow-sm p-4">Kişiler (mock)</div>}
            {tab === "finans" && <div className="rounded-2xl border bg-white shadow-sm p-4">Finans (mock)</div>}
            {tab === "firsatlar" && <div className="rounded-2xl border bg-white shadow-sm p-4">Fırsatlar (mock)</div>}
            {tab === "aktiviteler" && <div className="rounded-2xl border bg-white shadow-sm p-4"><Timeline items={acts} /></div>}
            {tab === "notlar" && <div className="rounded-2xl border bg-white shadow-sm p-4">Notlar (mock)</div>}
            {tab === "gorevler" && <div className="rounded-2xl border bg-white shadow-sm p-4">Görevler (mock)</div>}
            {tab === "dokumanlar" && <div className="rounded-2xl border bg-white shadow-sm p-4">Dokümanlar (mock)</div>}
        </div>
    );
}
