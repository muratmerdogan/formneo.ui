import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { OpportunitiesApi } from "api/generated/api";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import getConfiguration from "confiuration";
import { useRegisterActions } from "context/ActionBarContext";
import AddIcon from "@mui/icons-material/Add";
import { GridView, TableChart } from "@mui/icons-material";
import DataGrid, { ColumnDef } from "../../components/ui/DataGrid";
import OpportunityFilters from "../../components/opportunities/OpportunityFilters";
import MuiOpportunityGrid from "../../components/opportunities/MuiOpportunityGrid";
import { STAGE_LABELS } from "../../utils/opportunityFormUtils";
import { currency } from "../../lib/format";

export default function OpportunitiesPage(): JSX.Element {
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();
    const [all, setAll] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
    const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([]);

    const q = params.get("q") ?? "";
    const stage = params.get("stage") ?? "";
    const source = params.get("source") ?? "";
    const ownerId = params.get("ownerId") ?? "";
    const sort = params.get("sort") ?? "recent";
    const page = Number(params.get("page") ?? 1);
    const pageSize = Number(params.get("pageSize") ?? 20);
    const totalFromUrl = Number(params.get("total") ?? 0);

    const patch = (patch: Record<string, string>) => {
        const next = new URLSearchParams(params);
        Object.entries(patch).forEach(([k, v]) => v === "" ? next.delete(k) : next.set(k, v));
        if (!patch.page) next.set("page", "1");
        setParams(next, { replace: true });
    };

    // Action Bar: Yeni fırsat oluştur
    useRegisterActions([
        {
            id: "new-opportunity",
            label: "Yeni Fırsat",
            icon: <AddIcon fontSize="small" />,
            onClick: () => navigate("/opportunities/new"),
        },
        {
            id: "view-mode",
            label: viewMode === 'grid' ? "Tablo Görünümü" : "Kart Görünümü",
            icon: viewMode === 'grid' ? <TableChart fontSize="small" /> : <GridView fontSize="small" />,
            onClick: () => setViewMode(viewMode === 'grid' ? 'table' : 'grid'),
        },
    ], [navigate, viewMode]);

    // Filtrelenmiş ve sıralanmış veriler
    const filtered = useMemo(() => {
        let result = [...all];
        
        if (q) {
            result = result.filter(item => 
                item.title?.toLowerCase().includes(q.toLowerCase()) ||
                item.customerName?.toLowerCase().includes(q.toLowerCase()) ||
                item.description?.toLowerCase().includes(q.toLowerCase())
            );
        }
        
        if (stage) {
            result = result.filter(item => item.stage?.toString() === stage);
        }
        
        if (source) {
            result = result.filter(item => item.source === source);
        }
        
        if (ownerId) {
            result = result.filter(item => item.ownerUserId === ownerId);
        }

        // Sıralama
        switch (sort) {
            case "amount":
                result.sort((a, b) => (b.amount || 0) - (a.amount || 0));
                break;
            case "probability":
                result.sort((a, b) => (b.probability || 0) - (a.probability || 0));
                break;
            case "title":
                result.sort((a, b) => (a.title || "").localeCompare(b.title || "", "tr"));
                break;
            case "recent":
            default:
                result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
                break;
        }
        
        return result;
    }, [all, q, stage, source, ownerId, sort]);

    // Sayfalama
    const total = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = filtered.slice(startIndex, endIndex);

    // Veri yükleme
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const api = new OpportunitiesApi(getConfiguration());
                const response = await api.apiCrmOpportunitiesGet();
                setAll(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Fırsatlar yüklenirken hata:", error);
                setAll([]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // DataGrid kolonları
    const columns: ColumnDef<any>[] = [
        {
            key: "title",
            title: "Başlık",
            render: (value, row) => (
                <div 
                    className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
                    onClick={() => navigate(`/opportunities/${row.id}`)}
                >
                    {row.title}
                </div>
            ),
        },
        {
            key: "customerName",
            title: "Müşteri",
            render: (value, row) => row.customerName || "-",
        },
        {
            key: "stage",
            title: "Aşama",
            render: (value, row) => {
                const stageNum = row.stage;
                const stageLabel = STAGE_LABELS[stageNum as keyof typeof STAGE_LABELS] || "Bilinmiyor";
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stageNum === 5 ? 'bg-green-100 text-green-800' :
                        stageNum === 6 ? 'bg-red-100 text-red-800' :
                        stageNum === 4 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                        {stageLabel}
                    </span>
                );
            },
        },
        {
            key: "amount",
            title: "Tutar",
            render: (value, row) => {
                const amount = row.amount;
                const currencyCode = row.currency || "TRY";
                return amount ? currency(amount) : "-";
            },
        },
        {
            key: "probability",
            title: "Olasılık",
            render: (value, row) => {
                const prob = row.probability;
                return prob ? `%${prob}` : "-";
            },
        },
        {
            key: "expectedCloseDate",
            title: "Beklenen Kapanış",
            render: (value, row) => {
                const date = row.expectedCloseDate;
                return date ? new Date(date).toLocaleDateString("tr-TR") : "-";
            },
        },
        {
            key: "ownerName",
            title: "Sahibi",
            render: (value, row) => row.ownerName || "-",
        },
    ];

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Fırsatlar</h1>
                        <p className="text-gray-600 mt-1">
                            Toplam {total} fırsat
                            {selectedOpportunities.length > 0 && `, ${selectedOpportunities.length} seçili`}
                        </p>
                    </div>
                </div>

                <OpportunityFilters
                    q={q}
                    stage={stage}
                    source={source}
                    ownerId={ownerId}
                    sort={sort}
                    onFilter={patch}
                />

                {viewMode === 'table' ? (
                    <DataGrid
                        data={items}
                        columns={columns}
                        loading={loading}
                        pagination={{
                            page,
                            pageSize,
                            total,
                            onPageChange: (newPage) => patch({ page: String(newPage) }),
                            onPageSizeChange: (newPageSize) => patch({ 
                                pageSize: String(newPageSize), 
                                page: "1" 
                            }),
                        }}
                        selectable={true}
                        selectedRows={selectedOpportunities}
                        onSelectionChange={setSelectedOpportunities}
                    />
                ) : (
                    <MuiOpportunityGrid
                        opportunities={items}
                        loading={loading}
                        onOpportunityClick={(id: string) => navigate(`/opportunities/${id}`)}
                    />
                )}
            </div>
            <Footer />
        </DashboardLayout>
    );
}
