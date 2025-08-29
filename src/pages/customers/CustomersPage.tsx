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
import { GridView, TableChart } from "@mui/icons-material";
import DataGrid, { ColumnDef } from "../../components/ui/DataGrid";

export default function CustomersPage(): JSX.Element {
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();
    const [all, setAll] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
    const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

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

    // DataGrid sütun tanımları
    const columns: ColumnDef<Customer>[] = [
        {
            key: 'name',
            title: 'Müşteri Adı',
            sortable: true,
            render: (value, row) => (
                <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                                {row.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{row.name}</div>
                        {row.email && <div className="text-sm text-gray-500">{row.email}</div>}
                    </div>
                </div>
            ),
            width: 250
        },
        {
            key: 'sector',
            title: 'Sektör',
            sortable: true,
            render: (value) => value || '-',
            width: 120
        },
        {
            key: 'country',
            title: 'Ülke/Şehir',
            render: (value, row) => {
                const location = [row.country, row.city].filter(Boolean).join(', ');
                return location || '-';
            },
            width: 150
        },
        {
            key: 'phone',
            title: 'Telefon',
            render: (value) => value || '-',
            width: 140
        },
        {
            key: 'status',
            title: 'Durum',
            sortable: true,
            render: (value) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${value === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {value === 'active' ? 'Aktif' : 'Pasif'}
                </span>
            ),
            width: 100,
            align: 'center' as const
        },
        {
            key: 'tags',
            title: 'Etiketler',
            render: (value: string[]) => (
                <div className="flex flex-wrap gap-1">
                    {(value || []).slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {tag}
                        </span>
                    ))}
                    {(value || []).length > 2 && (
                        <span className="text-xs text-gray-500">+{(value || []).length - 2}</span>
                    )}
                </div>
            ),
            width: 150
        },
        {
            key: 'updatedAt',
            title: 'Son Güncelleme',
            sortable: true,
            render: (value) => {
                const date = new Date(value);
                return date.toLocaleDateString('tr-TR');
            },
            width: 120,
            align: 'center' as const
        }
    ];

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <div className="px-6 lg:px-10 py-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xl font-semibold text-slate-900">Müşteriler</div>
                        <div className="text-sm text-slate-500">
                            {viewMode === 'grid' ? 'Kart görünümünde grid liste' : 'Tablo görünümünde liste'}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* View Mode Toggle */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'grid'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <GridView className="h-4 w-4" />
                                Kart
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'table'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <TableChart className="h-4 w-4" />
                                Tablo
                            </button>
                        </div>
                        <div className="hidden md:flex items-center gap-3 text-sm text-slate-600">
                            <div className="rounded-xl border bg-white shadow-sm px-3 py-2">Toplam: {total}</div>
                        </div>
                    </div>
                </div>

                <div className="sticky top-4 z-10">
                    <CustomerFilters
                        q={q} sector={sector} tag={tag} status={status} sort={sort}
                        onChange={patch}
                        onClear={onClear}
                    />
                </div>

                {viewMode === 'grid' ? (
                    <>
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
                    </>
                ) : (
                    <DataGrid
                        data={items}
                        columns={columns}
                        loading={loading}
                        selectable={true}
                        selectedRows={selectedCustomers}
                        onSelectionChange={setSelectedCustomers}
                        onRowClick={(customer) => navigate(`/customers/${customer.id}`)}
                        onSort={(key, direction) => {
                            patch({ sort: `${key}_${direction}` });
                        }}
                        pagination={{
                            page,
                            pageSize,
                            total,
                            onPageChange: (newPage) => patch({ page: String(newPage) }),
                            onPageSizeChange: (newSize) => patch({ pageSize: String(newSize) })
                        }}
                        emptyMessage="Henüz müşteri eklenmemiş"
                        rowKey="id"
                    />
                )}
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
