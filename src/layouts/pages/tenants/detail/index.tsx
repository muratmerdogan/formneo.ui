import React, { useEffect, useState } from "react";
import { Card, Grid, Checkbox, FormControlLabel } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { ClientApi, MainClient, MainClientInsertDto, MainClientUpdateDto } from "api/generated/api";
import getConfiguration from "confiuration";
import { useBusy } from "layouts/pages/hooks/useBusy";
function TenantDetail(): JSX.Element {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tenantId = searchParams.get("id");
    const clientApi = new ClientApi(getConfiguration());
    const dispatchBusy = useBusy();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        isActive: true,
    });

    useEffect(() => {
        if (tenantId) {
            fetchTenant();
        }
    }, [tenantId]);

    const toBoolean = (value: any): boolean => {
        if (typeof value === "boolean") return value;
        if (typeof value === "number") return value !== 0;
        if (typeof value === "string") {
            const v = value.trim().toLowerCase();
            return v === "true" || v === "1" || v === "yes" || v === "on";
        }
        return Boolean(value);
    };

    const fetchTenant = async () => {
        try {

            dispatchBusy({ isBusy: true });
            const response = await clientApi.apiClientIdGet(tenantId as string);
            const payload: any = (response as any)?.data;

            const entity: any = Array.isArray(payload)
                ? payload[0]
                : payload?.data || payload?.result || payload?.item || payload;

            if (entity) {
                setFormData({
                    name: entity.name ?? entity.clientName ?? "",
                    email: entity.email ?? entity.domain ?? "",
                    phoneNumber: entity.phoneNumber ?? entity.plan ?? "",
                    isActive: toBoolean(entity.isActive ?? entity.active ?? false)
                });
            }

            dispatchBusy({ isBusy: false });
        } catch (error) {
            console.error("Tenant bilgileri alınamadı:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (tenantId) {
                const updateDto: MainClientUpdateDto = {
                    id: tenantId,
                    name: formData.name,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    isActive: formData.isActive,
                };
                await clientApi.apiClientPut(updateDto);
            } else {
                const insertDto: MainClientInsertDto = {
                    name: formData.name,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                };
                await clientApi.apiClientPost(insertDto);
            }
            navigate("/tenants");
        } catch (error) {
            console.error("Tenant kaydedilemedi:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox py={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card sx={{ p: 3 }}>
                            <MDBox mb={3}>
                                <MDTypography variant="h5" fontWeight="bold">
                                    {tenantId ? "Tenant Düzenle" : "Yeni Tenant"}
                                </MDTypography>
                            </MDBox>

                            <form onSubmit={handleSubmit}>
                                <MDBox mb={2}>
                                    <MDInput
                                        type="text"
                                        label="Tenant Adı"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                </MDBox>

                                <MDBox mb={2}>
                                    <MDInput
                                        type="email"
                                        label="E-posta"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                </MDBox>

                                <MDBox mb={2}>
                                    <MDInput
                                        type="text"
                                        label="Telefon"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                </MDBox>

                                <MDBox mb={2} display="flex" alignItems="center">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleChange}
                                                color="primary"
                                            />
                                        }
                                        label={<MDTypography variant="button" fontWeight="regular">Aktif</MDTypography>}
                                    />
                                </MDBox>

                                <MDBox mt={4} mb={1} display="flex" justifyContent="space-between">
                                    <MDButton variant="outlined" color="info" onClick={() => navigate("/tenants")}>
                                        İptal
                                    </MDButton>
                                    <MDButton
                                        variant="gradient"
                                        color="info"
                                        type="submit"
                                        sx={{
                                            backgroundColor: "#3e5d8f",
                                            backgroundImage: "linear-gradient(135deg, #3e5d8f 0%, #2c4a7a 100%)",
                                            textTransform: "none",
                                        }}
                                    >
                                        {tenantId ? "Güncelle" : "Oluştur"}
                                    </MDButton>
                                </MDBox>
                            </form>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default TenantDetail;


