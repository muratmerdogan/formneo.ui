import React from "react";
import { Customer } from "../../types/customer";
import { currency, dateShort } from "../../lib/format";
import { useNavigate } from "react-router-dom";

const healthTone: Record<Customer["health"], string> = {
    good: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    risk: "bg-rose-50 text-rose-700",
};

export default function CustomerCard({ c }: { c: Customer }) {
    const nav = useNavigate();
    return (
        <button
            onClick={() => nav(`/customers/${c.id}`)}
            className="text-left rounded-2xl border bg-white shadow-sm hover:shadow-lg transition-all overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 hover:-translate-y-0.5"
            role="link"
            aria-label={`${c.name} detayına git`}
        >
            <div className="h-1 w-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 group-hover:from-slate-200 group-hover:to-slate-200" />
            <div className="p-5">
                <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white grid place-items-center text-sm font-semibold shadow-sm ring-1 ring-slate-900/5">
                        {(c.name[0] || "?").toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <div className="max-w-full text-lg sm:text-xl font-semibold text-slate-900 truncate leading-snug">{c.name}</div>
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${c.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                                <span className={`inline-block w-1.5 h-1.5 rounded-full ${c.status === "active" ? "bg-emerald-600" : "bg-slate-500"}`} />
                                {c.status === "active" ? "Aktif" : "Pasif"}
                            </span>
                        </div>
                        <div className="text-sm sm:text-base text-slate-500 mt-0.5 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1">
                                <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" /></svg>
                                {c.sector}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="inline-flex items-center gap-1">
                                <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10Z" /><circle cx="12" cy="11" r="2.5" /></svg>
                                {c.country}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 -mx-5 h-px bg-slate-100" />

                <div className="mt-4 flex flex-wrap gap-2">
                    {c.tags.map((t) => (
                        <span key={t} className="text-xs sm:text-sm px-2 py-0.5 rounded-full border bg-slate-50 text-slate-700 border-slate-200">{t}</span>
                    ))}
                    <span className={`text-xs sm:text-sm px-2 py-0.5 rounded-full ${healthTone[c.health]} border border-transparent`}>{c.health === "good" ? "Sağlıklı" : c.health === "warning" ? "Uyarı" : "Risk"}</span>
                    <span className="inline-flex items-center gap-1 text-xs sm:text-sm px-2 py-0.5 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
                        <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 4h18M8 2v4M16 2v4" /><rect x="3" y="6" width="18" height="15" rx="2" /></svg>
                        Son temas: {dateShort(c.lastContactAt)}
                    </span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                    <Kpi label="Ciro" value={currency(c.kpis.totalRevenue)} icon={
                        <svg className="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18" /><path d="M7 13l3-3 4 4 5-5" /></svg>
                    } tone="blue" />
                    <Kpi label="Açık Fırsat" value={String(c.kpis.openOpportunities)} icon={
                        <svg className="w-3 h-3 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
                    } tone="amber" />
                    <Kpi label="AR Risk" value={`${c.kpis.arRisk}%`} icon={
                        <svg className="w-3 h-3 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20" /><path d="M5 19h14" /></svg>
                    } tone="rose" />
                </div>
            </div>
        </button>
    );
}

function Kpi({ label, value, icon, tone }: { label: string; value: string; icon?: React.ReactNode; tone?: "blue" | "amber" | "rose" | "slate" }) {
    const ring = tone === "blue" ? "ring-blue-100" : tone === "amber" ? "ring-amber-100" : tone === "rose" ? "ring-rose-100" : "ring-slate-100";
    return (
        <div className={`rounded-xl border p-2.5 bg-white ring-1 ${ring} group-hover:ring-2 transition-all`}>
            <div className="flex items-center justify-between">
                <div className="text-[10px] text-slate-500">{label}</div>
                {icon}
            </div>
            <div className="text-[13px] font-semibold text-slate-800 mt-1">{value}</div>
        </div>
    );
}
