import { Autocomplete, Box, Card, TextField, Typography } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import "./main.css";
import MDButton from "components/MDButton";
import ProjectDashboard from "./projectDashboard/dashboard";
import getConfiguration from "confiuration";
import { WorkCompanyApi, WorkCompanyDto } from "api/generated/api";
import Footer from "examples/Footer";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { useLocation } from "react-router-dom";
function MainScreen() {
  const location = useLocation();
  const [showTest, setShowTest] = useState(false);
  const [workCompanyData, setWorkCompanyData] = useState<WorkCompanyDto[]>([]);
  const [selectedWorkCompany, setSelectedWorkCompany] = useState<WorkCompanyDto | null>(null);

  const dispatchBusy = useBusy();

  useEffect(() => {
    if (location.state?.showTest) {
      console.log("showTest", location.state.showTest);
      setShowTest(true);
    }
    if (location.state?.workCompany) {
      console.log("workCompany", location.state.workCompany);
      setSelectedWorkCompany(location.state.workCompany);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchWorkCompanyData = async () => {
      try {
        dispatchBusy({ isBusy: true });
        const config = getConfiguration();
        const api = new WorkCompanyApi(config);
        const response = await api.apiWorkCompanyGet();
        setWorkCompanyData(response.data);
     
      } catch (error) {
        console.error("Error fetching work company data:", error);
      } finally {
        dispatchBusy({ isBusy: false });
      } 
    };
    fetchWorkCompanyData();
  }, []);

  const handleContinue = () => {
    if (selectedWorkCompany) {
      setShowTest(true);
    }
  };

  const handleReturn = () => {
    setShowTest(false);
    setSelectedWorkCompany(null);
  };

  const handleClear = () => {
    setSelectedWorkCompany(null);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div style={{ position: "relative", overflow: "hidden", height: "80vh" }}>
        <div className={`screen selection-screen ${showTest ? "slide-out" : ""} `} >
          <div className="selection-content">
            <Card className={`selection-card ${showTest ? "fade-out" : ""}`}>
              <div className="header-section">
                <div className="icon-container1">
                  <span className="material-icons" style={{ fontSize: 40, color: "white" }}>
                    folder
                  </span>
                </div>
                <Typography variant="h3" className="gradient-text" gutterBottom>
                  Şirket Seçimi
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                  Lütfen bir şirket seçiniz.
                </Typography>
              </div>

              <div className="autocomplete-container">
                <Autocomplete
                  options={workCompanyData}
                  getOptionLabel={(option) => option.name}
                  value={selectedWorkCompany}
                  onChange={(e, val) => setSelectedWorkCompany(val)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Şirket Ara"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <span
                            className="material-icons"
                            style={{ color: "#666", marginRight: 8 }}
                          >
                            business
                          </span>
                        ),
                      }}
                    />
                  )}
                />

                {selectedWorkCompany && (
                  <Card
                    sx={{
                      padding: "16px",
                      marginTop: "16px",
                      border: "1px solid #90caf9",
                      borderRadius: "12px",
                      backgroundColor: "rgba(144, 202, 249, 0.1)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <span
                        className="material-icons"
                        style={{ color: "#4caf50", marginRight: 16 }}
                      >
                        check_circle
                      </span>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {selectedWorkCompany.name}
                      </Typography>
                    </Box>
                  </Card>
                )}
              </div>

              <MDBox sx={{ display: "flex", justifyContent: "center", gap: 4, mt: 4 }}>
                <MDButton variant="outlined" size="large" onClick={handleClear} color="secondary">
                  Temizle
                </MDButton>
                <MDButton
                  variant="contained"
                  size="large"
                  onClick={handleContinue}
                  disabled={!selectedWorkCompany}
                  color="info"
                >
                  Devam Et
                </MDButton>
              </MDBox>
            </Card>
          </div>
        </div>

        {showTest && (
        <div className={`screen test-screen ${showTest ? "slide-in" : ""}`}>
          <ProjectDashboard
            showTest={showTest}
            selectedWorkCompany={selectedWorkCompany}
            onReturn={handleReturn}
          />
        </div>)}
      </div>
      <Footer />
    </DashboardLayout>
  );
}

export default MainScreen;
