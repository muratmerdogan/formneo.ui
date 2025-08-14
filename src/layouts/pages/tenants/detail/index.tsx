import React, { useEffect, useState } from "react";
import { Card, Grid, Checkbox, FormControlLabel, MenuItem, Select, InputLabel, FormControl, Autocomplete, TextField } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useNavigate, useSearchParams } from "react-router-dom";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { ClientApi, MainClientInsertDto, MainClientUpdateDto, MainClientPlan, MainClientStatus, SsoType } from "api/generated/api";
import getConfiguration from "confiuration";
import { useBusy } from "layouts/pages/hooks/useBusy";
type TenantFormData = {
    name: string;
    email: string;
    phoneNumber: string;
    status: string; // kept as string for UI Select; convert to enum number when sending
    plan: string; // kept as string for UI Select; convert to enum number when sending
    timezone: string;
    customDomain: string;
    domainVerified: boolean;
    billingEmail: string;
    ssoType: string; // kept as string for UI Select; convert to enum number when sending
    ssoMetadataUrl: string;
    isActive: boolean;
    slug: string;
    subdomain: string;
    featureFlags: string;
    quotas: string;
};

function TenantDetail(): JSX.Element {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tenantId = searchParams.get("id");
    const clientApi = new ClientApi(getConfiguration());
    const dispatchBusy = useBusy();

    const planOptions = [
        { label: "Free", value: String(MainClientPlan.NUMBER_0) },
        { label: "Pro", value: String(MainClientPlan.NUMBER_1) },
        { label: "Enterprise", value: String(MainClientPlan.NUMBER_2) },
    ];

    const ssoTypeOptions = [
        { label: "AzureAD", value: String(SsoType.NUMBER_0) },
        { label: "Okta", value: String(SsoType.NUMBER_1) },
        { label: "Keycloak", value: String(SsoType.NUMBER_2) },
        { label: "Custom", value: String(SsoType.NUMBER_3) },
    ];

    const statusOptions = [
        { label: "Pending", value: String(MainClientStatus.NUMBER_0) },
        { label: "Active", value: String(MainClientStatus.NUMBER_1) },
        { label: "Suspended", value: String(MainClientStatus.NUMBER_2) },
        { label: "Closed", value: String(MainClientStatus.NUMBER_3) },
    ];

    const [formData, setFormData] = useState<TenantFormData>({
        name: "",
        email: "",
        phoneNumber: "",
        status: "",
        plan: "",
        timezone: "",
        customDomain: "",
        domainVerified: false,
        billingEmail: "",
        ssoType: "",
        ssoMetadataUrl: "",
        isActive: true,
        slug: "",
        subdomain: "",
        featureFlags: "",
        quotas: "",
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
                    name: entity.name ?? "",
                    email: entity.email ?? "",
                    phoneNumber: entity.phoneNumber ?? "",
                    status: entity.status !== undefined && entity.status !== null ? String(entity.status) : "",
                    plan: entity.plan !== undefined && entity.plan !== null ? String(entity.plan) : "",
                    timezone: entity.timezone ?? "",
                    customDomain: entity.customDomain ?? "",
                    domainVerified: toBoolean(entity.domainVerified ?? false),
                    billingEmail: entity.billingEmail ?? "",
                    ssoType: entity.ssoType !== undefined && entity.ssoType !== null ? String(entity.ssoType) : "",
                    ssoMetadataUrl: entity.ssoMetadataUrl ?? "",
                    isActive: toBoolean(entity.isActive ?? false),
                    slug: entity.slug ?? "",
                    subdomain: entity.subdomain ?? "",
                    featureFlags: entity.featureFlags ?? "",
                    quotas: entity.quotas ?? "",
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
            const toEnumOrUndefined = (val: unknown) => (val === "" || val === undefined ? undefined : val);
            const toNumberOrUndefined = (val: string) => (val === "" || val === undefined ? undefined : Number(val));

            if (tenantId) {
                const updateDto: MainClientUpdateDto = {
                    id: tenantId,
                    name: formData.name,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    status: toNumberOrUndefined(formData.status) as unknown as MainClientStatus | undefined,
                    plan: toNumberOrUndefined(formData.plan) as unknown as MainClientPlan | undefined,
                    timezone: formData.timezone || undefined,
                    customDomain: formData.customDomain || undefined,
                    domainVerified: formData.domainVerified,
                    billingEmail: formData.billingEmail || undefined,
                    ssoType: toNumberOrUndefined(formData.ssoType) as unknown as SsoType | undefined,
                    ssoMetadataUrl: formData.ssoMetadataUrl || undefined,
                    isActive: formData.isActive,
                    slug: formData.slug,
                    subdomain: formData.subdomain,
                    featureFlags: formData.featureFlags,
                    quotas: formData.quotas,
                };
                await clientApi.apiClientPut(updateDto);
            } else {
                const insertDto: MainClientInsertDto = {
                    name: formData.name,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    status: toNumberOrUndefined(formData.status) as unknown as MainClientStatus | undefined,
                    plan: toNumberOrUndefined(formData.plan) as unknown as MainClientPlan | undefined,
                    timezone: formData.timezone || undefined,
                    customDomain: formData.customDomain || undefined,
                    domainVerified: formData.domainVerified,
                    billingEmail: formData.billingEmail || undefined,
                    ssoType: toNumberOrUndefined(formData.ssoType) as unknown as SsoType | undefined,
                    ssoMetadataUrl: formData.ssoMetadataUrl || undefined,
                    slug: formData.slug,
                    subdomain: formData.subdomain,
                    featureFlags: formData.featureFlags,
                    quotas: formData.quotas,
                };
                await clientApi.apiClientPost(insertDto);
            }
            navigate("/tenants");
        } catch (error) {
            console.error("Tenant kaydedilemedi:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const { name } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        if (!name) return;
        setFormData((prev) => ({ ...prev, [name]: value as string }));
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
                                        onChange={handleInputChange}
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
                                        onChange={handleInputChange}
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
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                    />
                                </MDBox>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <MDInput
                                            type="text"
                                            label="Slug"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <MDInput
                                            type="text"
                                            label="Subdomain"
                                            name="subdomain"
                                            value={formData.subdomain}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            options={statusOptions}
                                            getOptionLabel={(o) => o.label}
                                            value={statusOptions.find((o) => o.value === formData.status) || null}
                                            onChange={(event, option) =>
                                                setFormData((prev) => ({ ...prev, status: option?.value || "" }))
                                            }
                                            renderInput={(params) => (
                                                <TextField {...params} label="Durum" variant="outlined" fullWidth />
                                            )}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            options={planOptions}
                                            getOptionLabel={(o) => o.label}
                                            value={planOptions.find((o) => o.value === formData.plan) || null}
                                            onChange={(event, option) =>
                                                setFormData((prev) => ({ ...prev, plan: option?.value || "" }))
                                            }
                                            renderInput={(params) => (
                                                <TextField {...params} label="Plan" variant="outlined" fullWidth />
                                            )}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <MDInput
                                            type="text"
                                            label="Saat Dilimi"
                                            name="timezone"
                                            value={formData.timezone}
                                            onChange={handleInputChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <MDInput
                                            type="text"
                                            label="Özel Domain"
                                            name="customDomain"
                                            value={formData.customDomain}
                                            onChange={handleInputChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <MDInput
                                            type="text"
                                            label="Feature Flags"
                                            name="featureFlags"
                                            value={formData.featureFlags}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <MDInput
                                            type="text"
                                            label="Quotas"
                                            name="quotas"
                                            value={formData.quotas}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <MDInput
                                            type="email"
                                            label="Fatura E-postası"
                                            name="billingEmail"
                                            value={formData.billingEmail}
                                            onChange={handleInputChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            options={ssoTypeOptions}
                                            getOptionLabel={(o) => o.label}
                                            value={ssoTypeOptions.find((o) => o.value === formData.ssoType) || null}
                                            onChange={(event, option) =>
                                                setFormData((prev) => ({ ...prev, ssoType: option?.value || "" }))
                                            }
                                            renderInput={(params) => (
                                                <TextField {...params} label="SSO Tipi" variant="outlined" fullWidth />
                                            )}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <MDInput
                                            type="text"
                                            label="SSO Metadata URL"
                                            name="ssoMetadataUrl"
                                            value={formData.ssoMetadataUrl}
                                            onChange={handleInputChange}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>

                                <MDBox mb={2} display="flex" alignItems="center">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleCheckboxChange}
                                                color="primary"
                                            />
                                        }
                                        label={<MDTypography variant="button" fontWeight="regular">Aktif</MDTypography>}
                                    />
                                </MDBox>

                                <MDBox mb={2} display="flex" alignItems="center">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="domainVerified"
                                                checked={formData.domainVerified}
                                                onChange={handleCheckboxChange}
                                                color="primary"
                                            />
                                        }
                                        label={<MDTypography variant="button" fontWeight="regular">Domain Doğrulandı</MDTypography>}
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


