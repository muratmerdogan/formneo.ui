import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function CalendarTab(): JSX.Element {
  return (
    <MDBox>
      <MDTypography variant="h6">Takvim</MDTypography>
      <MDTypography variant="body2" color="text">
        Aylık/Haftalık/Zaman çizelgesi görünümleri burada yer alacak.
      </MDTypography>
    </MDBox>
  );
}

export default CalendarTab;


