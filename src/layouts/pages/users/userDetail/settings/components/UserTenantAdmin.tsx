import React, { useEffect, useMemo, useState } from "react";
import { Card, Checkbox, Icon, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import getConfiguration from "confiuration";
import { RoleTenantMenuApi, UserApi, UserTenantsApi } from "api/generated";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { MessageBoxType } from "@ui5/webcomponents-react";

type Props = { userId?: string };

type TenantRow = {
    id: string;
    name: string;
    isAdmin: boolean;
};

// Heuristics: try to detect a role labeled like Tenant Admin. Fallback to first role if exactly one exists.
function findTenantAdminRoleId(roleList: any[]): string | null {
    if (!Array.isArray(roleList)) return null;
    const candidates = roleList.map((r: any) => ({
        id: String(r.RoleId || r.roleId || r.Id || r.id || r?.role?.id || ""),
        name: String(r.RoleName || r.roleName || r?.role?.name || r.Name || r.name || "").toLowerCase(),
    }));
    const match = candidates.find((c) => c.name.includes("tenant") && c.name.includes("admin"))
        || candidates.find((c) => c.name.includes("şirket") && c.name.includes("admin"))
        || candidates.find((c) => c.name.includes("company") && c.name.includes("admin"));
    if (match?.id) return match.id;
    if (candidates.length === 1 && candidates[0].id) return candidates[0].id;
    return null;
}

export default function UserTenantAdmin({ userId }: Props): JSX.Element {
    const dispatchBusy = useBusy();
    const dispatchAlert = useAlert();

    const [tenants, setTenants] = useState<TenantRow[]>([]);
    const [adminMap, setAdminMap] = useState<Record<string, boolean>>({});
    const [original, setOriginal] = useState<Record<string, boolean>>({});
    const [saving, setSaving] = useState(false);

    const hasChanges = useMemo(() => {
        const keys = new Set([...Object.keys(original), ...Object.keys(adminMap)]);
        for (const k of keys) {
            if (Boolean(original[k]) !== Boolean(adminMap[k])) return true;
        }
        return false;
    }, [original, adminMap]);

    useEffect(() => {
        const load = async () => {
            if (!userId) return;
            try {
                dispatchBusy({ isBusy: true });
                const conf = getConfiguration();
                const userApi = new UserApi(conf);
                const utApi = new UserTenantsApi(conf);
                const roleApi = new RoleTenantMenuApi(conf);

                // 1) Kullanıcının tenantları
                const meTenantsRes = await utApi.apiUserTenantsByUserUserIdGet(String(userId));
                const list: any[] = (meTenantsRes as any)?.data || [];
                const mapped: TenantRow[] = (list || []).map((x: any) => ({
                    id: String(x.tenantId || x.id || ""),
                    name: String(x.tenantName || x.tenantSlug || x.name || "-"),
                    isAdmin: false,
                }));
                setTenants(mapped);

                // 2) Kullanıcının atanmış tenant rollerini getir (global görünüm)
                const rolesRes = await roleApi.apiRoleTenantMenuUserRoleAssignmentsGet(String(userId));
                const raw = (rolesRes as any)?.data;
                const roleAssignments: any[] = Array.isArray(raw) ? raw : (raw?.items || raw?.roles || raw?.roleAssignments || []);

                // Tenant Admin rol ID'sini bul
                const tenantAdminRoleId = findTenantAdminRoleId(roleAssignments);

                // Seçim haritasını üret: ilgili rolde işaretli olan tenantlar admin kabul edilir
                const map: Record<string, boolean> = {};
                (roleAssignments || []).forEach((r: any) => {
                    const rid = String(r.RoleId || r.roleId || r.Id || r.id || r?.role?.id || "");
                    const selected = Boolean(r.isAssignedToUser || r.assigned || r.selected || r.isAssigned || r.shouldAssign);
                    if (tenantAdminRoleId && rid === tenantAdminRoleId) {
                        const tid = String(r.TenantId || r.tenantId || localStorage.getItem("selectedTenantId") || "");
                        if (tid) map[tid] = selected;
                    }
                });
                setAdminMap(map);
                setOriginal(map);
            } catch (e: any) {
                dispatchAlert({ message: e?.response?.data?.errors?.[0] || "Veri yüklenemedi", type: MessageBoxType.Error });
            } finally {
                dispatchBusy({ isBusy: false });
            }
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const toggle = (tenantId: string) => {
        setAdminMap((prev) => ({ ...prev, [tenantId]: !prev[tenantId] }));
    };

    const handleSave = async () => {
        if (!userId || !hasChanges) return;
        try {
            setSaving(true);
            const conf = getConfiguration();
            const roleApi = new RoleTenantMenuApi(conf);

            // MakeTenantAdmin endpoint'i ile tek seferde yetkilendirme yap
            const selectedTenantIds = Object.entries(adminMap)
                .filter(([, isAdmin]) => Boolean(isAdmin))
                .map(([tenantId]) => String(tenantId));

            await roleApi.apiRoleTenantMenuMakeTenantAdminPost({
                userId: String(userId),
                tenantIds: selectedTenantIds,
            } as any);

            setOriginal({ ...adminMap });
            dispatchAlert({ message: "Kayıt başarılı", type: MessageBoxType.Success });
        } catch (e: any) {
            dispatchAlert({ message: e?.response?.data?.errors?.[0] || "Kaydetme hatası", type: MessageBoxType.Error });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card style={{ borderRadius: 14, padding: 20 }}>
            <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight={700}>
                    Kullanıcı Tenantları ve Admin Yetkisi
                </Typography>
                <MDBox>
                    <MDButton variant="outlined" color="secondary" onClick={() => setAdminMap(original)} sx={{ mr: 1 }} disabled={!hasChanges}>
                        Vazgeç
                    </MDButton>
                    <MDButton variant="gradient" color="info" onClick={handleSave} disabled={!hasChanges || saving} startIcon={<Icon>save</Icon>}>
                        Kaydet
                    </MDButton>
                </MDBox>
            </MDBox>

            <List>
                {(tenants || []).map((t) => (
                    <ListItem key={t.id} divider sx={{ py: 1.25 }} secondaryAction={
                        <Checkbox edge="end" onChange={() => toggle(t.id)} checked={Boolean(adminMap[t.id])} />
                    }>
                        <ListItemIcon>
                            <Icon>business</Icon>
                        </ListItemIcon>
                        <ListItemText primary={t.name} />
                    </ListItem>
                ))}
                {(!tenants || tenants.length === 0) && (
                    <MDBox p={2}>
                        <Typography variant="body2" color="text.secondary">Bu kullanıcının kayıtlı tenantı bulunamadı.</Typography>
                    </MDBox>
                )}
            </List>
        </Card>
    );
}


