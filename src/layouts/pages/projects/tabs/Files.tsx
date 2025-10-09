import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function FilesTab(): JSX.Element {
  return (
    <MDBox>
      <MDTypography variant="h6">Dosyalar</MDTypography>
      <MDTypography variant="body2" color="text">
        Dosya listesi, klasörler ve önizlemeler burada yer alacak.
      </MDTypography>
    </MDBox>
  );
}

export default FilesTab;


