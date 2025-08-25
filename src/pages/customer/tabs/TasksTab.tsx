import React, { useState } from "react";

type Task = { id: string; title: string; done: boolean };

export default function TasksTab(): JSX.Element {
    const [items, setItems] = useState<Task[]>([]);
    const [title, setTitle] = useState("");

    const add = () => {
        const t = title.trim();
        if (!t) return;
        setItems([{ id: String(Date.now()), title: t, done: false }, ...items]);
        setTitle("");
    };

    const toggle = (id: string) => setItems(items.map(i => i.id === id ? { ...i, done: !i.done } : i));

    return (
        <div className="space-y-3">
            <div className="rounded-2xl border bg-white shadow-sm p-3 flex gap-2">
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="h-9 px-3 rounded-md border w-full" placeholder="Görev" />
                <button onClick={add} className="h-9 px-3 rounded-md border bg-slate-900 text-white">Ekle</button>
            </div>
            <div className="rounded-2xl border bg-white shadow-sm divide-y">
                {items.map((t) => (
                    <label key={t.id} className="flex items-center gap-3 px-4 py-3">
                        <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
                        <span className={t.done ? "line-through text-slate-400" : ""}>{t.title}</span>
                    </label>
                ))}
                {!items.length && <div className="px-4 py-6 text-center text-slate-500">Kayıt yok</div>}
            </div>
        </div>
    );
}


