import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function OverviewTab(): JSX.Element {
  return (
    <MDBox>
      <Grid container spacing={3}>
        {["Yaklaşan", "Kritik Görevler", "Aktivite"].map((title, idx) => (
          <Grid item xs={12} md={4} key={idx}>
            <Card>
              <CardHeader title={<MDTypography variant="h6">{title}</MDTypography>} />
              <CardContent>
                <MDTypography variant="body2" color="text">
                  İçerik için placeholder. Veriler entegre edildiğinde bu widget
                  dinamikleşecek.
                </MDTypography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </MDBox>
  );
}

export default OverviewTab;


