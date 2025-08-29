import React, { useState, useMemo } from "react";
import { IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { CustomerPhonesApi } from "api/generated/api";
import getConfiguration from "confiuration";

export type PhoneRow = {
    id: string;
    label?: string;
    number: string;
    isPrimary: boolean;
    isActive: boolean;
    rowVersion?: string; // Optimistic concurrency control için
};

type Props = {
    label: string;
    rows: PhoneRow[];
    onChange: (rows: PhoneRow[]) => void;
    disabled?: boolean;
    customerId?: string;
    autoSave?: boolean;
};

const phoneRegex = /^[0-9 +()-]{6,}$/;

export default function PhonesGrid({ label, rows, onChange, disabled, customerId, autoSave = false }: Props): JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState<PhoneRow>({ id: "", label: "", number: "", isPrimary: false, isActive: true });
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const api = useMemo(() => new CustomerPhonesApi(getConfiguration()), []);

    const openModal = () => { setEditingId(null); setForm({ id: "", label: "", number: "", isPrimary: false, isActive: true }); setError(null); setIsModalOpen(true); };
    const openEdit = (row: PhoneRow) => { setEditingId(row.id); setForm({ ...row }); setError(null); setIsModalOpen(true); };
    const closeModal = () => setIsModalOpen(false);

    const removeRow = async (id: string) => {
        if (autoSave && customerId) {
            setLoading(true);
            try {
                await api.apiCustomersCustomerIdPhonesPhoneIdDelete(customerId, id);
                onChange(rows.filter(r => r.id !== id));
            } catch (err) {
                setError("Telefon silinemedi");
                console.error(err);
            } finally {
                setLoading(false);
            }
        } else {
            onChange(rows.filter(r => r.id !== id));
        }
    };

    const setPrimary = async (id: string) => {
        if (autoSave && customerId) {
            setLoading(true);
            try {
                const row = rows.find(r => r.id === id);
                if (row) {
                    await api.apiCustomersCustomerIdPhonesPhoneIdSetPrimaryPut(customerId, id);
                    const updated = rows.map(r => ({ ...r, isPrimary: r.id === id }));
                    onChange(updated);
                }
            } catch (err) {
                setError("Primary telefon güncellenemedi");
                console.error(err);
            } finally {
                setLoading(false);
            }
        } else {
            const updated = rows.map(r => ({ ...r, isPrimary: r.id === id }));
            onChange(updated);
        }
    };

    const submit = async () => {
        const value = (form.number || "").trim();
        if (!phoneRegex.test(value)) { setError("Geçersiz telefon"); return; }

        const phoneData = {
            label: (form.label || "").trim(),
            number: value,
            isPrimary: !!form.isPrimary,
            isActive: !!form.isActive,
            rowVersion: editingId ? rows.find(r => r.id === editingId)?.rowVersion : undefined // RowVersion alanı eklendi
        };

        if (editingId) {
            // Update existing
            if (autoSave && customerId) {
                setLoading(true);
                try {
                    await api.apiCustomersCustomerIdPhonesPhoneIdPut(customerId, editingId, phoneData);

                    let updated = rows.map(r => r.id === editingId ? { ...r, ...phoneData } : r);
                    if (form.isPrimary) {
                        updated = updated.map(r => ({ ...r, isPrimary: r.id === editingId }));
                    }
                    onChange(updated);
                    closeModal();
                } catch (err) {
                    setError("Telefon güncellenemedi");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                let updated = rows.map(r => r.id === editingId ? { ...r, ...phoneData } : r);
                if (form.isPrimary) {
                    updated = updated.map(r => ({ ...r, isPrimary: r.id === editingId }));
                }
                onChange(updated);
                closeModal();
            }
            return;
        }

        // Create new
        if (autoSave && customerId) {
            setLoading(true);
            try {
                const response: any = await api.apiCustomersCustomerIdPhonesPost(customerId, phoneData);
                const newRow: PhoneRow = {
                    id: response.data?.id || crypto.randomUUID(),
                    ...phoneData
                };

                let updated = [...rows, newRow];
                if (form.isPrimary) {
                    updated = updated.map(r => ({ ...r, isPrimary: r.id === newRow.id }));
                }
                onChange(updated);
                closeModal();
            } catch (err) {
                setError("Telefon eklenemedi");
                console.error(err);
            } finally {
                setLoading(false);
            }
        } else {
            const newRow: PhoneRow = { id: crypto.randomUUID(), ...phoneData };
            let updated = [...rows, newRow];
            if (form.isPrimary) {
                updated = updated.map(r => ({ ...r, isPrimary: r.id === newRow.id }));
            }
            onChange(updated);
            closeModal();
        }
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
                                <td className="px-3 py-2 border-b">
                                    <IconButton size="small" onClick={() => setPrimary(r.id)} disabled={disabled || loading} title="Birincil Yap">
                                        {r.isPrimary ? <StarIcon fontSize="small" className="text-yellow-500" /> : <StarBorderIcon fontSize="small" />}
                                    </IconButton>
                                </td>
                                <td className="px-3 py-2 border-b"><input type="checkbox" checked={!!r.isActive} onChange={(e) => onChange(rows.map(x => x.id === r.id ? { ...x, isActive: e.target.checked } : x))} disabled={disabled} /></td>
                                <td className="px-3 py-2 border-b text-right">
                                    <IconButton size="small" onClick={() => openEdit(r)} disabled={disabled || loading} title="Düzenle">
                                        <EditOutlinedIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => removeRow(r.id)} disabled={disabled || loading} title="Sil">
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
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
                    <button type="button" className="h-9 px-3 rounded-md border bg-white" onClick={openModal}>+ Telefon Ekle</button>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30" onClick={closeModal} />
                    <div className="relative bg-white rounded-lg shadow-lg w-[92vw] max-w-md p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-base font-semibold">{editingId ? "Telefon Düzenle" : "Telefon Ekle"}</div>
                            <button type="button" onClick={closeModal} className="h-8 px-2 rounded-md border" disabled={loading}>Kapat</button>
                        </div>
                        {error && <div className="mb-2 p-2 rounded border border-rose-200 bg-rose-50 text-rose-700 text-sm">{error}</div>}
                        <div className="grid grid-cols-1 gap-3">
                            <div><div className="text-xs text-slate-600 mb-1">Etiket</div><input className="w-full h-9 px-3 rounded-md border" value={form.label || ""} onChange={(e) => setForm(s => ({ ...s, label: e.target.value }))} placeholder="Örn: Muhasebe" /></div>
                            <div><div className="text-xs text-slate-600 mb-1">Telefon</div><input className="w-full h-9 px-3 rounded-md border" value={form.number} onChange={(e) => setForm(s => ({ ...s, number: e.target.value }))} placeholder="+90 5xx ..." /></div>
                            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.isPrimary} onChange={(e) => setForm(s => ({ ...s, isPrimary: e.target.checked }))} /> Birincil</label>
                            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.isActive} onChange={(e) => setForm(s => ({ ...s, isActive: e.target.checked }))} /> Aktif</label>
                            <div className="flex items-center justify-end gap-2">
                                <button type="button" className="h-9 px-3 rounded-md border bg-white" onClick={closeModal} disabled={loading}>İptal</button>
                                <button
                                    type="button"
                                    className="h-9 px-3 rounded-md border bg-slate-900 text-white disabled:opacity-50"
                                    onClick={submit}
                                    disabled={loading}
                                >
                                    {loading ? "Kaydediliyor..." : (editingId ? "Güncelle" : "Kaydet")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


