import React, { useState } from "react";

type Contact = { id: string; name: string; title?: string; email?: string; phone?: string };

export default function ContactsTab(): JSX.Element {
    const [items, setItems] = useState<Contact[]>([]);
    const [draft, setDraft] = useState<Contact>({ id: "", name: "", title: "", email: "", phone: "" });

    const add = () => {
        if (!draft.name.trim()) return;
        setItems([{ ...draft, id: String(Date.now()) }, ...items]);
        setDraft({ id: "", name: "", title: "", email: "", phone: "" });
    };

    return (
        <div className="space-y-3">
            <div className="rounded-2xl border bg-white shadow-sm p-4 grid grid-cols-1 md:grid-cols-5 gap-2">
                <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="h-10 px-3 rounded-md border" placeholder="Ad Soyad" />
                <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="h-10 px-3 rounded-md border" placeholder="Ünvan" />
                <input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className="h-10 px-3 rounded-md border" placeholder="E-posta" />
                <input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="h-10 px-3 rounded-md border" placeholder="Telefon" />
                <button onClick={add} className="h-10 rounded-md border bg-slate-900 text-white">Ekle</button>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="text-left px-4 py-2">Ad</th>
                            <th className="text-left px-4 py-2">Ünvan</th>
                            <th className="text-left px-4 py-2">E-posta</th>
                            <th className="text-left px-4 py-2">Telefon</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((c) => (
                            <tr key={c.id} className="border-t">
                                <td className="px-4 py-2">{c.name}</td>
                                <td className="px-4 py-2">{c.title}</td>
                                <td className="px-4 py-2">{c.email}</td>
                                <td className="px-4 py-2">{c.phone}</td>
                            </tr>
                        ))}
                        {!items.length && (
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


