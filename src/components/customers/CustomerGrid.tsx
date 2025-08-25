import React from "react";
import { Customer } from "../../types/customer";
import CustomerCard from "./CustomerCard";

export default function CustomerGrid({ items, loading }: { items: Customer[]; loading: boolean }) {
    if (loading) return <SkeletonGrid />;
    if (!items.length) return <EmptyState />;
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((c) => (
                <CustomerCard key={c.id} c={c} />
            ))}
        </div>
    );
}

function SkeletonGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl border bg-white shadow-sm p-4 animate-pulse h-40" />
            ))}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="rounded-2xl border bg-white shadow-sm p-10 text-center text-slate-500">
            Kriterlere uygun müşteri bulunamadı
        </div>
    );
}
