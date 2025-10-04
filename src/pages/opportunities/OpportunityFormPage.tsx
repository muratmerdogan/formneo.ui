import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Chip from "@mui/material/Chip";
import getConfiguration from "confiuration";
import { OpportunitiesApi, OpportunityInsertDto, OpportunityUpdateDto, UserApi, LookupApi, LookupItemDto } from "api/generated/api";
import CustomerSelectDialog from "components/customers/CustomerSelectDialog";

export default function OpportunityFormPage(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id && id !== "new");

  const api = useMemo(() => new OpportunitiesApi(getConfiguration()), []);
  const userApi = useMemo(() => new UserApi(getConfiguration()), []);
  const lookupApi = useMemo(() => new LookupApi(getConfiguration()), []);

  const [openCustomerDlg, setOpenCustomerDlg] = useState(false);
  const [stageItems, setStageItems] = useState<LookupItemDto[]>([]);
  const STAGE_COLOR: Record<string, { color: string; fg: string }> = {
    ADAY: { color: "#0284c7", fg: "#ffffff" },
    DEGERLENDIRME: { color: "#0f766e", fg: "#ffffff" },
    TEKLIF: { color: "#b45309", fg: "#ffffff" },
    MUZAKERE: { color: "#7c3aed", fg: "#ffffff" },
    KAZANILDI: { color: "#16a34a", fg: "#ffffff" },
    KAYBEDILDI: { color: "#dc2626", fg: "#ffffff" },
  };
  const [form, setForm] = useState({
    customerId: "",
    customerName: "",
    title: "",
    stage: 0 as number,
    amount: undefined as number | undefined,
    currency: "TRY",
    probability: 50 as number,
    expectedCloseDate: "",
    source: "",
    ownerUserId: "",
    description: "",
  });

  useEffect(() => {
    const init = async () => {
      // ownerUserId default olarak login kullanıcısı
      try {
        const me: any = await userApi.apiUserGetLoginUserDetailGet();
        const ownerId = String(me?.data?.id || me?.data?.userId || "");
        setForm((f) => ({ ...f, ownerUserId: ownerId }));
      } catch {}

      // lookup aşamalarını yükle
      try {
        const res: any = await lookupApi.apiLookupItemsKeyGet("OPPORTUNITY_STAGE");
        const items = ((res?.data as any[]) || [])
          .filter((x: any) => x?.isActive !== false)
          .sort((a: any, b: any) => (Number(a?.orderNo || 0) - Number(b?.orderNo || 0)));
        setStageItems(items);
      } catch {}

      if (isEdit && id) {
        try {
          const res: any = await api.apiCrmOpportunitiesIdGet(String(id));
          const dto = res?.data ?? {};
          setForm({
            customerId: String(dto?.customerId ?? ""),
            customerName: String(dto?.customerName ?? dto?.customer?.name ?? ""),
            title: String(dto?.title ?? ""),
            stage: Number(dto?.stage ?? 0),
            amount: dto?.amount ?? undefined,
            currency: dto?.currency ?? "TRY",
            probability: Number(dto?.probability ?? 50),
            expectedCloseDate: dto?.expectedCloseDate ?? "",
            source: dto?.source ?? "",
            ownerUserId: String(dto?.ownerUserId ?? ""),
            description: dto?.description ?? "",
          });
        } catch {}
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const changeStageByCode = async (code: string, index: number) => {
    setForm((f) => ({ ...f, stage: index }));
    if (!isEdit || !id) return;
    try {
      // Varsayım: backend aşama endpoint'i numeric stage kabul ediyor → index kullan
      await api.apiCrmOpportunitiesIdStagePost(String(id), index);
      // Eğer won/lost ayrı endpoint gerektiriyorsa code'a göre çağır
      if (code === "KAZANILDI") await api.apiCrmOpportunitiesIdWonPost(String(id));
      if (code === "KAYBEDILDI") await api.apiCrmOpportunitiesIdLostPost(String(id));
    } catch {}
  };

  const handleSave = async () => {
    if (!form.customerId || !form.title) return;
    if (isEdit && id) {
      const dto: OpportunityUpdateDto = {
        id: String(id),
        customerId: form.customerId,
        title: form.title,
        stage: form.stage,
        amount: form.amount ?? null,
        currency: form.currency ?? null,
        probability: form.probability ?? null,
        expectedCloseDate: form.expectedCloseDate || null,
        source: form.source || null,
        ownerUserId: form.ownerUserId,
        description: form.description || null,
      };
      await api.apiCrmOpportunitiesIdPut(String(id), dto);
    } else {
      const dto: OpportunityInsertDto = {
        customerId: form.customerId,
        title: form.title,
        stage: form.stage,
        amount: form.amount ?? null,
        currency: form.currency ?? null,
        probability: form.probability ?? null,
        expectedCloseDate: form.expectedCloseDate || null,
        source: form.source || null,
        ownerUserId: form.ownerUserId,
        description: form.description || null,
      };
      await api.apiCrmOpportunitiesPost(dto);
    }
    navigate("/opportunities");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box className="px-6 lg:px-10 py-6">
        <Paper className="p-4">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Stepper activeStep={form.stage} alternativeLabel>
                {stageItems.map((s, idx) => {
                  const code = String(s?.code || "");
                  const label = String(s?.name || code);
                  const palette = STAGE_COLOR[code] || { color: "#64748b", fg: "#ffffff" };
                  const isActive = form.stage === idx;
                  return (
                    <Step key={s.id || code || idx} onClick={() => changeStageByCode(code, idx)} style={{ cursor: "pointer" }}>
                    <StepLabel>
                        <Chip
                          label={label.toUpperCase()}
                          size="medium"
                          variant={isActive ? "filled" : "outlined"}
                          sx={{
                            bgcolor: isActive ? palette.color : "transparent",
                            color: isActive ? palette.fg : palette.color,
                            borderColor: palette.color,
                            fontWeight: isActive ? 800 : 700,
                            letterSpacing: 0.3,
                            '& .MuiChip-label': { px: 1.25, py: 0.25 },
                          }}
                        />
                    </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Müşteri"
                value={form.customerName}
                InputProps={{ readOnly: true }}
                onClick={() => setOpenCustomerDlg(true)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Başlık"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Aşama"
                value={String(stageItems[form.stage]?.name || "")}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Tutar"
                value={form.amount ?? ""}
                onChange={(e) => setForm({ ...form, amount: e.target.value === "" ? undefined : Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Para Birimi"
                value={form.currency ?? ""}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Olasılık (%)"
                value={form.probability}
                onChange={(e) => setForm({ ...form, probability: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Beklenen Kapanış"
                InputLabelProps={{ shrink: true }}
                value={form.expectedCloseDate}
                onChange={(e) => setForm({ ...form, expectedCloseDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Kaynak"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Açıklama"
                multiline
                minRows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={1}>
              <Button variant="outlined" onClick={() => navigate(-1)}>İptal</Button>
              <Button variant="contained" onClick={handleSave}>{isEdit ? "Güncelle" : "Kaydet"}</Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      <Footer />

      <CustomerSelectDialog
        open={openCustomerDlg}
        onClose={() => setOpenCustomerDlg(false)}
        onSelect={(c) => {
          setForm({ ...form, customerId: c.id, customerName: c.name });
          setOpenCustomerDlg(false);
        }}
      />
    </DashboardLayout>
  );
}


