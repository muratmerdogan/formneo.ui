import React, { useState, useMemo } from "react";
import { IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DateField from "components/form/DateField";
// NotesApi henüz implement edilmemiş
// import { CustomerNotesApi } from "api/generated/api";
// import getConfiguration from "confiuration";

export type NoteRow = {
    id: string;
    date: string; // ISO yyyy-MM-dd
    title: string; // Açıklama
    note: string;  // Not metni
    rowVersion?: string; // Optimistic concurrency control için
};

type Props = {
    label: string;
    rows: NoteRow[];
    onChange: (rows: NoteRow[]) => void;
    disabled?: boolean;
    customerId?: string;
    autoSave?: boolean;
};

export default function NotesGrid({ label, rows, onChange, disabled, customerId, autoSave = false }: Props): JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<NoteRow>({ id: "", date: "", title: "", note: "" });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // const api = useMemo(() => new CustomerNotesApi(getConfiguration()), []);

    const openModal = () => { setEditingId(null); setForm({ id: "", date: today(), title: "", note: "" }); setError(null); setIsModalOpen(true); };
    const openEdit = (row: NoteRow) => { setEditingId(row.id); setForm({ ...row }); setError(null); setIsModalOpen(true); };
    const closeModal = () => setIsModalOpen(false);

    const removeRow = async (id: string) => {
        if (autoSave && customerId) {
            setLoading(true);
            try {
                // Notes API henüz implement edilmemiş
                console.log(`DELETE /api/customers/${customerId}/notes/${id}`);
                onChange((rows || []).filter(r => r.id !== id));
            } catch (err) {
                setError("Not silinemedi");
                console.error(err);
            } finally {
                setLoading(false);
            }
        } else {
            onChange((rows || []).filter(r => r.id !== id));
        }
    };

    const submit = async () => {
        if (!form.date) { setError("Tarih zorunlu"); return; }
        if (!(form.title || "").trim()) { setError("Konu zorunlu"); return; }
        if (!(form.note || "").trim()) { setError("Not zorunlu"); return; }

        const noteData = {
            date: form.date,
            title: form.title.trim(),
            note: form.note.trim(),
            rowVersion: editingId ? (rows || []).find(r => r.id === editingId)?.rowVersion : undefined // RowVersion alanı eklendi
        };

        if (editingId) {
            // Update existing
            if (autoSave && customerId) {
                setLoading(true);
                try {
                    // Notes API henüz implement edilmemiş
                    console.log(`PUT /api/customers/${customerId}/notes/${editingId}`, noteData);

                    const updated = (rows || []).map(r => r.id === editingId ? { ...r, ...noteData } : r);
                    onChange(updated);
                    closeModal();
                } catch (err) {
                    setError("Not güncellenemedi");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                const payload: NoteRow = { id: editingId, ...noteData };
                onChange((rows || []).map(r => r.id === editingId ? payload : r));
                closeModal();
            }
            return;
        }

        // Create new
        if (autoSave && customerId) {
            setLoading(true);
            try {
                // Notes API henüz implement edilmemiş
                console.log(`POST /api/customers/${customerId}/notes`, noteData);
                const response = { data: { id: crypto.randomUUID() } }; // Temporary mock response
                const newRow: NoteRow = {
                    id: response.data?.id || crypto.randomUUID(),
                    ...noteData
                };

                onChange([...(rows || []), newRow]);
                closeModal();
            } catch (err) {
                setError("Not eklenemedi");
                console.error(err);
            } finally {
                setLoading(false);
            }
        } else {
            const payload: NoteRow = { id: crypto.randomUUID(), ...noteData };
            onChange([...(rows || []), payload]);
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
                            <th className="text-left px-3 py-2 border-b">Tarih</th>
                            <th className="text-left px-3 py-2 border-b">Konu</th>
                            <th className="text-left px-3 py-2 border-b">Not</th>
                            <th className="text-right px-3 py-2 border-b">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(rows || []).map(r => (
                            <tr key={r.id} className="odd:bg-white even:bg-slate-50">
                                <td className="px-3 py-2 border-b">{formatDate(r.date)}</td>
                                <td className="px-3 py-2 border-b">{r.title}</td>
                                <td className="px-3 py-2 border-b">{r.note}</td>
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
                            <tr><td colSpan={4} className="px-3 py-6 text-center text-slate-500">Henüz not eklenmedi</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {!disabled && (
                <div className="mt-2 flex justify-end">
                    <button type="button" className="h-9 px-3 rounded-md border bg-white" onClick={openModal}>+ Not Ekle</button>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30" onClick={closeModal} />
                    <div className="relative bg-white rounded-lg shadow-lg w-[92vw] max-w-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-base font-semibold">{editingId ? "Notu Düzenle" : "Not Ekle"}</div>
                            <button type="button" onClick={closeModal} className="h-8 px-2 rounded-md border" disabled={loading}>Kapat</button>
                        </div>
                        {error && <div className="mb-2 p-2 rounded border border-rose-200 bg-rose-50 text-rose-700 text-sm">{error}</div>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <DateField label="Tarih" value={form.date} onChange={(v) => setForm(s => ({ ...s, date: v }))} />
                            <div>
                                <div className="text-xs text-slate-600 mb-1">Konu</div>
                                <input className="w-full h-9 px-3 rounded-md border" value={form.title} onChange={(e) => setForm(s => ({ ...s, title: e.target.value }))} placeholder="Konu" />
                            </div>
                            <div className="md:col-span-2">
                                <div className="text-xs text-slate-600 mb-1">Not</div>
                                <textarea className="w-full h-32 px-3 py-2 rounded-md border" value={form.note} onChange={(e) => setForm(s => ({ ...s, note: e.target.value }))} placeholder="Detaylı not" />
                            </div>
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

function today(): string {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
}

function formatDate(value?: string): string {
    if (!value) return "";
    try {
        const d = new Date(value);
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${day}.${m}.${d.getFullYear()}`;
    } catch {
        return value;
    }
}



