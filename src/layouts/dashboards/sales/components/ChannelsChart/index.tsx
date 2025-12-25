/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.2
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDBadgeDot from "components/MDBadgeDot";
import PieChart from "examples/Charts/PieChart";

// Data
import channelChartData, {
  fetchChartData,
} from "layouts/dashboards/sales/components/ChannelsChart/data";

// Material Dashboard 2 PRO React TS contexts
import { useMaterialUIController } from "context";
import { useState, useEffect } from "react";
import { Popover } from "@mui/material";
import { useBusy } from "layouts/pages/hooks/useBusy";

interface ChannelsChartProps {
  id: string;
  startDate?: string;
  endDate?: string;
}

function ChannelsChart({ id, startDate, endDate }: ChannelsChartProps): JSX.Element {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [chartData, setChartData] = useState(channelChartData);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const dispatchBusy = useBusy();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };
  useEffect(() => {
    dispatchBusy({ isBusy: true });
    async function fetchData() {
      if (id) {
        await fetchChartData(id, startDate, endDate).then(setChartData);
      }
      dispatchBusy({ isBusy: false });
    }
    fetchData();
  }, [id, startDate, endDate]);

  return (
    <Card sx={{ height: "100%" }}>
      <Popover
        open={open}
        onClose={handleClose}
        anchorPosition={{ top: window.innerHeight / 2, left: window.innerWidth / 2 }}
        anchorReference="anchorPosition"
        transformOrigin={{ vertical: "center", horizontal: "center" }}
        BackdropProps={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent dark backdrop
          },
        }}
        PaperProps={{
          style: {
            backgroundColor: "white", // White background for the popover content
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Optional shadow for depth
          },
        }}
      >
        <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
          <MDBox display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <MDTypography style={{ fontSize: "1.2rem", marginBottom: "10px" }} variant="h6">
              Müşteri Bazlı Talep Sayısı
            </MDTypography>

            {chartData.labels.map((item, index) => (
              <MDBox mb={1} key={index}>
                <MDBadgeDot
                  color={
                    chartData.datasets.backgroundColors[index] as
                      | "info"
                      | "primary"
                      | "dark"
                      | "secondary"
                      | "light"
                      | "success"
                      | "warning"
                      | "error"
                  }
                  size="sm"
                  badgeContent={
                    item +
                    " (" +
                    (chartData.datasets.data[index] == undefined
                      ? 0
                      : chartData.datasets.data[index]) +
                    ")"
                  }
                />
              </MDBox>
            ))}
          </MDBox>
        </MDBox>
      </Popover>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography variant="h6">
          Müşteri Bazlı Talep Sayısı
        </MDTypography>
        <Tooltip title="Detaylı bilgi için aşağıdaki butona tıklayınız" placement="bottom" arrow>
          <MDButton variant="outlined" color="secondary" size="small" circular iconOnly>
            <Icon>priority_high</Icon>
          </MDButton>
        </Tooltip>
      </MDBox>
      <MDBox mt={3}>
        <Grid container alignItems="center">
          <Grid
            item
            xs={7}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MDBox
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
               
              }}
            >
              <PieChart chart={chartData} height="12.5rem" />
            </MDBox>
          </Grid>
          <Grid item xs={5}>
            <MDBox pr={1}>
              {chartData.labels.map((item, index) => (
                <MDBox mb={1} key={index}>
                  <MDBadgeDot
                    color={
                      chartData.datasets.backgroundColors[index] as
                        | "info"
                        | "primary"
                        | "dark"
                        | "grey"
                        | "secondary"
                        | "light"
                        | "success"
                        | "warning"
                        | "error"
                    }
                    size="sm"
                    badgeContent={item}
                  />
                </MDBox>
              ))}
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox
        pt={4}
        pb={2}
        px={2}
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        mt="auto"
      >
        <MDBox width={{ xs: "100%", sm: "60%" }} lineHeight={1}>
            <MDTypography variant="button" color="text" fontWeight="light">
              Müşteri bazlı <strong>talep</strong> sayısını grafiksel olarak görebilirsiniz.
            </MDTypography>
        </MDBox>
        <MDBox width={{ xs: "100%", sm: "40%" }} textAlign="right" mt={{ xs: 2, sm: "auto" }}>
          <MDButton color={darkMode ? "white" : "light"} onClick={handleClick}>
            Detaylı Bilgi
          </MDButton>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default ChannelsChart;
