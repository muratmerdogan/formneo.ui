import { Autocomplete, Box, Card, TextField, Typography } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import React, { useEffect, useState } from "react";
import "./main.css";
import getConfiguration from "confiuration";
import { ClientApi } from "api/generated/api";
import { useBusy } from "layouts/pages/hooks/useBusy";
import TenantsManagementDashboard from "./tenantsDashboard";
import { useLocation } from "react-router-dom";

function TenantsManagement(): JSX.Element {
    const [showDashboard, setShowDashboard] = useState(false);
    const [tenants, setTenants] = useState<any[]>([]);
    const [selectedTenant, setSelectedTenant] = useState<any | null>(null);

    const dispatchBusy = useBusy();
    const location = useLocation() as any;

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                dispatchBusy({ isBusy: true });
                const api = new ClientApi(getConfiguration());
                const response = await api.apiClientGet();
                const payload: any = (response as any)?.data;
                const list: any[] = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.items)
                        ? payload.items
                        : Array.isArray(payload?.data)
                            ? payload.data
                            : Array.isArray(payload?.result)
                                ? payload.result
                                : [];
                setTenants(list);
                // Eğer tenant bilgisi state ile geldiyse, otomatik seç ve dashboardu aç
                const passedTenant = location?.state?.tenant as { id: string; name: string } | undefined;
                if (passedTenant) {
                    const match = list.find((t: any) => String(t.id || t.clientId) === String(passedTenant.id));
                    if (match) {
                        setSelectedTenant(match);
                        setShowDashboard(true);
                    }
                }
            } catch (error) {
                console.error("Tenant listesi alınamadı:", error);
            } finally {
                dispatchBusy({ isBusy: false });
            }
        };
        fetchTenants();
    }, []);

    const handleContinue = () => {
        if (selectedTenant) {
            setShowDashboard(true);
        }
    };

    const handleReturn = () => {
        setShowDashboard(false);
        setSelectedTenant(null);
    };

    const handleClear = () => {
        setSelectedTenant(null);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <div style={{ position: "relative", overflow: "hidden", height: "80vh" }}>
                <div className={`screen selection-screen ${showDashboard ? "slide-out" : ""} `}>
                    <div className="selection-content">
                        <Card className={`selection-card ${showDashboard ? "fade-out" : ""}`}>
                            <div className="header-section">
                                <div className="icon-container1">
                                    <span className="material-icons" style={{ fontSize: 40, color: "white" }}>
                                        business
                                    </span>
                                </div>
                                <Typography variant="h3" className="gradient-text" gutterBottom>
                                    Tenant Seçimi
                                </Typography>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                                    Lütfen bir tenant seçiniz.
                                </Typography>
                            </div>

                            <div className="autocomplete-container">
                                <Autocomplete
                                    options={tenants}
                                    getOptionLabel={(option: any) => option.name || option.clientName || option.title || "-"}
                                    value={selectedTenant}
                                    onChange={(e, val) => setSelectedTenant(val)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Tenant Ara"
                                            variant="outlined"
                                            fullWidth
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <span className="material-icons" style={{ color: "#666", marginRight: 8 }}>
                                                        search
                                                    </span>
                                                ),
                                            }}
                                        />
                                    )}
                                />

                                {selectedTenant && (
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
                                            <span className="material-icons" style={{ color: "#4caf50", marginRight: 16 }}>
                                                check_circle
                                            </span>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {selectedTenant.name || selectedTenant.clientName || selectedTenant.title}
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
                                    disabled={!selectedTenant}
                                    color="info"
                                >
                                    Devam Et
                                </MDButton>
                            </MDBox>
                        </Card>
                    </div>
                </div>

                {showDashboard && (
                    <div className={`screen test-screen ${showDashboard ? "slide-in" : ""}`}>
                        <TenantsManagementDashboard
                            showDashboard={showDashboard}
                            selectedTenant={selectedTenant}
                            onReturn={handleReturn}
                        />
                    </div>
                )}
            </div>
            <Footer />
        </DashboardLayout>
    );
}

export default TenantsManagement;


