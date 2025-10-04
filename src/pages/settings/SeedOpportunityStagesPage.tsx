import React, { useMemo, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Box, Button, Paper, Typography } from "@mui/material";
import getConfiguration from "confiuration";
import { LookupApi, LookupCategoryDto, LookupItemDto } from "api/generated";

export default function SeedOpportunityStagesPage(): JSX.Element {
  const api = useMemo(() => new LookupApi(getConfiguration()), []);
  const [log, setLog] = useState<string>("");
  const [busy, setBusy] = useState<boolean>(false);

  const append = (t: string) => setLog((s) => s + t + "\n");

  const ensureCategory = async (): Promise<string> => {
    const KEY = "OPPORTUNITY_STAGE";
    append("Kategori kontrol ediliyor: " + KEY);
    const cats: any = await api.apiLookupCategoriesGet();
    const exist = (cats?.data || []).find((c: any) => (c?.key || "").toLowerCase() === KEY.toLowerCase());
    if (exist?.id) {
      append("Kategori mevcut: " + exist.id);
      return String(exist.id);
    }
    append("Kategori yok, oluşturuluyor...");
    const created: any = await api.apiLookupCategoriesPost({ key: KEY, description: "CRM Fırsat Aşamaları", isTenantScoped: true } as LookupCategoryDto);
    const id = String(created?.data?.id || "");
    append("Kategori oluşturuldu: " + id);
    return id;
  };

  const seedItems = async (categoryId: string) => {
    const items: LookupItemDto[] = [
      { code: "ADAY", name: "Aday", orderNo: 1, isActive: true, categoryId },
      { code: "DEGERLENDIRME", name: "Değerlendirme", orderNo: 2, isActive: true, categoryId },
      { code: "TEKLIF", name: "Teklif", orderNo: 3, isActive: true, categoryId },
      { code: "MUZAKERE", name: "Müzakere", orderNo: 4, isActive: true, categoryId },
      { code: "KAZANILDI", name: "Kazanıldı", orderNo: 5, isActive: true, categoryId },
      { code: "KAYBEDILDI", name: "Kaybedildi", orderNo: 6, isActive: true, categoryId },
    ];
    for (const it of items) {
      append(`Öğe ekleniyor: ${it.code} - ${it.name}`);
      try {
        await api.apiLookupItemsPost(it);
      } catch (e: any) {
        append("Hata veya mevcut olabilir: " + (e?.message || String(e)));
      }
    }
    append("Seed tamamlandı.");
  };

  const run = async () => {
    if (busy) return;
    setBusy(true);
    setLog("");
    try {
      const catId = await ensureCategory();
      await seedItems(catId);
    } finally {
      setBusy(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box className="px-6 lg:px-10 py-6">
        <Paper className="p-4">
          <Typography variant="h6" gutterBottom>Fırsat Aşamaları Seed</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            OPPORTUNITY_STAGE kategorisini ve aşama öğelerini oluşturur. Çalıştırdıktan sonra bu sayfayı silebilirsiniz.
          </Typography>
          <Button variant="contained" onClick={run} disabled={busy}>{busy ? "Çalışıyor..." : "Seed Çalıştır"}</Button>
          <pre style={{ marginTop: 12, background: "#0b1020", color: "#e2e8f0", padding: 12, borderRadius: 8, maxHeight: 360, overflow: "auto" }}>{log}</pre>
        </Paper>
      </Box>
      <Footer />
    </DashboardLayout>
  );
}


