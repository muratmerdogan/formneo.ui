import React, { useEffect, useMemo, useRef, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import FormneoKanban, { KanbanColumn, KanbanState, KanbanCard } from "components/kanban/FormneoKanban";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import MDEditor from "components/MDEditor";
import getConfiguration from "confiuration";
import { CustomersApi, ProjectTaskItemsApi, ProjectTaskInsertDto, ProjectTaskUpdateDto, ProjectTaskStatusUpdateDto } from "api/generated/api";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import parse from "html-react-parser";
import IconButton from "@mui/material/IconButton";
import { format } from "date-fns";
import { tr as localeTR } from "date-fns/locale";
import { useParams } from "react-router-dom";

function TasksTab(): JSX.Element {
  const { id: projectId } = useParams<{ id: string }>();
  const toDateOnly = (s?: string | null) => (s ? String(s).split("T")[0] : "");
  const columns: KanbanColumn[] = useMemo(() => [
    { id: "bekliyor", title: "Bekliyor", icon: <Icon>radio_button_unchecked</Icon> },
    { id: "islemde", title: "İşlemde", icon: <Icon>motion_photos_on</Icon> },
    { id: "beklemeye-alindi", title: "Beklemeye Alındı", icon: <Icon>pause_circle</Icon> },
    { id: "tamamlandi", title: "Tamamlandı", icon: <Icon>check_circle</Icon> },
    { id: "iptal", title: "İptal Edildi", icon: <Icon>cancel</Icon> },
  ], []);

  const [state, setState] = useState<KanbanState>({
    bekliyor: [],
    islemde: [],
    "beklemeye-alindi": [],
    tamamlandi: [],
    iptal: [],
  });

  type TaskCard = KanbanCard & { customerId?: string | null; customer?: string; startDate?: string; notify?: boolean; remind?: boolean };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTab, setDialogTab] = useState(0);
  const [draft, setDraft] = useState<TaskCard>({ id: "", title: "", notify: false, remind: false });
  const [currentColumn, setCurrentColumn] = useState<string>("bekliyor");
  const [loading, setLoading] = useState<boolean>(false);
  const [editorSeed, setEditorSeed] = useState<number>(0);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [historyRows, setHistoryRows] = useState<any[]>([]);
  const [historyTaskId, setHistoryTaskId] = useState<string>("");

  // Demo seçenekleri (sonra API'den beslenecek)
  const [musteriOptions, setMusteriOptions] = useState<string[]>([]);
  const [customerNameToId, setCustomerNameToId] = useState<Record<string, string>>({});
  const [musteriLoading, setMusteriLoading] = useState(false);
  const customerQueryRef = useRef<string>("");
  const debounceRef = useRef<any>();
  const fetchCustomers = async (q: string) => {
    try {
      setMusteriLoading(true);
      const api = new CustomersApi(getConfiguration());
      // reuse paged endpoint as search: page=1, size=10, includeActiveOnly=true, search=q
      // @ts-ignore
      const res: any = await api.apiCustomersPagedGet(1, 10, true, q || undefined);
      const items: any[] = (res as any)?.data?.items || (res as any)?.data || [];
      const names: string[] = Array.from(new Set(
        items.map((it: any) => String(it.name || it.customerName || it.title || it.displayName || "")).filter(Boolean)
      ));
      const map: Record<string, string> = {};
      for (const it of items) {
        const nm = String(it.name || it.customerName || it.title || it.displayName || "");
        const id = String(it.id || it.customerId || it.uid || "");
        if (nm && id && !map[nm]) map[nm] = id;
      }
      setCustomerNameToId(map);
      setMusteriOptions(names);
    } catch {
      setMusteriOptions([]);
    } finally {
      setMusteriLoading(false);
    }
  };
  useEffect(() => { fetchCustomers(""); }, []);
  const kisiOptions = ["Ali Veli", "Ayşe", "Mehmet", "Zeynep", "Murat"];
  const etiketOptions = ["UI", "Backend", "Öncelik:Yüksek", "Bugün", "Özellik", "Refactor"];

  const renderStringOption = (props: any, option: string) => (
    <li {...props} key={option} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Avatar sx={{ width: 24, height: 24, bgcolor: '#e2e8f0', color: '#111827', fontSize: 12 }}>{option.charAt(0).toUpperCase()}</Avatar>
      <span>{option}</span>
    </li>
  );

  // using shared MDEditor across app for consistent behavior

  // Backend integration: load tasks
  // Enum mapping (ProjectTaskStatus)
  // 0: Bekliyor, 1: Islemde, 2: BeklemeyeAlindi, 3: Tamamlandi, 4: IptalEdildi
  const enumCodeToColumn = (code: number): keyof KanbanState => {
    switch (Number(code)) {
      case 1: return "islemde";
      case 2: return "beklemeye-alindi";
      case 3: return "tamamlandi";
      case 4: return "iptal";
      case 0:
      default: return "bekliyor";
    }
  };

  const mapStatusToColumn = (s: string | number): keyof KanbanState => {
    if (typeof s === 'number' || /^\d+$/.test(String(s))) {
      return enumCodeToColumn(Number(s));
    }
    const x = String(s || "").toLowerCase();
    if (x.includes("işlem") || x.includes("progress") || x.includes("doing")) return "islemde" as any;
    if (x.includes("beklemeye")) return "beklemeye-alindi" as any;
    if (x.includes("tamam")) return "tamamlandi" as any;
    if (x.includes("iptal") || x.includes("cancel")) return "iptal" as any;
    return "bekliyor" as any;
  };

  const columnToEnumCode = (col: string): number => {
    switch (col) {
      case "islemde": return 1;
      case "beklemeye-alindi": return 2;
      case "tamamlandi": return 3;
      case "iptal": return 4;
      case "bekliyor":
      default: return 0;
    }
  };

  const fetchTasks = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const api = new ProjectTaskItemsApi(getConfiguration());
      const res: any = await api.apiProjectTaskItemsByProjectProjectIdGet(projectId);
      const items: any[] = (res as any)?.data || [];
      const next: KanbanState = { bekliyor: [], islemde: [], "beklemeye-alindi": [], tamamlandi: [], iptal: [] } as any;
      for (const it of items) {
        // Prefer numeric status if provided; fallback to text
        const col = mapStatusToColumn(
          (it?.statusCode ?? it?.status ?? it?.stateCode) as any || (it?.statusText || it?.status || it?.state || "")
        );
        next[col].push({
          id: String(it?.id || it?.taskId || it?.uid || Math.random()),
          title: String(it?.title || it?.name || "(Başlıksız)"),
          description: it?.description || "",
          dueDate: toDateOnly(it?.endDate || it?.dueDate || null),
          tags: Array.isArray(it?.tags) ? it.tags : [],
        });
      }
      setState(next);
    } catch (e) {
      // silently ignore for now
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [projectId]);

  const handleAdd = (columnId: string) => {
    setCurrentColumn(columnId);
    setDraft({ id: "", title: "", description: "", tags: [], dueDate: "", customerId: null, customer: "", notify: false, remind: false });
    setDialogTab(0);
    setDialogOpen(true);
    setEditorSeed((s) => s + 1);
  };

  const handleCardClick = async (card: KanbanCard, columnId: string) => {
    setCurrentColumn(columnId);
    setDialogTab(0);
    setDialogOpen(true);
    try {
      setLoading(true);
      const api = new ProjectTaskItemsApi(getConfiguration());
      const res: any = await api.apiProjectTaskItemsIdGet(String(card.id));
      const item: any = (res && (res.data ?? res)) || {};
      const latest: TaskCard = {
        id: String(item.id || item.taskId || card.id),
        title: String(item.title || item.name || card.title || ""),
        description: item.description ?? card.description ?? "",
        startDate: toDateOnly(item.startDate || null),
        dueDate: toDateOnly(item.endDate || item.dueDate || null),
        tags: Array.isArray(item.tags) ? item.tags : (card.tags || []),
        customerId: (item.customerId as any) || null,
        customer: item.customerName || item.customer || (card as any).customer || "",
        notify: Boolean(item.notify ?? (card as any).notify ?? false),
        remind: Boolean(item.remind ?? (card as any).remind ?? false),
      };
      setDraft(latest);
      setEditorSeed((s) => s + 1);
    } catch {
      setDraft(card as TaskCard);
      setEditorSeed((s) => s + 1);
    } finally {
      setLoading(false);
    }
  };

  const openHistory = async (taskId: string) => {
    try {
      setHistoryTaskId(taskId);
      setHistoryLoading(true);
      const api = new ProjectTaskItemsApi(getConfiguration());
      const res: any = await api.apiProjectTaskItemsIdHistoryGet(taskId);
      const rows: any[] = Array.isArray(res?.data) ? res.data : (res?.data?.items || []);
      setHistoryRows(rows || []);
      setHistoryOpen(true);
    } catch (e) {
      setHistoryRows([]);
      setHistoryOpen(true);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const api = new ProjectTaskItemsApi(getConfiguration());
      if (!draft.id) {
        const dto: ProjectTaskInsertDto = {
          projectId: projectId,
          name: draft.title,
          description: draft.description || "",
          startDate: draft.startDate || null,
          endDate: draft.dueDate || null,
          status: columnToEnumCode(currentColumn),
          assigneeId: null,
          customerId: (draft.customerId as any) || (customerNameToId[draft.customer || ""] as any) || null,
        };
        const payload: any = { ...dto, customerName: draft.customer || undefined };
        await api.apiProjectTaskItemsPost(payload);
      } else {
        const dto: ProjectTaskUpdateDto = {
          id: draft.id,
          projectId: projectId,
          name: draft.title,
          description: draft.description || "",
          startDate: draft.startDate || null,
          endDate: draft.dueDate || null,
          status: columnToEnumCode(currentColumn),
          assigneeId: null,
          customerId: (draft.customerId as any) || (customerNameToId[draft.customer || ""] as any) || null,
        };
        const payload: any = { ...dto, customerName: draft.customer || undefined };
        await api.apiProjectTaskItemsPut(payload);
      }
      await fetchTasks();
      setDialogOpen(false);
    } catch (e) {
      setDialogOpen(false);
    }
  };

  return (
    <MDBox>
      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}><MDTypography variant="button">Toplam: {Object.values(state).reduce((n, a) => n + a.length, 0)}</MDTypography></Grid>
        <Grid item xs={12} md={3}><MDTypography variant="button">Bugün: {Object.values(state).flat().filter(c => c.dueDate === "Bugün").length}</MDTypography></Grid>
        <Grid item xs={12} md={3}><MDTypography variant="button">Bekliyor: {state.bekliyor.length}</MDTypography></Grid>
        <Grid item xs={12} md={3}><MDTypography variant="button">İşlemde: {state.islemde.length}</MDTypography></Grid>
      </Grid>

      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
        <Button variant="contained" color="primary" startIcon={<Icon>add</Icon>} onClick={() => handleAdd('bekliyor')} sx={{ color: '#fff', fontWeight: 600 }}>
          Yeni Görev
        </Button>
      </Stack>

      <FormneoKanban
        columns={columns}
        itemsByColumn={state}
        onChange={async (next) => {
          // detect moved card and update backend
          try {
            const prev = state;
            setState(next);
            let movedId: string | null = null;
            let toCol: string | null = null;
            const prevIndex: Record<string, string> = {};
            Object.entries(prev).forEach(([col, arr]) => arr.forEach((c) => prevIndex[c.id] = col));
            const nextIndex: Record<string, string> = {};
            Object.entries(next).forEach(([col, arr]) => arr.forEach((c) => nextIndex[c.id] = col));
            for (const cid of Object.keys(nextIndex)) {
              if (prevIndex[cid] && prevIndex[cid] !== nextIndex[cid]) { movedId = cid; toCol = nextIndex[cid]; break; }
            }
            if (movedId && toCol && projectId) {
              const api = new ProjectTaskItemsApi(getConfiguration());
              const dto: ProjectTaskStatusUpdateDto = {
                id: movedId as any,
                status: columnToEnumCode(toCol),
              } as any;
              await api.apiProjectTaskItemsStatusPatch(dto);
              await fetchTasks();
            }
          } catch {}
        }}
        onCardClick={handleCardClick}
        renderCard={(card) => (
          <Card sx={{ mb: 1, boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }}>
            <CardContent sx={{ p: 1.25 }}>
              <MDTypography variant="button" sx={{ fontWeight: 600, display: 'block' }}>{card.title}</MDTypography>
              {!!card.description && (
                <MDBox sx={{ mt: 0.5, color: 'text.secondary', fontSize: 12, lineHeight: 1.35,
                  '& p': { m: 0 }, '& ul': { pl: 2, m: 0 }, '& ol': { pl: 2, m: 0 }, '& a': { color: 'primary.main' } }}>
                  {parse(String(card.description))}
                </MDBox>
              )}
              <MDBox mt={1} display="flex" justifyContent="flex-end">
                <IconButton size="small" aria-label="Geçmiş" onClick={(e) => { e.stopPropagation(); openHistory(String(card.id)); }}>
                  <Icon fontSize="small">more_vert</Icon>
                </IconButton>
              </MDBox>
            </CardContent>
          </Card>
        )}
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
        {/* Header */}
        <MDBox px={2} py={1.5} display="flex" alignItems="center" justifyContent="space-between" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Icon color="primary">task_alt</Icon>
            <MDTypography variant="h6">Görev</MDTypography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button size="small" onClick={() => setDialogOpen(false)}>Kapat</Button>
            <Button size="small" variant="contained" onClick={handleSave}>Kaydet</Button>
          </Stack>
        </MDBox>
        <Tabs value={dialogTab} onChange={(_, v) => setDialogTab(v)}>
          <Tab label="Detay" />
          <Tab label="Dosyalar" />
          <Tab label="Zamanlama" />
        </Tabs>
        <MDBox p={2}>
          {dialogTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  label="Ad *"
                  size="small"
                  fullWidth
                  required
                  error={!draft.title || draft.title.trim().length < 3}
                  helperText={!draft.title || draft.title.trim().length < 3 ? "En az 3 karakter" : ""}
                  value={draft.title}
                  onChange={e => setDraft({ ...draft, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Autocomplete
                  size="small"
                  disablePortal
                  autoHighlight
                  options={musteriOptions}
                  freeSolo
                  ListboxProps={{ style: { maxHeight: 280 } }}
                  isOptionEqualToValue={(o, v) => o === v}
                  renderOption={(props, option) => renderStringOption(props, option)}
                  value={draft.customer || ''}
                  inputValue={draft.customer || ''}
                  loading={musteriLoading}
                  onChange={(_, v) => setDraft({ ...draft, customer: (v as string) || '', customerId: v ? (customerNameToId[String(v)] || null) : null })}
                  onInputChange={(_, v) => {
                    customerQueryRef.current = v;
                    setDraft({ ...draft, customer: v, customerId: v ? (customerNameToId[String(v)] || draft.customerId || null) : null });
                    if (debounceRef.current) clearTimeout(debounceRef.current);
                    debounceRef.current = setTimeout(() => fetchCustomers(customerQueryRef.current), 300);
                  }}
                  renderInput={(params) => <TextField {...params} label="Müşteri" placeholder="Müşteri Seçin.." />}
                />
              </Grid>
              <Grid item xs={12}>
                <MDTypography variant="caption" sx={{ mb: 0.5, display: 'block' }}>Açıklama</MDTypography>
                <MDEditor
                  key={editorSeed}
                  value={(html: string) => setDraft({ ...draft, description: html })}
                  initialHtml={String(draft.description || '')}
                  placeholder="Açıklama yazın..."
                  editorStyle={{ minHeight: 160 }}
                />
              </Grid>

              <Grid item xs={12} md={4}><TextField label="Başlangıç Tarihi" size="small" type="date" InputLabelProps={{ shrink: true }} fullWidth value={draft.startDate || ''} onChange={e => setDraft({ ...draft, startDate: e.target.value })} /></Grid>
              <Grid item xs={12} md={4}><TextField label="Bitiş Tarihi" size="small" type="date" InputLabelProps={{ shrink: true }} fullWidth value={draft.dueDate || ''} onChange={e => setDraft({ ...draft, dueDate: e.target.value })} /></Grid>
              <Grid item xs={12} md={4}>
                <Autocomplete
                  multiple
                  size="small"
                  disablePortal
                  autoHighlight
                  freeSolo
                  options={etiketOptions}
                  ListboxProps={{ style: { maxHeight: 280 } }}
                  isOptionEqualToValue={(o, v) => o === v}
                  renderOption={(props, option) => renderStringOption(props, option)}
                  limitTags={2}
                  renderTags={(value, getTagProps) => (
                    <>
                      {value.slice(0, 2).map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                      ))}
                      {value.length > 2 && (
                        <Chip size="small" label={`+${value.length - 2}`} />
                      )}
                    </>
                  )}
                  value={draft.tags || []}
                  onChange={(_, v) => setDraft({ ...draft, tags: v as string[] })}
                  renderInput={(p) => <TextField {...p} label="Etiketler" placeholder="Etiket ekle" />}
                />
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <FormControlLabel control={<Switch checked={!!draft.remind} onChange={(e) => setDraft({ ...draft, remind: e.target.checked })} />} label="Hatırlatma" />
                  <FormControlLabel control={<Switch checked={!!draft.notify} onChange={(e) => setDraft({ ...draft, notify: e.target.checked })} />} label="Bilgilendirme" />
                </Stack>
              </Grid>

              {/* İlgili kişiler/sahip alanları MVP'de kaldırıldı */}
            </Grid>
          )}
          {dialogTab === 1 && (
            <>
              <MDTypography variant="body2" color="text" sx={{ mb: 1 }}>Dosyalar</MDTypography>
              <Divider sx={{ mb: 2 }} />
              <Button variant="outlined" component="label" startIcon={<Icon>upload</Icon>}>
                Dosya Yükle
                <input type="file" hidden multiple />
              </Button>
              <MDTypography variant="caption" color="text" sx={{ display: 'block', mt: 1 }}>Sürükle-bırak desteklenebilir (sonra eklenir).</MDTypography>
            </>
          )}
          {dialogTab === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}><TextField label="Tekrarlama" placeholder="Örn: Haftalık / Her Pazartesi" fullWidth /></Grid>
              <Grid item xs={12} md={6}><TextField label="Hatırlatma" placeholder="Örn: 1 gün önce" fullWidth /></Grid>
              <Grid item xs={12} md={6}><TextField label="Başlangıç Saati" type="time" InputLabelProps={{ shrink: true }} fullWidth /></Grid>
              <Grid item xs={12} md={6}><TextField label="Bitiş Saati" type="time" InputLabelProps={{ shrink: true }} fullWidth /></Grid>
            </Grid>
          )}
          <MDBox display="flex" justifyContent="flex-end" gap={1} mt={2}>
            <Button onClick={() => setDialogOpen(false)}>İptal</Button>
            <Button variant="contained" onClick={handleSave}>Kaydet</Button>
          </MDBox>
        </MDBox>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} fullWidth maxWidth="sm">
        <MDBox px={2} py={1.5} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <MDTypography variant="h6">Görev Geçmişi</MDTypography>
        </MDBox>
        <MDBox p={2} sx={{ maxHeight: 420, overflow: 'auto' }}>
          {historyLoading ? (
            <MDTypography variant="body2">Yükleniyor…</MDTypography>
          ) : (
            <>
              {(!historyRows || historyRows.length === 0) && (
                <MDTypography variant="body2" color="text">Kayıt bulunamadı.</MDTypography>
              )}
              {Array.isArray(historyRows) && historyRows.map((h: any, idx: number) => {
                const rawDate = h?.createDate;
                const formatted = rawDate ? (() => { try { return format(new Date(rawDate), 'dd.MM.yyyy HH:mm', { locale: localeTR }); } catch { return String(rawDate); } })() : '';
                const summary = h?.summary || h?.title || h?.name || '';
                const statusText = h?.statusText || h?.statusName || (h?.status !== undefined ? `Durum: ${h?.status}` : '');
                const actor = h?.changedBy || h?.createdBy || '';
                return (
                  <MDBox key={idx} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1.5, mb: 1 }}>
                    {!!summary && (
                      <MDTypography variant="button" sx={{ display: 'block', mb: 0.25 }}>{summary}</MDTypography>
                    )}
                    {!!statusText && (
                      <MDTypography variant="caption" color="text" sx={{ display: 'block', mb: 0.25 }}>{statusText}</MDTypography>
                    )}
                    <MDBox display="flex" justifyContent="space-between" alignItems="center">
                      <MDTypography variant="caption" color="text">{formatted}</MDTypography>
                      {!!actor && <MDTypography variant="caption" color="text">{actor}</MDTypography>}
                    </MDBox>
                    {!!h?.description && (
                      <MDTypography variant="caption" color="text" sx={{ display: 'block', mt: 0.5 }}>{h?.description}</MDTypography>
                    )}
                  </MDBox>
                );
              })}
            </>
          )}
        </MDBox>
        <MDBox px={2} py={1.5} display="flex" justifyContent="flex-end" sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setHistoryOpen(false)}>Kapat</Button>
        </MDBox>
      </Dialog>
    </MDBox>
  );
}

export default TasksTab;


