import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// İlk aşama: Boş bir Gantt Chart alanı ve açıklama
const GanttChartTab: React.FC = () => {
  return (
    <MDBox p={3}>
      {/* Gantt Chart burada gösterilecek */}
      <MDTypography variant="h5" mb={2}>Gantt Chart</MDTypography>
      <MDTypography variant="body2" color="text">
        Bu alanda projenizin zaman çizelgesini (Gantt Chart) görüntüleyebilirsiniz. Sonraki adımda grafik ve veri eklenecek.
      </MDTypography>
      {/* TODO: Gantt Chart bileşeni burada entegre edilecek */}
    </MDBox>
  );
};

export default GanttChartTab;
