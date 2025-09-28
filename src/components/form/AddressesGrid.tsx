import React, { useState, useMemo } from "react";
import { IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { CustomerAddressesApi } from "api/generated/api";
import getConfiguration from "confiuration";

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
    isPrimary: boolean;
    concurrencyToken?: number; // Optimistic concurrency control için
};

type Props = {
    label: string;
    rows: AddressRow[];
    onChange: (rows: AddressRow[]) => void;
    disabled?: boolean;
    customerId?: string;
    autoSave?: boolean;
};

export default function AddressesGrid({ label, rows, onChange, disabled, customerId, autoSave = false }: Props): JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState<AddressRow>({ id: "", country: "", city: "", district: "", postalCode: "", line1: "", line2: "", isBilling: false, isShipping: false, isActive: true, isPrimary: false });
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const api = useMemo(() => new CustomerAddressesApi(getConfiguration()), []);

    const openModal = () => { setEditingId(null); setForm({ id: "", country: "", city: "", district: "", postalCode: "", line1: "", line2: "", isBilling: false, isShipping: false, isActive: true, isPrimary: false }); setError(null); setIsModalOpen(true); };
    const openEdit = (row: AddressRow) => { setEditingId(row.id); setForm({ ...row }); setError(null); setIsModalOpen(true); };
    const closeModal = () => setIsModalOpen(false);

    const removeRow = async (id: string) => {
        if (autoSave && customerId) {
            setLoading(true);
            try {
                await api.apiCustomersCustomerIdAddressesAddressIdDelete(customerId, id);
                onChange(rows.filter(r => r.id !== id));
            } catch (err) {
                setError("Adres silinemedi");
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
                    // Set as default billing and shipping address
                    await api.apiCustomersCustomerIdAddressesAddressIdSetDefaultBillingPut(customerId, id);
                    await api.apiCustomersCustomerIdAddressesAddressIdSetDefaultShippingPut(customerId, id);
                    const updated = rows.map(r => ({ ...r, isPrimary: r.id === id }));
                    onChange(updated);
                }
            } catch (err) {
                setError("Primary adres güncellenemedi");
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
        if (!(form.line1 || "").trim()) { setError("Adres satırı zorunlu"); return; }

        const addressData = {
            country: (form.country || "").trim(),
            city: (form.city || "").trim(),
            district: (form.district || "").trim(),
            postalCode: (form.postalCode || "").trim(),
            line1: (form.line1 || "").trim(),
            line2: (form.line2 || "").trim(),
            isBilling: !!form.isBilling,
            isShipping: !!form.isShipping,
            isActive: !!form.isActive,
            isPrimary: !!form.isPrimary,
            concurrencyToken: editingId ? rows.find(r => r.id === editingId)?.concurrencyToken || 0 : 0 // ConcurrencyToken alanı eklendi
        };

        if (editingId) {
            // Update existing
            if (autoSave && customerId) {
                setLoading(true);
                try {
                    await api.apiCustomersCustomerIdAddressesAddressIdPut(customerId, editingId, addressData);

                    let updated = rows.map(r => r.id === editingId ? { ...r, ...addressData } : r);
                    if (form.isPrimary) {
                        updated = updated.map(r => ({ ...r, isPrimary: r.id === editingId }));
                    }
                    onChange(updated);
                    closeModal();
                } catch (err) {
                    setError("Adres güncellenemedi");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                let updated = rows.map(r => r.id === editingId ? { ...r, ...addressData } : r);
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
                const response: any = await api.apiCustomersCustomerIdAddressesPost(customerId, addressData);
                const newRow: AddressRow = {
                    id: response.data?.id || crypto.randomUUID(),
                    ...addressData
                };

                let updated = [...rows, newRow];
                if (form.isPrimary) {
                    updated = updated.map(r => ({ ...r, isPrimary: r.id === newRow.id }));
                }
                onChange(updated);
                closeModal();
            } catch (err) {
                setError("Adres eklenemedi");
                console.error(err);
            } finally {
                setLoading(false);
            }
        } else {
            const newRow: AddressRow = { id: crypto.randomUUID(), ...addressData };
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
                            <th className="text-left px-3 py-2 border-b">Adres</th>
                            <th className="text-left px-3 py-2 border-b">Ülke</th>
                            <th className="text-left px-3 py-2 border-b">Şehir</th>
                            <th className="text-left px-3 py-2 border-b">İlçe</th>
                            <th className="text-left px-3 py-2 border-b">Fatura</th>
                            <th className="text-left px-3 py-2 border-b">Kargo</th>
                            <th className="text-left px-3 py-2 border-b">Birincil</th>
                            <th className="text-left px-3 py-2 border-b">Durum</th>
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
                            <tr><td colSpan={9} className="px-3 py-6 text-center text-slate-500">Henüz adres eklenmedi</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {!disabled && (
                <div className="mt-2 flex justify-end">
                    <button type="button" className="h-9 px-3 rounded-md border bg-white" onClick={openModal}>+ Adres Ekle</button>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30" onClick={closeModal} />
                    <div className="relative bg-white rounded-lg shadow-lg w-[92vw] max-w-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-base font-semibold">{editingId ? "Adres Düzenle" : "Adres Ekle"}</div>
                            <button type="button" onClick={closeModal} className="h-8 px-2 rounded-md border" disabled={loading}>Kapat</button>
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
                            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.isPrimary} onChange={(e) => setForm(s => ({ ...s, isPrimary: e.target.checked }))} /> Birincil</label>
                            <div className="md:col-span-2 flex items-center justify-end gap-2">
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


