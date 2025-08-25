import React from "react";
import { Activity } from "../../types/customer";
import { dateShort } from "../../lib/format";

export default function Timeline({ items }: { items: Activity[] }) {
    return (
        <ol className="relative border-l border-slate-200 pl-4 space-y-4">
            {items.map((a) => (
                <li key={a.id}>
                    <div className="text-xs text-slate-400">{dateShort(a.at)} • {a.owner}</div>
                    <div className="text-sm font-medium text-slate-800">{a.title}</div>
                    {a.description && <div className="text-sm text-slate-600">{a.description}</div>}
                </li>
            ))}
        </ol>
    );
}


