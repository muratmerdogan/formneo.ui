import React, { useEffect, useState } from "react";
import { Card, Grid, TextField, Checkbox, FormControlLabel } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import getConfiguration from "confiuration";
import { RoleMenuApi } from "api/generated/api";
import { PickList } from "primereact/picklist";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "layouts/pages/roles/RoleScreen/index.css";

type Option = { id: string; label: string };
type AssignmentItem = { roleId: string; label: string; assignmentId?: string; locked?: boolean };

function TenantRolesDetail(): JSX.Element {
    const navigate = useNavigate();
    const location = useLocation() as any;
    const [searchParams] = useSearchParams();
    const tenantId = searchParams.get("id");

    const roleApi = new RoleMenuApi(getConfiguration());

    const [allRoles, setAllRoles] = useState<Option[]>([]);
    const [source, setSource] = useState<AssignmentItem[]>([]);
    const [target, setTarget] = useState<AssignmentItem[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await roleApi.apiRoleMenuAllOnlyHeadGet();
                const payload: any[] = (res as any)?.data || [];
                const mapped: Option[] = (payload || []).map((r: any) => ({ id: String(r.id || r.roleId || ""), label: r.name || r.title || "-" }));
                setAllRoles(mapped);

                // Atanmış rollerin alınacağı yer (API henüz yoksa boş başlatıyoruz)
                const assigned: AssignmentItem[] = [];
                const assignedIds = new Set(assigned.map((a) => a.roleId));
                const sourceItems: AssignmentItem[] = mapped
                    .filter((r) => !assignedIds.has(r.id))
                    .map((r) => ({ roleId: r.id, label: r.label }));
                setSource(sourceItems);
                setTarget(assigned);
            } catch {
                setAllRoles([]);
                setSource([]);
                setTarget([]);
            }
        };
        load();
    }, []);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Card>
                <MDBox p={3}>
                    <MDBox p={3} pb={0}>
                        <MDTypography variant="h4" gutterBottom>
                            Tenant Rolleri
                        </MDTypography>
                        {location?.state?.tenant?.name && (
                            <MDTypography variant="button" color="text" gutterBottom>
                                Seçili Tenant: {location.state.tenant.name}
                            </MDTypography>
                        )}
                    </MDBox>

                    <Grid container>
                        <Grid item xs={12} lg={6}>
                            <MDBox mt={3} p={3} mb={-3}>
                                <TextField label="Tenant" value={location?.state?.tenant?.name || tenantId || ""} fullWidth disabled />
                            </MDBox>
                        </Grid>
                    </Grid>
                </MDBox>

                <div className="surface-card shadow-2 border-round p-4 m-4">
                    <PickList
                        dataKey="roleId"
                        source={source}
                        target={target}
                        onChange={(event) => {
                            const nextSource = (event.source as AssignmentItem[]);
                            const prevLocked = new Map<string, boolean>(target.map((t) => [t.roleId, Boolean(t.locked)]));
                            const nextTarget = (event.target as AssignmentItem[]).map((t) => ({ ...t, locked: prevLocked.get(t.roleId) ?? false }));
                            setSource(nextSource);
                            setTarget(nextTarget);
                        }}
                        itemTemplate={(item: AssignmentItem) => (
                            <div className="flex align-items-center p-3 w-full">
                                <div className="flex flex-column" style={{ width: "100%" }}>
                                    <Grid container alignItems="center">
                                        <Grid item xs={12} lg={0.7}>
                                            <i className="pi pi-shield" style={{ marginTop: "0.3rem", marginRight: "0.5rem", fontSize: "1.25rem" }}></i>
                                        </Grid>
                                        <Grid container lg={11.3} alignItems="center">
                                            <Grid item xs={12} lg={8}>
                                                <span className="font-bold text-lg" style={{ fontWeight: 600 }}>{item.label}</span>
                                            </Grid>
                                            {target.some((t) => t.roleId === item.roleId) && (
                                                <Grid item xs={12} lg={4} style={{ textAlign: "right" }}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={Boolean(target.find((t) => t.roleId === item.roleId)?.locked)}
                                                                onChange={(e) => {
                                                                    const checked = e.target.checked;
                                                                    setTarget((prev) => prev.map((t) => t.roleId === item.roleId ? { ...t, locked: checked } : t));
                                                                }}
                                                                color="primary"
                                                            />
                                                        }
                                                        label="Kilitli"
                                                    />
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        )}
                        filter
                        filterBy="label"
                        breakpoint="1280px"
                        sourceHeader={
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <MDTypography style={{ color: "#757ce8" }}>Tüm Roller</MDTypography>
                            </div>
                        }
                        targetHeader={
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <MDTypography style={{ color: "#757ce8" }}>Tenant&apos;a Atanan Roller</MDTypography>
                            </div>
                        }
                        sourceStyle={{ height: "24rem", width: "100%" }}
                        targetStyle={{ height: "24rem", width: "100%" }}
                        showSourceControls={false}
                        showTargetControls={false}
                        className="picklist-custom"
                    />
                </div>

                <MDBox p={3}>
                    <MDBox p={2}>
                        <MDBox display="flex" justifyContent="flex-end">
                            <MDBox mr={2}>
                                <MDButton onClick={() => {
                                    const backTo = location?.state?.backTo as string | undefined;
                                    const tenant = location?.state?.tenant as { id: string; name: string } | undefined;
                                    if (backTo && tenant) {
                                        navigate(backTo, { state: { tenant } });
                                    } else {
                                        navigate("/tenants/management");
                                    }
                                }} variant="outlined" color="error">
                                    İptal
                                </MDButton>
                            </MDBox>
                            <MDButton
                                onClick={async () => {
                                    // Kaydetme işlemi (API entegrasyonu eklenecekse burada yapılmalı)
                                    const backTo = location?.state?.backTo as string | undefined;
                                    const tenant = location?.state?.tenant as { id: string; name: string } | undefined;
                                    if (backTo && tenant) {
                                        navigate(backTo, { state: { tenant } });
                                    } else {
                                        navigate("/tenants/management");
                                    }
                                }}
                                variant="gradient"
                                color="info"
                            >
                                Kaydet
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
            <Footer />
        </DashboardLayout>
    );
}

export default TenantRolesDetail;


