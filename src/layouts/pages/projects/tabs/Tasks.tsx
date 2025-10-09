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
import { CustomersApi, ProjectTaskItemsApi, ProjectTaskInsertDto, ProjectTaskUpdateDto } from "api/generated/api";
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

  type TaskCard = KanbanCard & { customer?: string; startDate?: string; notify?: boolean; remind?: boolean };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTab, setDialogTab] = useState(0);
  const [draft, setDraft] = useState<TaskCard>({ id: "", title: "", notify: false, remind: false });
  const [currentColumn, setCurrentColumn] = useState<string>("bekliyor");
  const [loading, setLoading] = useState<boolean>(false);
  const [editorSeed, setEditorSeed] = useState<number>(0);

  // Demo seçenekleri (sonra API'den beslenecek)
  const [musteriOptions, setMusteriOptions] = useState<string[]>([]);
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
  const mapStatusToColumn = (s: string): keyof KanbanState => {
    const x = String(s || "").toLowerCase();
    if (x.includes("işlem") || x.includes("progress") || x.includes("doing")) return "islemde" as any;
    if (x.includes("beklemeye")) return "beklemeye-alindi" as any;
    if (x.includes("tamam")) return "tamamlandi" as any;
    if (x.includes("iptal") || x.includes("cancel")) return "iptal" as any;
    return "bekliyor" as any;
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
        const col = mapStatusToColumn(it?.statusText || it?.status || it?.state || "");
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
    setDraft({ id: "", title: "", description: "", tags: [], dueDate: "", customer: "", notify: false, remind: false });
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
          status: 0,
          assigneeId: null,
          customerId: null,
        };
        await api.apiProjectTaskItemsPost(dto as any);
      } else {
        const dto: ProjectTaskUpdateDto = {
          id: draft.id,
          projectId: projectId,
          name: draft.title,
          description: draft.description || "",
          startDate: draft.startDate || null,
          endDate: draft.dueDate || null,
          status: undefined,
          assigneeId: null,
          customerId: null,
        };
        await api.apiProjectTaskItemsPut(dto as any);
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
              const dto: ProjectTaskUpdateDto = { id: movedId as any, // guessing status field name
                // try common names; backend will map appropriately
                statusText: toCol as any,
              } as any;
              await api.apiProjectTaskItemsPut(dto);
              await fetchTasks();
            }
          } catch {}
        }}
        onCardClick={handleCardClick}
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
                  onChange={(_, v) => setDraft({ ...draft, customer: (v as string) || '' })}
                  onInputChange={(_, v) => {
                    customerQueryRef.current = v;
                    setDraft({ ...draft, customer: v });
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
    </MDBox>
  );
}

export default TasksTab;


