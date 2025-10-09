import { useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function ProjeYonetimiYazilimi(): JSX.Element {
  useEffect(() => {
    document.title = "Proje Yönetimi Yazılımı: Seçim Kriterleri ve En İyi Uygulamalar | FormNeo";
  }, []);

  return (
    <MDBox py={8}>
      <Container maxWidth="md">
        <MDBox mb={4}>
          <MDTypography variant="h2" fontWeight="bold" gutterBottom>
            Proje Yönetimi Yazılımı: Seçim Kriterleri ve En İyi Uygulamalar
          </MDTypography>
          <MDTypography variant="subtitle1" color="text">
            Kapsam, zaman ve maliyet üçgeninde şeffaflık ve verimlilik için doğru araçlar.
          </MDTypography>
        </MDBox>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MDTypography variant="h5" fontWeight="bold" gutterBottom>
              Seçim Kriterleri
            </MDTypography>
            <ul>
              <li>
                <MDTypography variant="body1" color="text">Planlama ve kaynak yönetimi</MDTypography>
              </li>
              <li>
                <MDTypography variant="body1" color="text">Risk ve değişiklik yönetimi</MDTypography>
              </li>
              <li>
                <MDTypography variant="body1" color="text">İş birliği, iletişim, dokümantasyon</MDTypography>
              </li>
              <li>
                <MDTypography variant="body1" color="text">Raporlama, KPI ve portföy görünürlüğü</MDTypography>
              </li>
              <li>
                <MDTypography variant="body1" color="text">Ölçeklenebilirlik, güvenlik ve entegrasyonlar</MDTypography>
              </li>
            </ul>
          </Grid>

          <Grid item xs={12}>
            <MDTypography variant="h5" fontWeight="bold" gutterBottom>
              FormNeo ile Proje Yönetişimi
            </MDTypography>
            <MDTypography variant="body1" color="text" paragraph>
              FormNeo, görev ve akış otomasyonu, rol bazlı yetkilendirme ve raporlama ile
              proje yaşam döngüsünü baştan sona yönetmenizi sağlar. Gantt ve kanban görünümleri
              ile ekipler tek bir gerçeklik kaynağında hizalanır.
            </MDTypography>
          </Grid>

          <Grid item xs={12}>
            <MDTypography variant="h6" fontWeight="bold" gutterBottom>
              İlgili anahtar kelimeler
            </MDTypography>
            <MDTypography variant="body2" color="text">
              proje yönetimi yazılımı, proje yönetişimi, PMO, kaynak yönetimi, gantt, kanban, risk yönetimi
            </MDTypography>
          </Grid>
        </Grid>
      </Container>
    </MDBox>
  );
}


