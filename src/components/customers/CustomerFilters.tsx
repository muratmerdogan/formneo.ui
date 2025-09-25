import React from "react";

type Props = {
    q: string;
    sector: string;
    tag: string;
    status: string;
    sort: string;
    onChange: (patch: Partial<Record<keyof Props, string>>) => void;
    onClear: () => void;
};

export default function CustomerFilters({ q, sector, tag, status, sort, onChange, onClear }: Props) {
    return (
        <div className="rounded-2xl border bg-white shadow-sm p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <input
                    value={q}
                    onChange={(e) => onChange({ q: e.target.value })}
                    placeholder="Müşteri adı, kodu veya vergi no ile ara..."
                    className="h-9 px-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-slate-200"
                    aria-label="Ara"
                />
                <select value={sector} onChange={(e) => onChange({ sector: e.target.value })} className="h-9 px-3 rounded-md border">
                    <option value="">Sektör</option>
                    <option>Perakende</option>
                    <option>SaaS</option>
                    <option>Finans</option>
                    <option>İmalat</option>
                </select>
                <select value={tag} onChange={(e) => onChange({ tag: e.target.value })} className="h-9 px-3 rounded-md border">
                    <option value="">Etiket</option>
                    <option>VIP</option>
                    <option>Öncelikli</option>
                    <option>E-fatura</option>
                </select>
                <select value={status} onChange={(e) => onChange({ status: e.target.value })} className="h-9 px-3 rounded-md border">
                    <option value="">Durum</option>
                    <option value="active">Aktif</option>
                    <option value="inactive">Pasif</option>
                </select>
                <div className="flex items-center gap-2">
                    <select value={sort} onChange={(e) => onChange({ sort: e.target.value })} className="h-9 px-3 rounded-md border flex-1">
                        <option value="recent">Sıralama: Son</option>
                        <option value="revenue">Sıralama: Ciro</option>
                        <option value="name">Sıralama: Ad</option>
                    </select>
                    <button onClick={onClear} className="h-9 px-3 rounded-md border bg-slate-50">Temizle</button>
                </div>
            </div>
        </div>
    );
}
