import React, { useState } from "react";

export type AddressRow = {
    id: string;
    country?: string;
    city?: string;
    district?: string;
    postalCode?: string;
    line1?: string;
    line2?: string;
    isBilling: boolean;
    isShipping: boolean;
    isActive: boolean;
};

type Props = {
    label: string;
    rows: AddressRow[];
    onChange: (rows: AddressRow[]) => void;
    disabled?: boolean;
};

export default function AddressesGrid({ label, rows, onChange, disabled }: Props): JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState<AddressRow>({ id: "", country: "", city: "", district: "", postalCode: "", line1: "", line2: "", isBilling: false, isShipping: false, isActive: true });
    const [error, setError] = useState<string | null>(null);

    const openModal = () => { setForm({ id: "", country: "", city: "", district: "", postalCode: "", line1: "", line2: "", isBilling: false, isShipping: false, isActive: true }); setError(null); setIsModalOpen(true); };
    const closeModal = () => setIsModalOpen(false);

    const removeRow = (id: string) => { onChange(rows.filter(r => r.id !== id)); };

    const submit = () => {
        if (!(form.line1 || "").trim()) { setError("Adres satırı zorunlu"); return; }
        const newRow: AddressRow = { ...form, id: crypto.randomUUID(), line1: (form.line1 || "").trim(), line2: (form.line2 || "").trim(), country: (form.country || "").trim(), city: (form.city || "").trim(), district: (form.district || "").trim(), postalCode: (form.postalCode || "").trim() };
        onChange([...(rows || []), newRow]);
        closeModal();
    };

    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="border rounded-md overflow-hidden bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="text-left px-3 py-2 border-b">Adres</th>
                            <th className="text-left px-3 py-2 border-b">Ülke</th>
                            <th className="text-left px-3 py-2 border-b">Şehir</th>
                            <th className="text-left px-3 py-2 border-b">İlçe</th>
                            <th className="text-left px-3 py-2 border-b">Fatura</th>
                            <th className="text-left px-3 py-2 border-b">Kargo</th>
                            <th className="text-left px-3 py-2 border-b">Durumu</th>
                            <th className="text-right px-3 py-2 border-b">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(rows || []).map(r => (
                            <tr key={r.id} className="odd:bg-white even:bg-slate-50">
                                <td className="px-3 py-2 border-b">{r.line1}{r.line2 ? `, ${r.line2}` : ""}</td>
                                <td className="px-3 py-2 border-b">{r.country}</td>
                                <td className="px-3 py-2 border-b">{r.city}</td>
                                <td className="px-3 py-2 border-b">{r.district}</td>
                                <td className="px-3 py-2 border-b"><input type="checkbox" checked={!!r.isBilling} onChange={(e) => onChange(rows.map(x => x.id === r.id ? { ...x, isBilling: e.target.checked } : x))} disabled={disabled} /></td>
                                <td className="px-3 py-2 border-b"><input type="checkbox" checked={!!r.isShipping} onChange={(e) => onChange(rows.map(x => x.id === r.id ? { ...x, isShipping: e.target.checked } : x))} disabled={disabled} /></td>
                                <td className="px-3 py-2 border-b"><input type="checkbox" checked={!!r.isActive} onChange={(e) => onChange(rows.map(x => x.id === r.id ? { ...x, isActive: e.target.checked } : x))} disabled={disabled} /></td>
                                <td className="px-3 py-2 border-b text-right">
                                    <button className="h-8 px-2 rounded-md border bg-rose-600 text-white" onClick={() => removeRow(r.id)} disabled={disabled}>Sil</button>
                                </td>
                            </tr>
                        ))}
                        {!rows?.length && (
                            <tr><td colSpan={8} className="px-3 py-6 text-center text-slate-500">Henüz adres eklenmedi</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {!disabled && (
                <div className="mt-2 flex justify-end">
                    <button className="h-9 px-3 rounded-md border bg-white" onClick={openModal}>+ Adres Ekle</button>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30" onClick={closeModal} />
                    <div className="relative bg-white rounded-lg shadow-lg w-[92vw] max-w-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-base font-semibold">Adres Ekle</div>
                            <button onClick={closeModal} className="h-8 px-2 rounded-md border">Kapat</button>
                        </div>
                        {error && <div className="mb-2 p-2 rounded border border-rose-200 bg-rose-50 text-rose-700 text-sm">{error}</div>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div><div className="text-xs text-slate-600 mb-1">Ülke</div><input className="w-full h-9 px-3 rounded-md border" value={form.country || ""} onChange={(e) => setForm(s => ({ ...s, country: e.target.value }))} placeholder="Türkiye" /></div>
                            <div><div className="text-xs text-slate-600 mb-1">Şehir</div><input className="w-full h-9 px-3 rounded-md border" value={form.city || ""} onChange={(e) => setForm(s => ({ ...s, city: e.target.value }))} placeholder="İstanbul" /></div>
                            <div><div className="text-xs text-slate-600 mb-1">İlçe</div><input className="w-full h-9 px-3 rounded-md border" value={form.district || ""} onChange={(e) => setForm(s => ({ ...s, district: e.target.value }))} placeholder="Kadıköy" /></div>
                            <div><div className="text-xs text-slate-600 mb-1">Posta Kodu</div><input className="w-full h-9 px-3 rounded-md border" value={form.postalCode || ""} onChange={(e) => setForm(s => ({ ...s, postalCode: e.target.value }))} placeholder="34000" /></div>
                            <div className="md:col-span-2"><div className="text-xs text-slate-600 mb-1">Adres Satırı 1</div><input className="w-full h-9 px-3 rounded-md border" value={form.line1 || ""} onChange={(e) => setForm(s => ({ ...s, line1: e.target.value }))} placeholder="Mah., Cad., Sok., No" /></div>
                            <div className="md:col-span-2"><div className="text-xs text-slate-600 mb-1">Adres Satırı 2</div><input className="w-full h-9 px-3 rounded-md border" value={form.line2 || ""} onChange={(e) => setForm(s => ({ ...s, line2: e.target.value }))} placeholder="Daire, Kat vb." /></div>
                            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.isBilling} onChange={(e) => setForm(s => ({ ...s, isBilling: e.target.checked }))} /> Fatura Adresi</label>
                            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.isShipping} onChange={(e) => setForm(s => ({ ...s, isShipping: e.target.checked }))} /> Kargo Adresi</label>
                            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.isActive} onChange={(e) => setForm(s => ({ ...s, isActive: e.target.checked }))} /> Aktif</label>
                            <div className="md:col-span-2 flex items-center justify-end gap-2">
                                <button className="h-9 px-3 rounded-md border bg-white" onClick={closeModal}>İptal</button>
                                <button className="h-9 px-3 rounded-md border bg-slate-900 text-white" onClick={submit}>Kaydet</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


