import React, { useEffect, useMemo, useState } from "react";
import { Card, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "@mui/material";
import { UserApi, UserTenantsApi } from "api/generated/api";
import getConfiguration from "confiuration";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { useMaterialUIController, setSelectedTenantId } from "context";

type Option = { id: string; label: string };

function TenantSelect(): JSX.Element {
    const navigate = useNavigate();
    const dispatchBusy = useBusy();
    const [controller, dispatch] = useMaterialUIController();

    const [allTenants, setAllTenants] = useState<Option[]>([]);
    const [filtered, setFiltered] = useState<Option[]>([]);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Option | null>(null);
    const [isGlobalAdmin, setIsGlobalAdmin] = useState<boolean>(false);

    useEffect(() => {
        const load = async () => {
            try {
                dispatchBusy({ isBusy: true });
                const conf = getConfiguration();
                const userApi = new UserApi(conf);
                const me = await userApi.apiUserGetLoginUserDetailGet();
                const userId = String((me as any)?.data?.id || (me as any)?.data?.userId || "");
                if (!userId) {
                    setAllTenants([]);
                    setFiltered([]);
                    setIsGlobalAdmin(false);
                    return;
                }
                // Global admin mi?
                try {
                    const isAdminRes = await userApi.apiUserIsGlobalAdminGet(userId);
                    const val = (isAdminRes as any)?.data;
                    setIsGlobalAdmin(Boolean(val));
                } catch {
                    setIsGlobalAdmin(false);
                }
                const utApi = new UserTenantsApi(conf);
                const res = await utApi.apiUserTenantsByUserUserIdGet(userId);
                const payload: any = (res as any)?.data;
                const list: any[] = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.items)
                        ? payload.items
                        : Array.isArray(payload?.data)
                            ? payload.data
                            : Array.isArray(payload?.result)
                                ? payload.result
                                : [];
                const opts: Option[] = list.map((x: any) => {
                    const id = String(x.tenantId || x.id || x.clientId || x.uid || "");
                    const rawLabel = x.tenantName || x.name || x.clientName || x.title || x.label || (x.tenant && x.tenant.name) || "";
                    const label = String(rawLabel).trim() || "-";
                    return { id, label };
                });
                setAllTenants(opts);
                setFiltered(opts);
            } finally {
                dispatchBusy({ isBusy: false });
            }
        };
        load();
    }, []);

    useEffect(() => {
        const q = (search || "").toLowerCase();
        if (!q) {
            setFiltered(allTenants);
        } else {
            setFiltered(
                allTenants.filter((t) => (t.label || "").toLowerCase().includes(q) || String(t.id).toLowerCase().includes(q))
            );
        }
    }, [search, allTenants]);

    const handleContinue = () => {
        if (!selected?.id) return;
        localStorage.setItem("selectedTenantId", selected.id);
        setSelectedTenantId(dispatch as any, selected.id);
        window.location.href = "/dashboards/analytics"; // tam yenileme ile başla
    };

    const handleGlobalAdmin = () => {
        localStorage.removeItem("selectedTenantId");
        setSelectedTenantId(dispatch as any, null as any);
        window.location.href = "/tenants/management";
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Card style={{ padding: 24, width: 520, borderRadius: 16 }}>
                <MDBox mb={2}>
                    <MDTypography variant="h4" gutterBottom>
                        Şirket Seçimi
                    </MDTypography>
                    <MDTypography variant="button" color="text">
                        {isGlobalAdmin
                            ? "Lütfen devam etmek için bir şirket seçiniz veya Global Admin olarak devam edin."
                            : "Lütfen devam etmek için bir şirket seçiniz."}
                    </MDTypography>
                </MDBox>

                <MDBox mb={2}>
                    <TextField
                        placeholder="Ara (ad veya id)"
                        fullWidth
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </MDBox>

                <Autocomplete
                    disablePortal
                    options={filtered}
                    value={selected}
                    onChange={(e, v) => setSelected((v && (v as any).id) ? (v as any) : null)}
                    getOptionLabel={(o) => {
                        if (!o) return "";
                        if (typeof o === "string") return o;
                        const anyO: any = o as any;
                        return String(anyO.label ?? anyO.name ?? anyO.title ?? anyO.clientName ?? "");
                    }}
                    isOptionEqualToValue={(o, v) => {
                        const oid = (o as any)?.id ?? o;
                        const vid = (v as any)?.id ?? v;
                        return String(oid) === String(vid);
                    }}
                    renderInput={(params) => <TextField {...params} label="Şirket" placeholder="Şirket seç" />}
                />

                <MDBox mt={3} display="flex" justifyContent="space-between" gap={1}>
                    <MDButton variant="outlined" color="secondary" onClick={() => navigate("/authentication/sign-in/cover")}>Geri</MDButton>
                    <MDBox display="flex" gap={1}>
                        {isGlobalAdmin && (
                            <MDButton variant="outlined" color="warning" onClick={handleGlobalAdmin}>Global Admin olarak devam et</MDButton>
                        )}
                        <MDButton variant="gradient" color="info" disabled={!selected} onClick={handleContinue}>Devam Et</MDButton>
                    </MDBox>
                </MDBox>
            </Card>
        </div>
    );
}

export default TenantSelect;


