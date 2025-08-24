import React from "react";
import { Card, Grid, Icon, Typography } from "@mui/material";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";

type Props = {
    showDashboard: boolean;
    selectedTenant: any;
    onReturn: () => void;
};

function TenantsManagementDashboard({ showDashboard, selectedTenant, onReturn }: Props): JSX.Element {
    const navigate = useNavigate();
    return (
        <div className="test-component">
            <div className="test-header">
                <MDButton className="back-button" variant="outlined" color="white" onClick={onReturn}>
                    <Icon>arrow_back</Icon>
                </MDButton>
                <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>
                    {selectedTenant?.name || selectedTenant?.clientName || selectedTenant?.title}
                </Typography>
            </div>

            <div className="test-content">
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                    Tenant Yönetimi
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                    Bu alandan tenant&apos;a ait roller, kullanıcılar ve izinler gibi ayarlara erişebilirsiniz.
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Card
                            className="project-info-card"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                const tenantId = selectedTenant?.id || selectedTenant?.clientId;
                                const tenantName = selectedTenant?.name || selectedTenant?.clientName || selectedTenant?.title;
                                navigate(`/tenants/management/roles?id=${tenantId}`, {
                                    state: {
                                        backTo: "/tenants/management",
                                        tenant: { id: tenantId, name: tenantName },
                                    },
                                });
                            }}
                        >
                            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Icon color="info">security</Icon> Tenant Rolleri
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Rol tanımları ve atamaları
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card
                            className="project-info-card"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                const tenantId = selectedTenant?.id || selectedTenant?.clientId;
                                const tenantName = selectedTenant?.name || selectedTenant?.clientName || selectedTenant?.title;
                                navigate(`/tenants/${tenantId}/users`, {
                                    state: {
                                        backTo: "/tenants/management",
                                        tenant: { id: tenantId, name: tenantName },
                                    },
                                });
                            }}
                        >
                            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Icon color="info">group</Icon> Tenant Kullanıcıları
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Kullanıcı üyelikleri ve roller
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card
                            className="project-info-card"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                const tenantId = selectedTenant?.id || selectedTenant?.clientId;
                                const tenantName = selectedTenant?.name || selectedTenant?.clientName || selectedTenant?.title;
                                navigate(`/tenants/${tenantId}/users`, {
                                    state: {
                                        backTo: "/tenants/management",
                                        tenant: { id: tenantId, name: tenantName },
                                    },
                                });
                            }}
                        >
                            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Icon color="info">group_add</Icon> Tenant Kullanıcı Atama
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Sadece bu tenant için kullanıcı üyeliği
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card className="project-info-card" style={{ cursor: "pointer" }} onClick={() => navigate("/tenants/management/permissions", { state: { tenantId: selectedTenant?.id || selectedTenant?.clientId, tenantName: selectedTenant?.name || selectedTenant?.clientName || selectedTenant?.title } })}>
                            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Icon color="info">lock</Icon> Tenant İzinleri
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Erişim ve yetkilendirme
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

export default TenantsManagementDashboard;


