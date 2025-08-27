import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomerFilters from "../../components/customers/CustomerFilters";
import CustomerGrid from "../../components/customers/CustomerGrid";
import { CustomersApi } from "api/generated/api";
import { Customer } from "../../types/customer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import getConfiguration from "confiuration";
import { useRegisterActions } from "context/ActionBarContext";
import AddIcon from "@mui/icons-material/Add";

export default function CustomersPage(): JSX.Element {
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();
    const [all, setAll] = useState<Customer[]>([]);
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

    // Action Bar: Yeni müşteri oluştur
    useRegisterActions([
        {
            id: "new-customer",
            label: "Yeni Müşteri",
            icon: <AddIcon fontSize="small" />,
            onClick: () => navigate("/customers/new"),
        },
    ], [navigate]);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        const api = new CustomersApi(getConfiguration());
        api.apiCustomersGet()
            .then((res: any) => {
                const data = Array.isArray(res?.data) ? res.data : (res?.data?.items ?? []);
                const mapped: Customer[] = (data as any[]).map(normalizeCustomerFromDto);
                if (isMounted) setAll(mapped);
            })
            .finally(() => { if (isMounted) setLoading(false); });
        return () => { isMounted = false; };
    }, []);

    const { items, total } = useMemo(() => {
        // Önceden client-side filtreleme/paging vardı; aynı mantığı koruyoruz
        const sortBy = (sort === "recent" || sort === "revenue" || sort === "name") ? sort : "recent";
        let data = [...all];
        if (q) {
            const s = q.toLowerCase();
            data = data.filter((c) => c.name.toLowerCase().includes(s));
        }
        if (sector) data = data.filter((c) => c.sector === sector);
        if (tag) data = data.filter((c) => (c.tags || []).includes(tag));
        if (status === "active" || status === "inactive") data = data.filter((c) => c.status === status);

        if (sortBy === "revenue") data.sort((a, b) => (b.kpis?.totalRevenue ?? 0) - (a.kpis?.totalRevenue ?? 0));
        if (sortBy === "name") data.sort((a, b) => a.name.localeCompare(b.name));
        if (sortBy === "recent") data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        const start = (page - 1) * pageSize;
        const pageItems = data.slice(start, start + pageSize);
        return { items: pageItems, total: data.length };
    }, [all, q, sector, tag, status, sort, page, pageSize]);

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
                    <div className="hidden md:flex items-center gap-3 text-sm text-slate-600">
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

function normalizeCustomerFromDto(dto: any): Customer {
    const id = String(dto?.id ?? dto?.cusid ?? dto?.customerId ?? "");
    const name = String(dto?.name ?? dto?.custx ?? dto?.title ?? "");
    const firstAddress = Array.isArray(dto?.addresses) && dto.addresses.length ? dto.addresses[0] : undefined;
    const country = String(firstAddress?.country ?? dto?.country ?? "");
    const city = (firstAddress?.city ?? dto?.city) ? String(firstAddress?.city ?? dto?.city) : undefined;
    const website = (dto?.website ?? dto?.webSite) ? String(dto?.website ?? dto?.webSite) : undefined;
    const email = (dto?.emailPrimary ?? dto?.email) ? String(dto?.emailPrimary ?? dto?.email) : undefined;
    const phone = (dto?.phone ?? dto?.mobile) ? String(dto?.phone ?? dto?.mobile) : undefined;
    const statusNum = typeof dto?.status === "number" ? dto.status : undefined;
    const status = (dto?.status === "active" || dto?.status === "inactive")
        ? dto.status
        : (statusNum !== undefined ? (statusNum > 0 ? "active" : "inactive") : "active");
    const sectors = Array.isArray(dto?.sectors) ? dto.sectors : (dto?.sector ? [dto.sector] : []);
    const sector = sectors.length ? String(sectors[0]) : "";
    const tags = Array.isArray(dto?.tags) ? dto.tags as string[] : [];
    const nowIso = new Date().toISOString();
    const createdAt = String(dto?.createdDate ?? dto?.createdAt ?? nowIso);
    const updatedAt = String(dto?.updatedDate ?? dto?.updatedAt ?? createdAt);
    return {
        id,
        name,
        logoUrl: undefined,
        sector,
        country,
        city,
        website,
        email,
        phone,
        taxId: dto?.taxNumber ?? undefined,
        tags,
        status,
        health: "good",
        lastContactAt: updatedAt,
        kpis: { totalRevenue: 0, openOpportunities: 0, arRisk: 0 },
        notes: dto?.note ?? undefined,
        createdAt,
        updatedAt,
    };
}
