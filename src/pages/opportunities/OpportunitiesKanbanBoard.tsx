import React, { useCallback, useEffect, useMemo, useState } from "react";
import Board from "@asseinfo/react-kanban";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import getConfiguration from "confiuration";
import { LookupApi, LookupItemDto, OpportunitiesApi, OpportunityInsertDto, UserApi } from "api/generated/api";
import CustomerSelectDialog from "components/customers/CustomerSelectDialog";

type Card = {
  id: string;
  title: string;
  description?: string;
  customerName?: string;
  amount?: number | null;
  currency?: string | null;
  probability?: number | null;
  tags?: string[];
  ownerInitials?: string;
};
type Column = { id: string; title: string; cards: Card[] };
type BoardModel = { columns: Column[] };

export default function OpportunitiesKanbanBoard(): JSX.Element {
  const api = useMemo(() => new OpportunitiesApi(getConfiguration()), []);
  const lookupApi = useMemo(() => new LookupApi(getConfiguration()), []);
  const navigate = useNavigate();

  const [board, setBoard] = useState<BoardModel>({ columns: [] });
  const [stageItems, setStageItems] = useState<LookupItemDto[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [addColumnId, setAddColumnId] = useState<string>("");
  const [form, setForm] = useState<{ title: string; customerId?: string; customerName: string; amount?: string; currency?: string; probability?: string; tags?: string }>({ title: "", customerName: "", amount: "", currency: "TRY", probability: "50", tags: "" });
  const [openCustomerDlg, setOpenCustomerDlg] = useState(false);

  const openAddDialog = (columnId: string) => {
    setAddColumnId(columnId);
    setForm({ title: "", customerName: "", amount: "", currency: "TRY", probability: "50", tags: "" });
    setAddOpen(true);
  };
  const closeAddDialog = () => setAddOpen(false);
  const submitAddDialog = async () => {
    if (!form.title.trim()) return;
    // Önce lokal ekle
    setBoard((prev) => {
      const cols = prev.columns.map((c) => ({ ...c, cards: [...c.cards] }));
      const idx = cols.findIndex((c) => String(c.id) === String(addColumnId));
      if (idx >= 0) {
        cols[idx].cards.unshift({
          id: `local-${Date.now()}`,
          title: form.title.trim(),
          customerName: form.customerName.trim() || undefined,
          amount: form.amount ? Number(form.amount) : null,
          currency: form.currency || undefined,
          probability: form.probability ? Number(form.probability) : null,
          tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
        });
      }
      return { columns: cols };
    });
    // İsteğe bağlı: API ile kaydet (owner ve customer zorunlu)
    try {
      if (form.customerId) {
        const userApi = new UserApi(getConfiguration());
        let ownerId = "";
        try {
          const me: any = await userApi.apiUserGetLoginUserDetailGet();
          ownerId = String(me?.data?.id || me?.data?.userId || "");
        } catch {}
        const stages = stageItems;
        const codes = stages.map((s: any) => String(s?.code ?? s?.name ?? ""));
        const stageIndex = Math.max(0, codes.indexOf(String(addColumnId)));
        const dto: OpportunityInsertDto = {
          customerId: form.customerId,
          title: form.title.trim(),
          ownerUserId: ownerId,
          stage: stageIndex >= 0 ? stageIndex : 0,
          amount: form.amount ? Number(form.amount) : null,
          currency: form.currency || null,
          probability: form.probability ? Number(form.probability) : null,
          source: null,
          expectedCloseDate: null,
          description: null,
        };
        await api.apiCrmOpportunitiesPost(dto);
        await fetchBoard(stageItems);
      }
    } finally {
      setAddOpen(false);
    }
  };

  const moveCardLocal = (b: BoardModel, source: any, destination: any): BoardModel => {
    if (!source || !destination) return b;
    const fromColId = String(source.fromColumnId);
    const toColId = String(destination.toColumnId);
    const fromPos = Number(source.fromPosition ?? 0);
    const toPosRaw = Number(destination.toPosition ?? 0);
    const cols = b.columns.map((c) => ({ ...c, cards: [...c.cards] }));
    const fromIdx = cols.findIndex((c) => String(c.id) === fromColId);
    const toIdx = cols.findIndex((c) => String(c.id) === toColId);
    if (fromIdx < 0 || toIdx < 0) return b;
    if (!Array.isArray(cols[fromIdx].cards) || cols[fromIdx].cards.length <= fromPos) return b;
    const [moved] = cols[fromIdx].cards.splice(fromPos, 1);
    const toPos = Math.max(0, Math.min(toPosRaw, cols[toIdx].cards.length));
    cols[toIdx].cards.splice(toPos, 0, moved);
    return { columns: cols };
  };

  const fetchStages = useCallback(async () => {
    try {
      const res: any = await lookupApi.apiLookupItemsKeyGet("OPPORTUNITY_STAGE");
      const list = ((res?.data as any[]) || [])
        .filter((x: any) => x?.isActive !== false)
        .sort((a: any, b: any) => Number(a?.orderNo || 0) - Number(b?.orderNo || 0));
      const defaults: LookupItemDto[] = list?.length
        ? list
        : [
            { id: "s1", code: "ADAY", name: "Aday", orderNo: 0, isActive: true },
            { id: "s2", code: "DEGERLENDIRME", name: "Değerlendirme", orderNo: 1, isActive: true },
            { id: "s3", code: "TEKLIF", name: "Teklif", orderNo: 2, isActive: true },
            { id: "s4", code: "MUZAKERE", name: "Müzakere", orderNo: 3, isActive: true },
            { id: "s5", code: "KAZANILDI", name: "Kazanıldı", orderNo: 4, isActive: true },
            { id: "s6", code: "KAYBEDILDI", name: "Kaybedildi", orderNo: 5, isActive: true },
          ];
      setStageItems(defaults);
      return defaults;
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

  const fetchBoard = useCallback(async (stages: LookupItemDto[]) => {
    const codes = stages.map((s: any) => String(s?.code ?? s?.name ?? ""));
    const cols: Column[] = stages.map((s: any, i: number) => ({
      id: codes[i] ?? String(i),
      title: String(s?.name ?? s?.code ?? ""),
      cards: [] as Card[],
    }));
    try {
      const res: any = await api.apiCrmOpportunitiesPagedGet(1, 200, undefined);
      const list: any[] = res?.data?.items ?? res?.data?.list ?? [];
      list.forEach((dto: any) => {
        const idx = Number(dto?.stage ?? 0);
        const colId = codes[idx] ?? String(idx);
        const col = cols.find((c) => c.id === colId);
        if (col) {
          col.cards.push({
            id: String(dto?.id ?? ""),
            title: String(dto?.title ?? ""),
            customerName: String(dto?.customerName ?? dto?.customer?.name ?? ""),
            amount: dto?.amount ?? null,
            currency: dto?.currency ?? null,
            probability: typeof dto?.probability === "number" ? Number(dto?.probability) : null,
            tags: Array.isArray(dto?.tags) ? dto?.tags : undefined,
          });
        }
      });
    } finally {
      setBoard({ columns: cols });
    }
  }, [api]);

  useEffect(() => {
    (async () => {
      const stages = await fetchStages();
      await fetchBoard(stages);
    })();
  }, [fetchStages, fetchBoard]);

  const onCardDragEnd = async (_card: any, source: any, destination: any) => {
    if (!destination) return;
    // Sadece lokal state güncelle
    setBoard((prev) => moveCardLocal(prev as any, source, destination) as any);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        <MDBox sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <MDTypography variant="h3" fontWeight="bold">Fırsatlar Kanban</MDTypography>
          <MDButton variant="gradient" color="info" onClick={() => navigate("/opportunities/new")}>
            + Yeni Fırsat
          </MDButton>
        </MDBox>

        <Board
          renderColumnHeader={(column: any) => (
            <div
              style={{
                padding: 12,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: "#94a3b8" }} />
                {column.title}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  background: "#e2e8f0",
                  color: "#334155",
                  fontSize: 12,
                  fontWeight: 800,
                  borderRadius: 999,
                  padding: "2px 8px"
                }}>{column.cards?.length || 0}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); openAddDialog(String(column.id)); }}
                  style={{
                    border: "1px solid #94a3b8",
                    background: "#ffffff",
                    color: "#0f172a",
                    borderRadius: 8,
                    padding: "2px 8px",
                    fontWeight: 800,
                    cursor: "pointer"
                  }}
                  title="Yeni kart"
                >
                  +
                </button>
              </span>
            </div>
          )}
          renderCard={(card: Card, { dragging }: any) => (
            <div style={{
              background: "#ffffff",
              border: "2px solid #e5e7eb",
              borderRadius: 12,
              padding: 14,
              marginBottom: 10,
              boxShadow: dragging ? "0 8px 20px rgba(2,6,23,.15)" : "0 2px 6px rgba(2,6,23,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontWeight: 700, color: "#0f172a" }}>{card.title}</div>
                {typeof card.probability === "number" && (
                  <span style={{ background: "#eef2ff", color: "#3730a3", fontSize: 12, fontWeight: 800, borderRadius: 999, padding: "2px 6px" }}>
                    %{card.probability}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#e2e8f0", color: "#334155", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {(card.ownerInitials || card.customerName?.charAt(0) || "").toUpperCase()}
                </div>
                <div style={{ fontSize: 12, color: "#475569" }}>{card.customerName}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 12, color: "#0f766e", background: "#d1fae5", border: "1px solid #99f6e4", padding: "2px 6px", borderRadius: 8 }}>{card.amount != null ? `${card.amount} ${card.currency ?? ""}` : ""}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {(card.tags || []).slice(0, 3).map((t, i) => (
                    <span key={i} style={{ background: "#f1f5f9", color: "#334155", border: "1px solid #e5e7eb", borderRadius: 999, padding: "2px 6px", fontSize: 10, fontWeight: 700 }}>#{t}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
          onCardDragEnd={onCardDragEnd}
        >
          {board}
        </Board>

        <Dialog open={addOpen} onClose={closeAddDialog} fullWidth maxWidth="sm">
          <DialogTitle>Yeni Fırsat</DialogTitle>
          <DialogContent>
            <MDBox sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 1 }}>
              <TextField label="Başlık" fullWidth value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <TextField label="Müşteri" fullWidth value={form.customerName} onClick={() => setOpenCustomerDlg(true)} placeholder="Müşteri seçmek için tıklayın" />
              <TextField label="Tutar" fullWidth value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              <TextField label="Para Birimi" fullWidth value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
              <TextField label="Olasılık %" fullWidth value={form.probability} onChange={(e) => setForm({ ...form, probability: e.target.value })} />
              <TextField label="Etiketler (virgülle)" fullWidth value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </MDBox>
          </DialogContent>
          <DialogActions>
            <MDButton variant="outlined" color="secondary" onClick={closeAddDialog}>Vazgeç</MDButton>
            <MDButton variant="gradient" color="info" onClick={submitAddDialog}>Ekle</MDButton>
          </DialogActions>
        </Dialog>
        <CustomerSelectDialog
          open={openCustomerDlg}
          onClose={() => setOpenCustomerDlg(false)}
          onSelect={(c: any) => { setForm({ ...form, customerId: c.id, customerName: c.name }); setOpenCustomerDlg(false); }}
        />
      </MDBox>
    </DashboardLayout>
  );
}


