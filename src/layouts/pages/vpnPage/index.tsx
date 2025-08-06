import { Autocomplete, Card, CardContent, CardHeader, InputAdornment } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { Suspense, useState } from "react";
import { TabMenu } from "primereact/tabmenu";
import "./index.css";
import MDInput from "components/MDInput";
import { Search } from "@mui/icons-material";
import LogonLoginSelectionContainer from "./selectionCardComponent/LogonLoginSelectionContainer";
import VpnSelectionContainer from "./selectionCardComponent/VpnSelectionContainer";
import UserPano from "./components/usersIndex/UserPano";
function VpnDashboard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = [
    { label: "VPN", icon: "pi pi-wifi" },
    { label: "Logon / Login", icon: "pi pi-list" },
    { label: "Sorumlular", icon: "pi pi-users" },
  ];
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Card
        sx={{
          width: "100%",
        }}
      >
        <CardHeader
          title="Pano Dashboard"
          sx={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "primary.main",
            textAlign: "center",
            padding: "1rem",
            borderRadius: "8px",
          }}
        />
        <CardContent>
          <MDBox mb={2} mt={3}>
            <Autocomplete
              options={[]}
              renderInput={(params) => (
                <MDInput
                  {...params}
                  label="Müşteri"
                  fullWidth
                  placeholder="Müşteri Seçiniz"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </MDBox>
          <MDBox mb={2} mt={3}>
            <Autocomplete
              options={["Test", "Dev", "Canlı"]}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <MDInput
                  {...params}
                  label="Geliştirme Ortami"
                  fullWidth
                  placeholder="Geliştirme Ortamı Seçiniz"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </MDBox>
          <TabMenu
            className="custom-tab-menu"
            style={{
              border: "none",
              backgroundColor: "transparent",
              borderRadius: "8px",
            }}
            model={items}
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          />

          {activeIndex === 0 && <VpnSelectionContainer />}
          {activeIndex === 1 && <LogonLoginSelectionContainer />}
          {activeIndex === 2 && (
            <Suspense fallback={<div>Loading...</div>}>
              <UserPano />
            </Suspense>
          )} 
        </CardContent>
      </Card>

      <Footer />
    </DashboardLayout>
  );
}

export default VpnDashboard;
