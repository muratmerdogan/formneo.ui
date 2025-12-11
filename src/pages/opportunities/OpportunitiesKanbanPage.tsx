import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";
import { DndContext, DragEndEvent, PointerSensor, useDroppable, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import getConfiguration from "confiuration";
import { LookupApi, LookupItemDto, OpportunitiesApi } from "api/generated/api";

type OpportunityKanbanItem = {
  id: string; // dnd-kit expects string id
  title: string;
  customerName: string;
  amount: number | null;
  currency: string | null;
  stageIndex: number;
  stageCode: string; // Kanban key (column id)
  probability?: number;
  tags?: string[];
  ownerInitials?: string;
};

type Column = {
  id: string; // stage code
  title: string; // stage display name
  items: OpportunityKanbanItem[];
};

const STAGE_THEME: Record<string, { bg: string; fg: string; border: string }> = {
  ADAY: { bg: "#e0f2fe", fg: "#0c4a6e", border: "#38bdf8" }, // light sky
  DEGERLENDIRME: { bg: "#dcfce7", fg: "#065f46", border: "#34d399" }, // green
  TEKLIF: { bg: "#fef3c7", fg: "#92400e", border: "#fbbf24" }, // amber
  MUZAKERE: { bg: "#ede9fe", fg: "#4c1d95", border: "#a78bfa" }, // violet
  KAZANILDI: { bg: "#d1fae5", fg: "#065f46", border: "#34d399" }, // emerald
  KAYBEDILDI: { bg: "#fee2e2", fg: "#991b1b", border: "#f87171" }, // red
};

function ColumnContainer({ column }: { column: Column }) {
  const count = column.items.length;
  const theme = STAGE_THEME[String(column.id).toUpperCase()] || { bg: "#f1f5f9", fg: "#0f172a", border: "#e2e8f0" };
  const { setNodeRef } = useDroppable({ id: column.id });
  return (
    <MDBox
      sx={{
        width: 340,
        minWidth: 340,
        backgroundColor: "#f8fafc",
        border: `2px solid ${theme.border}20`,
        borderRadius: "12px",
        mr: 2,
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 280px)",
      }}
    >
      <MDBox
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.2,
          borderBottom: `1px solid ${theme.border}40`,
          position: "sticky",
          top: 0,
          background: theme.bg,
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          zIndex: 1,
        }}
      >
        <MDBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MDBox sx={{ width: 8, height: 8, borderRadius: "50%", background: theme.border }} />
          <MDTypography variant="button" fontWeight="bold" sx={{ color: theme.fg }}>
            {column.title}
          </MDTypography>
        </MDBox>
        <MDBox
          sx={{
            background: `${theme.border}30`,
            color: theme.fg,
            fontSize: 12,
            fontWeight: 700,
            borderRadius: "999px",
            px: 1,
            minWidth: 28,
            textAlign: "center",
          }}
        >
          {count}
        </MDBox>
      </MDBox>
      <MDBox ref={setNodeRef} sx={{ p: 2, overflowY: "auto" }}>
        <SortableContext items={column.items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {column.items.map((item) => (
            <SortableCard key={item.id} item={item} />
          ))}
        </SortableContext>
      </MDBox>
    </MDBox>
  );
}

function SortableCard({ item }: { item: OpportunityKanbanItem }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "12px",
    marginBottom: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.03)",
    cursor: "grab",
  } as React.CSSProperties;
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <MDBox sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <MDTypography variant="button" fontWeight="medium" sx={{ color: "#0f172a" }}>
          {item.title}
        </MDTypography>
        {typeof item.probability === "number" && (
          <MDBox sx={{
            background: "#eef2ff",
            color: "#3730a3",
            fontSize: 12,
            fontWeight: 700,
            borderRadius: "999px",
            px: 1,
          }}>
            %{item.probability}
          </MDBox>
        )}
      </MDBox>

      <MDBox sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <MDBox sx={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "#e2e8f0",
          color: "#334155",
          fontSize: 12,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {(item.ownerInitials || item.customerName?.charAt(0) || "").toUpperCase()}
        </MDBox>
        <MDTypography variant="caption" sx={{ color: "#475569" }}>{item.customerName}</MDTypography>
      </MDBox>

      <MDBox sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <MDTypography variant="caption" sx={{ color: "#64748b" }}>
          {item.amount != null ? `${item.amount} ${item.currency ?? ""}` : ""}
        </MDTypography>
        <MDBox sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {(item.tags || []).slice(0, 3).map((t, i) => (
            <MDBox key={i} sx={{ background: "#f1f5f9", color: "#334155", border: "1px solid #e5e7eb", borderRadius: "999px", px: 1, fontSize: 10, fontWeight: 600 }}>{t}</MDBox>
          ))}
        </MDBox>
      </MDBox>
    </div>
  );
}

function OpportunitiesKanbanPage(): JSX.Element {
  const api = useMemo(() => new OpportunitiesApi(getConfiguration()), []);
  const lookupApi = useMemo(() => new LookupApi(getConfiguration()), []);
  const navigate = useNavigate();
  const [stageItems, setStageItems] = useState<LookupItemDto[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchStages = useCallback(async (): Promise<LookupItemDto[]> => {
    try {
      const res: any = await lookupApi.apiLookupItemsKeyGet("OPPORTUNITY_STAGE");
      const list = ((res?.data as any[]) || [])
        .filter((x: any) => x?.isActive !== false)
        .sort(
          (a: any, b: any) => Number(a?.orderNo || 0) - Number(b?.orderNo || 0)
        );
      if (!Array.isArray(list) || list.length === 0) {
        const defaults: LookupItemDto[] = [
          { id: "s1", code: "ADAY", name: "Aday", orderNo: 0, isActive: true },
          { id: "s2", code: "DEGERLENDIRME", name: "Değerlendirme", orderNo: 1, isActive: true },
          { id: "s3", code: "TEKLIF", name: "Teklif", orderNo: 2, isActive: true },
          { id: "s4", code: "MUZAKERE", name: "Müzakere", orderNo: 3, isActive: true },
          { id: "s5", code: "KAZANILDI", name: "Kazanıldı", orderNo: 4, isActive: true },
          { id: "s6", code: "KAYBEDILDI", name: "Kaybedildi", orderNo: 5, isActive: true },
        ];
        setStageItems(defaults);
        return defaults;
      }
      setStageItems(list);
      return list;
    } catch {
      const defaults: LookupItemDto[] = [
        { id: "s1", code: "ADAY", name: "Aday", orderNo: 0, isActive: true },
        { id: "s2", code: "DEGERLENDIRME", name: "Değerlendirme", orderNo: 1, isActive: true },
        { id: "s3", code: "TEKLIF", name: "Teklif", orderNo: 2, isActive: true },
        { id: "s4", code: "MUZAKERE", name: "Müzakere", orderNo: 3, isActive: true },
        { id: "s5", code: "KAZANILDI", name: "Kazanıldı", orderNo: 4, isActive: true },
        { id: "s6", code: "KAYBEDILDI", name: "Kaybedildi", orderNo: 5, isActive: true },
      ];
      setStageItems(defaults);
      return defaults;
    }
  }, [lookupApi]);

  const fetchOpportunities = useCallback(
    async (stages: LookupItemDto[]) => {
      setLoading(true);
      try {
        const res: any = await api.apiCrmOpportunitiesPagedGet(1, 200, undefined);
        const list: any[] = res?.data?.items ?? res?.data?.list ?? [];
        const codes: string[] = stages.map((s: any) => String(s?.code ?? s?.name ?? ""));
        const emptyCols: Record<string, Column> = {};
        stages.forEach((s: any, i: number) => {
          const code = codes[i] ?? String(i);
          emptyCols[code] = { id: code, title: String(s?.name ?? s?.code ?? ""), items: [] };
        });
        const mapped: OpportunityKanbanItem[] = list.map((dto: any) => {
          const idx: number = Number(dto?.stage ?? 0);
          const code: string = codes[idx] ?? String(idx);
          return {
            id: String(dto?.id ?? ""),
            title: String(dto?.title ?? ""),
            customerName: String(dto?.customerName ?? dto?.customer?.name ?? ""),
            amount: dto?.amount ?? null,
            currency: dto?.currency ?? null,
            stageIndex: idx,
            stageCode: code,
            probability: typeof dto?.probability === "number" ? Number(dto.probability) : undefined,
            tags: Array.isArray(dto?.tags) ? dto.tags : undefined,
          } as OpportunityKanbanItem;
        });
        mapped.forEach((it) => {
          if (!emptyCols[it.stageCode]) {
            emptyCols[it.stageCode] = { id: it.stageCode, title: it.stageCode, items: [] };
          }
          emptyCols[it.stageCode].items.push(it);
        });
        const nextColumns = Object.values(emptyCols);
        const totalItems = mapped.length;
        // API item sayısı 0 ise demo görünümü koru
        setColumns((prev) => (totalItems > 0 ? nextColumns : prev));
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  useEffect(() => {
    (async () => {
      const stages = await fetchStages();
      // Mock demo veriler (tasarım önizlemesi için); gerçek veri yüklendikten sonra üzerine yazılır
      const codes: string[] = stages.map((s: any) => String(s?.code ?? s?.name ?? ""));
      const demoCols: Record<string, Column> = {};
      stages.forEach((s: any, i: number) => {
        const code = codes[i] ?? String(i);
        demoCols[code] = { id: code, title: String(s?.name ?? s?.code ?? ""), items: [] };
      });
      const demoItems: OpportunityKanbanItem[] = [
        { id: "d1", title: "ERP Entegrasyonu", customerName: "Formneo Yazılım", amount: 450000, currency: "TRY", stageIndex: 0, stageCode: codes[0] || "ADAY", probability: 40, tags: ["ERP", "Demo"], ownerInitials: "VY" },
        { id: "d2", title: "SF Modül Lisansı", customerName: "Acme AŞ", amount: 12000, currency: "USD", stageIndex: 2, stageCode: codes[2] || "TEKLIF", probability: 60, tags: ["Lisans"], ownerInitials: "AA" },
        { id: "d3", title: "Mobil Uygulama", customerName: "Globex", amount: 180000, currency: "TRY", stageIndex: 1, stageCode: codes[1] || "DEGERLENDIRME", probability: 35, tags: ["Mobil", "React"], ownerInitials: "GL" },
        { id: "d4", title: "Destek Paketi", customerName: "Initech", amount: 3000, currency: "USD", stageIndex: 3, stageCode: codes[3] || "MUZAKERE", probability: 75, tags: ["Destek"], ownerInitials: "IT" },
      ];
      demoItems.forEach((it) => { if (!demoCols[it.stageCode]) demoCols[it.stageCode] = { id: it.stageCode, title: it.stageCode, items: [] }; demoCols[it.stageCode].items.push(it); });
      setColumns(Object.values(demoCols));

      await fetchOpportunities(stages);
    })();
  }, [fetchStages, fetchOpportunities]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;
      const activeId = String(active.id);
      const overId = String((over as any).id);

      // overId kart mı kolon mu? Biz kolonların SortableContext id’si olarak column.id kullanacağız
      // Kart drop hedefini bulmak için DOM hiyerarşisinde en yakın kolon id’sini taşıyoruz: burada pratik basit yöntem: over.id kolon id’si ya da kart id’si olabilir.
      const isDroppingOnCard = columns.some((c) => c.items.some((i) => i.id === overId));
      const targetColumnId = isDroppingOnCard
        ? columns.find((c) => c.items.some((i) => i.id === overId))?.id
        : overId;
      if (!targetColumnId) return;

      // Kaynak kolon ve item’i bul
      const sourceColumn = columns.find((c) => c.items.some((i) => i.id === activeId));
      if (!sourceColumn) return;
      const item = sourceColumn.items.find((i) => i.id === activeId)!;
      if (!item) return;

      if (sourceColumn.id === targetColumnId) return; // Aynı kolon; sıralama şimdilik atlanıyor

      // Optimistic UI: kolonları lokalde güncelle
      const nextColumns = columns.map((c) => ({ ...c, items: [...c.items] }));
      const src = nextColumns.find((c) => c.id === sourceColumn.id)!;
      const dst = nextColumns.find((c) => c.id === targetColumnId)!;
      src.items = src.items.filter((i) => i.id !== activeId);
      dst.items = [{ ...item, stageCode: targetColumnId }, ...dst.items];
      setColumns(nextColumns);

      // Backend stage güncelle
      const index = stageItems.findIndex(
        (x: any) => String(x?.code ?? x?.name ?? "") === String(targetColumnId)
      );
      const safeIndex = index >= 0 ? index : Number(targetColumnId) || 0;
      try {
        await api.apiCrmOpportunitiesIdStagePost(String(item.id), safeIndex);
        if (String(targetColumnId).toUpperCase() === "KAZANILDI") {
          await api.apiCrmOpportunitiesIdWonPost(String(item.id));
        }
        if (String(targetColumnId).toUpperCase() === "KAYBEDILDI") {
          await api.apiCrmOpportunitiesIdLostPost(String(item.id));
        }
      } catch {
        // Hata → sunucudan yenile
        const stages = await fetchStages();
        await fetchOpportunities(stages);
      }
    },
    [columns, api, stageItems, fetchStages, fetchOpportunities]
  );

  return (
    <DashboardLayout>
      <MDBox p={3}>
        <MDBox sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <MDTypography variant="h3" fontWeight="bold">
            Fırsatlar Kanban
          </MDTypography>
          <MDButton variant="gradient" color="info" onClick={() => navigate("/opportunities/new")}>+ Yeni Fırsat</MDButton>
        </MDBox>

        {loading && (
          <MDBox sx={{ color: "#64748b", fontSize: 14 }}>Yükleniyor...</MDBox>
        )}

        {!loading && columns.length === 0 && (
          <MDBox
            sx={{
              color: "#64748b",
              fontSize: 14,
              border: "1px dashed #e2e8f0",
              borderRadius: "10px",
              padding: 2,
            }}
          >
            Kolon ya da fırsat verisi bulunamadı. Lütfen aşamaların tanımlı olduğundan emin olun.
          </MDBox>
        )}

        {columns.length > 0 && (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <MDBox
              sx={{
                display: "flex",
                overflowX: "auto",
                minHeight: 320,
                p: 1,
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
              }}
            >
              <SortableContext items={columns.map((c) => c.id)} strategy={rectSortingStrategy}>
                {columns.map((col) => (
                  <ColumnContainer key={col.id} column={col} />
                ))}
              </SortableContext>
            </MDBox>
          </DndContext>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default OpportunitiesKanbanPage;


