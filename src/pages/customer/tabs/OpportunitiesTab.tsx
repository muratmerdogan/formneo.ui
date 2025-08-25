import React, { useMemo, useState } from "react";
import { Opportunity } from "../../../types/customer";
import { currency } from "../../../lib/format";

export default function OpportunitiesTab({ rows }: { rows: Opportunity[] }): JSX.Element {
    const [q, setQ] = useState("");
    const [stage, setStage] = useState<string>("");
    const list = useMemo(() => rows.filter(r => (!q || r.name.toLowerCase().includes(q.toLowerCase())) && (!stage || r.stage === stage)), [rows, q, stage]);
    return (
        <div className="space-y-3">
            <div className="rounded-2xl border bg-white shadow-sm p-3 flex gap-2">
                <input value={q} onChange={(e) => setQ(e.target.value)} className="h-9 px-3 rounded-md border w-full sm:w-64" placeholder="Ara" />
                <select value={stage} onChange={(e) => setStage(e.target.value)} className="h-9 px-3 rounded-md border">
                    <option value="">Tümü</option>
                    <option value="new">Yeni</option>
                    <option value="qualified">Nitelikli</option>
                    <option value="proposal">Teklif</option>
                    <option value="negotiation">Pazarlık</option>
                    <option value="won">Kazanıldı</option>
                    <option value="lost">Kaybedildi</option>
                </select>
            </div>
            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="text-left px-4 py-2">Fırsat</th>
                            <th className="text-left px-4 py-2">Aşama</th>
                            <th className="text-left px-4 py-2">Olasılık</th>
                            <th className="text-left px-4 py-2">Tutar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((o) => (
                            <tr key={o.id} className="border-t">
                                <td className="px-4 py-2">{o.name}</td>
                                <td className="px-4 py-2">{o.stage}</td>
                                <td className="px-4 py-2">%{o.probability}</td>
                                <td className="px-4 py-2">{currency(o.amount)}</td>
                            </tr>
                        ))}
                        {!list.length && (
                            <tr>
                                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">Kayıt yok</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


