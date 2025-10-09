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
import "react-quill/dist/quill.snow.css";
import getConfiguration from "confiuration";
import { CustomersApi } from "api/generated/api";

function TasksTab(): JSX.Element {
  const columns: KanbanColumn[] = useMemo(() => [
    { id: "bekliyor", title: "Bekliyor", icon: <Icon>radio_button_unchecked</Icon> },
    { id: "islemde", title: "İşlemde", icon: <Icon>motion_photos_on</Icon> },
    { id: "beklemeye-alindi", title: "Beklemeye Alındı", icon: <Icon>pause_circle</Icon> },
    { id: "tamamlandi", title: "Tamamlandı", icon: <Icon>check_circle</Icon> },
    { id: "iptal", title: "İptal Edildi", icon: <Icon>cancel</Icon> },
  ], []);

  const [state, setState] = useState<KanbanState>({
    bekliyor: [
      { id: "t1", title: "UI tasarımını güncelle", tags: ["UI", "Öncelik:Yüksek"], dueDate: "Cuma" },
      { id: "t2", title: "API kontratını revize et", tags: ["Backend"], dueDate: "Pzt" },
    ],
    islemde: [
      { id: "t3", title: "Takvim entegrasyonu", tags: ["Özellik"], dueDate: "Bugün" },
    ],
    "beklemeye-alindi": [],
    tamamlandi: [
      { id: "t4", title: "Kanban POC", tags: ["POC"] },
    ],
    iptal: [],
  });

  type TaskCard = KanbanCard & { customer?: string; startDate?: string; notify?: boolean; remind?: boolean };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTab, setDialogTab] = useState(0);
  const [draft, setDraft] = useState<TaskCard>({ id: "", title: "", notify: false, remind: false });
  const [currentColumn, setCurrentColumn] = useState<string>("bekliyor");

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

  // ReactQuill wrapper to handle default/named export interop
  const QuillEditor = (props: any) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const RQ = require("react-quill");
    const Editor = RQ?.default || RQ;
    if (!Editor) return null;
    return <Editor {...props} />;
  };

  const handleAdd = (columnId: string) => {
    setCurrentColumn(columnId);
    setDraft({ id: "", title: "", description: "", tags: [], dueDate: "", customer: "", notify: false, remind: false });
    setDialogTab(0);
    setDialogOpen(true);
  };

  const handleCardClick = (card: KanbanCard, columnId: string) => {
    setCurrentColumn(columnId);
    setDraft(card as TaskCard);
    setDialogTab(0);
    setDialogOpen(true);
  };

  const handleSave = () => {
    const next: KanbanState = JSON.parse(JSON.stringify(state));
    // create or update
    if (!draft.id) {
      const newId = `t${Math.random().toString(36).slice(2, 7)}`;
      next[currentColumn].unshift({ id: newId, title: draft.title, description: draft.description, dueDate: draft.dueDate, tags: draft.tags });
    } else {
      // update in its column
      const idx = next[currentColumn].findIndex((c) => c.id === draft.id);
      if (idx >= 0) next[currentColumn][idx] = { id: draft.id, title: draft.title, description: draft.description, dueDate: draft.dueDate, tags: draft.tags };
    }
    setState(next);
    setDialogOpen(false);
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

      <FormneoKanban
        columns={columns}
        itemsByColumn={state}
        onChange={setState}
        onCardClick={handleCardClick}
        onAddCard={handleAdd}
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
                <QuillEditor
                  theme="snow"
                  value={draft.description || ''}
                  onChange={(v: any) => setDraft({ ...draft, description: v })}
                  modules={{
                    toolbar: [["bold", "italic", "underline"], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ["link"]],
                    keyboard: {
                      bindings: {
                        linebreak: {
                          key: 13,
                          handler(this: any, range: any) {
                            const q = this.quill;
                            const r = q.getSelection(true);
                            q.insertText(r.index, "\n", 'user');
                            q.setSelection(r.index + 1, 'silent');
                            return false;
                          }
                        }
                      }
                    }
                  }}
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


