import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Card, Typography } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { useLocation, useNavigate } from "react-router-dom";

function TenantPermissions(): JSX.Element {
    const navigate = useNavigate();
    const location = useLocation() as any;
    const tenantName = location.state?.tenantName;

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox py={3}>
                <Card style={{ padding: 24 }}>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h5" style={{ fontWeight: 700 }}>
                            Tenant İzinleri {tenantName ? `- ${tenantName}` : ""}
                        </Typography>
                        <MDButton variant="outlined" color="info" onClick={() => navigate(-1)}>
                            Geri
                        </MDButton>
                    </MDBox>
                    <Typography variant="body2" color="text.secondary">
                        Placeholder: Tenant bazlı izin yönetimi ekranı.
                    </Typography>
                </Card>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default TenantPermissions;


