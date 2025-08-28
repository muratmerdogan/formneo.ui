import React, { useMemo, useState } from "react";

export type EmailRow = {
    id: string;
    email: string;
    description?: string;
    notify: boolean;
    bulk: boolean;
    isActive: boolean;
    isPrimary: boolean;
};

type Props = {
    label: string;
    rows: EmailRow[];
    onChange: (rows: EmailRow[]) => void;
    disabled?: boolean;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailsGrid({ label, rows, onChange, disabled }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState<{ email: string; description: string; notify: boolean; bulk: boolean; isActive: boolean; isPrimary: boolean }>({ email: "", description: "", notify: false, bulk: false, isActive: true, isPrimary: false });
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const openModal = () => { setEditingId(null); setForm({ email: "", description: "", notify: false, bulk: false, isActive: true, isPrimary: false }); setError(null); setIsModalOpen(true); };
    const openEdit = (row: EmailRow) => { setEditingId(row.id); setForm({ email: row.email, description: row.description || "", notify: !!row.notify, bulk: !!row.bulk, isActive: !!row.isActive, isPrimary: !!row.isPrimary }); setError(null); setIsModalOpen(true); };
    const closeModal = () => setIsModalOpen(false);

    const removeRow = (id: string) => {
        const updated = rows.filter(r => r.id !== id);
        onChange(updated);
    };

    const setPrimary = (id: string) => {
        const updated = rows.map(r => ({ ...r, isPrimary: r.id === id }));
        onChange(updated);
    };

    const submit = () => {
        const value = (form.email || "").trim();
        if (!emailRegex.test(value)) { setError("Geçersiz e-posta"); return; }
        if (editingId) {
            // update existing
            // prevent duplicate email to another row
            if (rows.some(r => r.id !== editingId && r.email.toLowerCase() === value.toLowerCase())) { setError("Zaten ekli"); return; }
            let updated = rows.map(r => r.id === editingId ? { ...r, email: value, description: (form.description || "").trim(), notify: !!form.notify, bulk: !!form.bulk, isActive: !!form.isActive, isPrimary: !!form.isPrimary } : r);
            if (form.isPrimary) {
                updated = updated.map(r => ({ ...r, isPrimary: r.id === editingId }));
            }
            onChange(updated);
            closeModal();
            return;
        }
        // create new
        if (rows.some(r => r.email.toLowerCase() === value.toLowerCase())) { setError("Zaten ekli"); return; }
        const newRow: EmailRow = { id: crypto.randomUUID(), email: value, description: (form.description || "").trim(), notify: !!form.notify, bulk: !!form.bulk, isActive: !!form.isActive, isPrimary: !!form.isPrimary };
        let updated = [...rows, newRow];
        if (form.isPrimary) {
            updated = updated.map(r => ({ ...r, isPrimary: r.id === newRow.id }));
        }
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
                            <th className="text-left px-3 py-2 border-b">Mail Adresi</th>
                            <th className="text-left px-3 py-2 border-b">Açıklama</th>
                            <th className="text-left px-3 py-2 border-b">Bildirim</th>
                            <th className="text-left px-3 py-2 border-b">Toplu E-Posta</th>
                            <th className="text-left px-3 py-2 border-b">Durumu</th>
                            <th className="text-left px-3 py-2 border-b">Birincil</th>
                            <th className="text-right px-3 py-2 border-b">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(r => (
                            <tr key={r.id} className="odd:bg-white even:bg-slate-50">
                                <td className="px-3 py-2 border-b">{r.email}</td>
                                <td className="px-3 py-2 border-b">{r.description || "-"}</td>
                                <td className="px-3 py-2 border-b">
                                    <input type="checkbox" checked={!!r.notify} onChange={(e) => onChange(rows.map(x => x.id === r.id ? { ...x, notify: e.target.checked } : x))} disabled={disabled} />
                                </td>
                                <td className="px-3 py-2 border-b">
                                    <input type="checkbox" checked={!!r.bulk} onChange={(e) => onChange(rows.map(x => x.id === r.id ? { ...x, bulk: e.target.checked } : x))} disabled={disabled} />
                                </td>
                                <td className="px-3 py-2 border-b">
                                    <input type="checkbox" checked={!!r.isActive} onChange={(e) => onChange(rows.map(x => x.id === r.id ? { ...x, isActive: e.target.checked } : x))} disabled={disabled} />
                                </td>
                                <td className="px-3 py-2 border-b">{r.isPrimary ? "Evet" : "Hayır"}</td>
                                <td className="px-3 py-2 border-b text-right">
                                    <button className="h-8 px-2 rounded-md border bg-white mr-2" onClick={() => openEdit(r)} disabled={disabled}>Düzenle</button>
                                    <button className="h-8 px-2 rounded-md border bg-white mr-2" onClick={() => setPrimary(r.id)} disabled={disabled || r.isPrimary}>Birincil Yap</button>
                                    <button className="h-8 px-2 rounded-md border bg-rose-600 text-white" onClick={() => removeRow(r.id)} disabled={disabled}>Sil</button>
                                </td>
                            </tr>
                        ))}
                        {!rows.length && (
                            <tr><td colSpan={3} className="px-3 py-6 text-center text-slate-500">Henüz e-posta eklenmedi</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {!disabled && (
                <div className="mt-2 flex justify-end">
                    <button className="h-9 px-3 rounded-md border bg-white" onClick={openModal}>+ E-posta Ekle</button>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30" onClick={closeModal} />
                    <div className="relative bg-white rounded-lg shadow-lg w-[92vw] max-w-md p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-base font-semibold">E-posta Ekle</div>
                            <button onClick={closeModal} className="h-8 px-2 rounded-md border">Kapat</button>
                        </div>
                        {error && <div className="mb-2 p-2 rounded border border-rose-200 bg-rose-50 text-rose-700 text-sm">{error}</div>}
                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <div className="text-xs text-slate-600 mb-1">E-posta</div>
                                <input value={form.email} onChange={(e) => setForm(s => ({ ...s, email: e.target.value }))} className="w-full h-9 px-3 rounded-md border" placeholder="ornek@firma.com" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-600 mb-1">Açıklama</div>
                                <input value={form.description} onChange={(e) => setForm(s => ({ ...s, description: e.target.value }))} className="w-full h-9 px-3 rounded-md border" placeholder="Örn: Muhasebe" />
                            </div>
                            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.notify} onChange={(e) => setForm(s => ({ ...s, notify: e.target.checked }))} /> Bildirim</label>
                            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.bulk} onChange={(e) => setForm(s => ({ ...s, bulk: e.target.checked }))} /> Toplu E-Posta</label>
                            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm(s => ({ ...s, isActive: e.target.checked }))} /> Aktif</label>
                            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPrimary} onChange={(e) => setForm(s => ({ ...s, isPrimary: e.target.checked }))} /> Birincil</label>
                            <div className="flex items-center justify-end gap-2">
                                <button className="h-9 px-3 rounded-md border bg-white" onClick={closeModal}>İptal</button>
                                <button className="h-9 px-3 rounded-md border bg-slate-900 text-white" onClick={submit}>{editingId ? "Güncelle" : "Kaydet"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


