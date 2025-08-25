import React from "react";
import { currency } from "../../../lib/format";

export default function FinanceTab({ totalRevenue = 0, arRisk = 0, nps = 0 }: { totalRevenue?: number; arRisk?: number; nps?: number }): JSX.Element {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border bg-white shadow-sm p-4">
                <div className="text-xs text-slate-500">Toplam Ciro</div>
                <div className="text-lg font-semibold">{currency(totalRevenue)}</div>
            </div>
            <div className="rounded-2xl border bg-white shadow-sm p-4">
                <div className="text-xs text-slate-500">AR Riski</div>
                <div className="text-lg font-semibold">%{arRisk}</div>
            </div>
            <div className="rounded-2xl border bg-white shadow-sm p-4">
                <div className="text-xs text-slate-500">NPS</div>
                <div className="text-lg font-semibold">{nps}</div>
            </div>
        </div>
    );
}


