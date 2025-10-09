import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function ReportsTab(): JSX.Element {
  return (
    <MDBox>
      <MDTypography variant="h6">Raporlar</MDTypography>
      <MDTypography variant="body2" color="text">
        Rapor oluşturucu ve hazır raporlar burada yer alacak.
      </MDTypography>
    </MDBox>
  );
}

export default ReportsTab;


