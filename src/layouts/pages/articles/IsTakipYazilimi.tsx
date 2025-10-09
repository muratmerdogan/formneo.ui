import { useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function IsTakipYazilimi(): JSX.Element {
  useEffect(() => {
    document.title = "İş Takip Yazılımı Nedir? Avantajları ve Seçim Rehberi | FormNeo";
  }, []);

  return (
    <MDBox py={8}>
      <Container maxWidth="md">
        <MDBox mb={4}>
          <MDTypography variant="h2" fontWeight="bold" gutterBottom>
            İş Takip Yazılımı Nedir? Avantajları ve Seçim Rehberi
          </MDTypography>
          <MDTypography variant="subtitle1" color="text">
            İşlerinizi planlamak, sorumluluk atamak, ilerlemeyi izlemek ve raporlamak için modern çözümler.
          </MDTypography>
        </MDBox>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MDTypography variant="h5" fontWeight="bold" gutterBottom>
              Neden İş Takip Yazılımı?
            </MDTypography>
            <MDTypography variant="body1" color="text" paragraph>
              Takımların görünürlük, hız ve kaliteyi artırması için iş takip yazılımları kritik rol oynar.
              Görev atama, son teslim tarihi, bildirimler ve panolar ile süreçler şeffaflaşır.
            </MDTypography>
          </Grid>

          <Grid item xs={12}>
            <MDTypography variant="h5" fontWeight="bold" gutterBottom>
              Temel Özellikler
            </MDTypography>
            <ul>
              <li>
                <MDTypography variant="body1" color="text">
                  Görev yönetimi, alt görevler ve kontrol listeleri
                </MDTypography>
              </li>
              <li>
                <MDTypography variant="body1" color="text">
                  Kanban/Timeline görünümleri ve durum akışları
                </MDTypography>
              </li>
              <li>
                <MDTypography variant="body1" color="text">
                  Bildirimler, SLA, hatırlatıcılar
                </MDTypography>
              </li>
              <li>
                <MDTypography variant="body1" color="text">
                  Raporlama ve performans göstergeleri
                </MDTypography>
              </li>
              <li>
                <MDTypography variant="body1" color="text">
                  Entegrasyonlar (e-posta, takvim, üçüncü parti uygulamalar)
                </MDTypography>
              </li>
            </ul>
          </Grid>

          <Grid item xs={12}>
            <MDTypography variant="h5" fontWeight="bold" gutterBottom>
              FormNeo ile Fark Yaratın
            </MDTypography>
            <MDTypography variant="body1" color="text" paragraph>
              FormNeo, sürükle-bırak form oluşturucu, onay akışları, bildirim altyapısı ve
              kapsamlı raporlarla iş takibini tek platformda sunar. Mobil ve web üzerinden
              kolay kullanım sağlar.
            </MDTypography>
          </Grid>

          <Grid item xs={12}>
            <MDTypography variant="h6" fontWeight="bold" gutterBottom>
              İlgili anahtar kelimeler
            </MDTypography>
            <MDTypography variant="body2" color="text">
              iş takip yazılımı, görev yönetimi, proje takibi, kanban, iş akışı, bildirim, raporlama
            </MDTypography>
          </Grid>
        </Grid>
      </Container>
    </MDBox>
  );
}


