import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CustomerFilters from "../../components/customers/CustomerFilters";
import CustomerGrid from "../../components/customers/CustomerGrid";
import { listCustomers } from "../../lib/api";
import { Customer } from "../../types/customer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

export default function CustomersPage(): JSX.Element {
    const [params, setParams] = useSearchParams();
    const [items, setItems] = useState<Customer[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const q = params.get("q") ?? "";
    const sector = params.get("sector") ?? "";
    const tag = params.get("tag") ?? "";
    const status = params.get("status") ?? "";
    const sort = params.get("sort") ?? "recent";
    const page = Number(params.get("page") ?? 1);
    const pageSize = Number(params.get("pageSize") ?? 20);

    const patch = (patch: Record<string, string>) => {
        const next = new URLSearchParams(params);
        Object.entries(patch).forEach(([k, v]) => v === "" ? next.delete(k) : next.set(k, v));
        if (!patch.page) next.set("page", "1");
        setParams(next, { replace: true });
    };

    useEffect(() => {
        setLoading(true);
        const statusFilter = (status === "active" || status === "inactive") ? status : undefined;
        const sortBy = (sort === "recent" || sort === "revenue" || sort === "name") ? sort : "recent";
        listCustomers({ q, sector, tag, status: statusFilter, sort: sortBy, page, pageSize })
            .then((res) => { setItems(res.items); setTotal(res.total); })
            .finally(() => setLoading(false));
    }, [q, sector, tag, status, sort, page, pageSize]);

    const onClear = () => setParams(new URLSearchParams(), { replace: true });

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <div className="px-6 lg:px-10 py-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xl font-semibold text-slate-900">Müşteriler</div>
                        <div className="text-sm text-slate-500">Kart görünümünde grid liste</div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
                        <div className="rounded-xl border bg-white shadow-sm px-3 py-2">Toplam: {total}</div>
                    </div>
                </div>

                <div className="sticky top-4 z-10">
                    <CustomerFilters
                        q={q} sector={sector} tag={tag} status={status} sort={sort}
                        onChange={patch}
                        onClear={onClear}
                    />
                </div>

                <CustomerGrid items={items} loading={loading} />

                <div className="flex items-center justify-between text-sm text-slate-600">
                    <div>Toplam: {total}</div>
                    <div className="flex items-center gap-2">
                        <button disabled={page <= 1} onClick={() => patch({ page: String(page - 1) })} className="h-9 px-3 rounded-md border">Geri</button>
                        <div>Sayfa {page}</div>
                        <button onClick={() => patch({ page: String(page + 1) })} className="h-9 px-3 rounded-md border">İleri</button>
                        <select value={pageSize} onChange={(e) => patch({ pageSize: e.target.value })} className="h-9 px-2 rounded-md border">
                            <option value="10">10</option><option value="20">20</option><option value="50">50</option>
                        </select>
                    </div>
                </div>
            </div>
            <Footer />
        </DashboardLayout>
    );
}
