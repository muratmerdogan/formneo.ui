import React, { useState } from "react";

export type PhoneRow = { id: string; label?: string; number: string; isPrimary: boolean; isActive: boolean };

type Props = {
    label: string;
    rows: PhoneRow[];
    onChange: (rows: PhoneRow[]) => void;
    disabled?: boolean;
};

const phoneRegex = /^[0-9 +()-]{6,}$/;

export default function PhonesGrid({ label, rows, onChange, disabled }: Props): JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState<PhoneRow>({ id: "", label: "", number: "", isPrimary: false, isActive: true });
    const [error, setError] = useState<string | null>(null);

    const openModal = () => { setForm({ id: "", label: "", number: "", isPrimary: false, isActive: true }); setError(null); setIsModalOpen(true); };
    const closeModal = () => setIsModalOpen(false);

    const removeRow = (id: string) => onChange(rows.filter(r => r.id !== id));

    const setPrimary = (id: string) => onChange(rows.map(r => ({ ...r, isPrimary: r.id === id })));

    const submit = () => {
        const value = (form.number || "").trim();
        if (!phoneRegex.test(value)) { setError("Geçersiz telefon"); return; }
        const newRow: PhoneRow = { id: crypto.randomUUID(), label: (form.label || "").trim(), number: value, isPrimary: !!form.isPrimary, isActive: !!form.isActive };
        const updated = [...rows, newRow].map(r => ({ ...r, isPrimary: form.isPrimary ? r.id === newRow.id : r.isPrimary }));
        onChange(updated);
        closeModal();
    };

    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="border rounded-md overflow-hidden bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="text-left px-3 py-2 border-b">Etiket</th>
                            <th className="text-left px-3 py-2 border-b">Telefon</th>
                            <th className="text-left px-3 py-2 border-b">Birincil</th>
                            <th className="text-left px-3 py-2 border-b">Durumu</th>
                            <th className="text-right px-3 py-2 border-b">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(rows || []).map(r => (
                            <tr key={r.id} className="odd:bg-white even:bg-slate-50">
                                <td className="px-3 py-2 border-b">{r.label || "-"}</td>
                                <td className="px-3 py-2 border-b">{r.number}</td>
                                <td className="px-3 py-2 border-b">{r.isPrimary ? "Evet" : "Hayır"}</td>
                                <td className="px-3 py-2 border-b"><input type="checkbox" checked={!!r.isActive} onChange={(e) => onChange(rows.map(x => x.id === r.id ? { ...x, isActive: e.target.checked } : x))} disabled={disabled} /></td>
                                <td className="px-3 py-2 border-b text-right">
                                    <button className="h-8 px-2 rounded-md border bg-white mr-2" onClick={() => setPrimary(r.id)} disabled={disabled || r.isPrimary}>Birincil Yap</button>
                                    <button className="h-8 px-2 rounded-md border bg-rose-600 text-white" onClick={() => removeRow(r.id)} disabled={disabled}>Sil</button>
                                </td>
                            </tr>
                        ))}
                        {!rows?.length && (
                            <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-500">Henüz telefon eklenmedi</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {!disabled && (
                <div className="mt-2 flex justify-end">
                    <button className="h-9 px-3 rounded-md border bg-white" onClick={openModal}>+ Telefon Ekle</button>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30" onClick={closeModal} />
                    <div className="relative bg-white rounded-lg shadow-lg w-[92vw] max-w-md p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-base font-semibold">Telefon Ekle</div>
                            <button onClick={closeModal} className="h-8 px-2 rounded-md border">Kapat</button>
                        </div>
                        {error && <div className="mb-2 p-2 rounded border border-rose-200 bg-rose-50 text-rose-700 text-sm">{error}</div>}
                        <div className="grid grid-cols-1 gap-3">
                            <div><div className="text-xs text-slate-600 mb-1">Etiket</div><input className="w-full h-9 px-3 rounded-md border" value={form.label || ""} onChange={(e) => setForm(s => ({ ...s, label: e.target.value }))} placeholder="Örn: Muhasebe" /></div>
                            <div><div className="text-xs text-slate-600 mb-1">Telefon</div><input className="w-full h-9 px-3 rounded-md border" value={form.number} onChange={(e) => setForm(s => ({ ...s, number: e.target.value }))} placeholder="+90 5xx ..." /></div>
                            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.isPrimary} onChange={(e) => setForm(s => ({ ...s, isPrimary: e.target.checked }))} /> Birincil</label>
                            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.isActive} onChange={(e) => setForm(s => ({ ...s, isActive: e.target.checked }))} /> Aktif</label>
                            <div className="flex items-center justify-end gap-2">
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


