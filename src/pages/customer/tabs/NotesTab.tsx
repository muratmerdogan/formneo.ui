import React, { useState } from "react";

export default function NotesTab({ initial = "" }: { initial?: string }): JSX.Element {
    const [value, setValue] = useState(initial);
    const [saved, setSaved] = useState<number | null>(null);
    return (
        <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-2">
            <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={6} className="w-full px-3 py-2 rounded-md border" placeholder="Notlar" />
            <div className="flex items-center gap-2">
                <button onClick={() => { setSaved(Date.now()); }} className="h-9 px-3 rounded-md border bg-slate-900 text-white">Kaydet</button>
                {saved && <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-2 py-1">Kaydedildi</span>}
            </div>
        </div>
    );
}


