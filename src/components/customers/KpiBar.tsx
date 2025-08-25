import React from "react";

export default function KpiBar({ items }: { items: { label: string; value: string }[] }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {items.map((k, i) => (
                <div key={i} className="rounded-2xl border bg-white shadow-sm p-4">
                    <div className="text-xs text-slate-500">{k.label}</div>
                    <div className="text-lg font-semibold text-slate-900">{k.value}</div>
                </div>
            ))}
        </div>
    );
}
