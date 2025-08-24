import React, { useEffect, useState } from "react";
import { Card, Grid, Chip } from "@mui/material";
import TextField from "@mui/material/TextField";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import getConfiguration from "confiuration";
import { RoleMenuApi, RolesTenantsApi, MenuApi } from "api/generated/api";
import { Tree } from "primereact/tree";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "layouts/pages/roles/RoleScreen/index.css";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { MessageBoxType } from "@ui5/webcomponents-react";

type Option = { id: string; label: string };
type AssignmentItem = { roleId: string; label: string; assignmentId?: string; locked?: boolean; refresh?: boolean };

function TenantRolesDetail(): JSX.Element {
    const navigate = useNavigate();
    const location = useLocation() as any;
    const [searchParams] = useSearchParams();
    const tenantId = searchParams.get("id");
    const dispatchAlert = useAlert();
    const [saving, setSaving] = useState<boolean>(false);

    const roleApi = new RoleMenuApi(getConfiguration());
    const rolesTenantsApi = new RolesTenantsApi(getConfiguration());

    const [allRoles, setAllRoles] = useState<Option[]>([]);
    const [source, setSource] = useState<AssignmentItem[]>([]); // legacy (assignment UI hidden)
    const [target, setTarget] = useState<AssignmentItem[]>([]); // legacy (assignment UI hidden)
    const [existingAssignments, setExistingAssignments] = useState<Map<string, { id: string; isLocked: boolean }>>(new Map()); // legacy
    const [allMenus, setAllMenus] = useState<any[]>([]);
    const [menuTreeNodes, setMenuTreeNodes] = useState<any[]>([]);
    const [menuSelectionKeys, setMenuSelectionKeys] = useState<any>({});
    const [roleGlobalMenuIdsMap, setRoleGlobalMenuIdsMap] = useState<Map<string, Set<string>>>(new Map());
    const [roleSelectionMenuIdsMap, setRoleSelectionMenuIdsMap] = useState<Map<string, Set<string>>>(new Map());
    const [roleNewIdsMap, setRoleNewIdsMap] = useState<Map<string, Set<string>>>(new Map());
    const [roleServerMenuIdsMap, setRoleServerMenuIdsMap] = useState<Map<string, Set<string>>>(new Map());
    const [roleLockedMap, setRoleLockedMap] = useState<Map<string, boolean>>(new Map());
    const [expandedKeys, setExpandedKeys] = useState<any>({});

    const renderTreeNode = (node: any) => {
        const isRole = String(node?.key || "").startsWith("role:");
        let showWarn = false;
        let warnTitle = "";
        if (isRole) {
            const rid = String(node?.key || "").split(":")[1];
            const totalMenus = (roleGlobalMenuIdsMap.get(rid) || new Set<string>()).size;
            // Seçim durumunu doğrudan Tree'nin selectionKeys'inden hesapla
            const selectedMenus = Object.keys(menuSelectionKeys || {})
                .filter((k) => (menuSelectionKeys || {})[k]?.checked && k.startsWith(`m:${rid}:`))
                .length;
            if (totalMenus > 0 && selectedMenus > 0 && selectedMenus < totalMenus) {
                showWarn = true;
                const missing = totalMenus - selectedMenus;
                warnTitle = `${missing} ekran seçilmemiş`;
            }
        }
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 4px', lineHeight: '22px' }}>
                <i className={`pi ${isRole ? 'pi-shield' : 'pi-box'}`} style={{ fontSize: isRole ? '1rem' : '0.95rem', opacity: 0.8 }} />
                <span style={node?.style}>{node?.label}</span>
                {showWarn && (
                    <i
                        className="pi pi-exclamation-triangle"
                        style={{ color: '#f59e0b', marginLeft: 6, fontSize: '0.9rem', opacity: 0.9 }}
                        title={warnTitle}
                    />
                )}
            </div>
        );
    };

    useEffect(() => {
        const load = async () => {
            try {
                const res = await roleApi.apiRoleMenuAllOnlyHeadGet();
                const payload: any[] = (res as any)?.data || [];
                const mapped: Option[] = (payload || []).map((r: any) => ({ id: String(r.id || r.roleId || ""), label: r.name || r.title || "-" }));
                setAllRoles(mapped);

                let assigned: AssignmentItem[] = [];
                let existing = new Map<string, { id: string; isLocked: boolean }>();

                if (tenantId) {
                    try {
                        const assignedRes = await rolesTenantsApi.apiRolesTenantsByTenantTenantIdGet(tenantId);
                        const list: any[] = (assignedRes as any)?.data || [];
                        existing = new Map(list.map((a: any) => [String(a.roleId), { id: String(a.id), isLocked: Boolean(a.isLocked) }]));
                        assigned = list.map((a: any) => ({
                            roleId: String(a.roleId),
                            label: mapped.find((m) => m.id === String(a.roleId))?.label || String(a.roleId),
                            assignmentId: String(a.id),
                            locked: Boolean(a.isLocked),
                        }));
                        setExistingAssignments(existing);
                    } catch {
                        // atanmış rol bulunamazsa boş geç
                        setExistingAssignments(new Map());
                    }
                } else {
                    setExistingAssignments(new Map());
                }

                const assignedIds = new Set(assigned.map((a) => a.roleId));
                const sourceItems: AssignmentItem[] = mapped
                    .filter((r) => !assignedIds.has(r.id))
                    .map((r) => ({ roleId: r.id, label: r.label }));
                setSource(sourceItems);
                setTarget(assigned);

                // Menüler
                try {
                    const menuApi = new MenuApi(getConfiguration());
                    const menusRes = await menuApi.apiMenuAllPlainGet();
                    const menus: any[] = (menusRes as any)?.data || [];
                    setAllMenus(menus);
                } catch {
                    setAllMenus([]);
                }
            } catch {
                setAllRoles([]);
                setSource([]);
                setTarget([]);
                setExistingAssignments(new Map());
            }
        };
        load();
    }, []);

    useEffect(() => {
        // Her rol için global menüleri ve snapshot'a göre yeni gelenleri hazırla; üst seviye: rol, alt seviye: menü ağacı
        const build = async () => {
            try {
                // 1) Roller için global menülerini çek (roleApi üzerinden tek tek)
                const globalByRole = new Map<string, Set<string>>();
                for (const r of allRoles) {
                    try {
                        const details = await roleApi.apiRoleMenuGetByIdRoleIdGet(r.id);
                        const mp: any[] = (details as any)?.data?.menuPermissions || [];
                        globalByRole.set(r.id, new Set(mp.map((m: any) => String(m.menuId))));
                    } catch {
                        globalByRole.set(r.id, new Set());
                    }
                }
                setRoleGlobalMenuIdsMap(globalByRole);

                // 2) Tenant bazlı mevcut seçimleri çek (GetWithMenusByTenant)
                const selByRole = new Map<string, Set<string>>();
                const lockedByRole = new Map<string, boolean>();
                if (tenantId) {
                    try {
                        const withMenus = await rolesTenantsApi.apiRolesTenantsWithMenusByTenantTenantIdGet(String(tenantId));
                        const items: any[] = (withMenus as any)?.data?.items || [];
                        const serverSelByRole = new Map<string, Set<string>>();
                        (allRoles || []).forEach((r) => {
                            const item = items.find((it: any) => String(it.roleId) === String(r.id));
                            if (item) {
                                const ids = new Set<string>((item.menuPermissions || []).map((p: any) => String(p.menuId)));
                                selByRole.set(r.id, ids);
                                lockedByRole.set(r.id, Boolean(item.isLocked));
                                serverSelByRole.set(r.id, new Set(ids));
                            } else {
                                selByRole.set(r.id, new Set());
                                lockedByRole.set(r.id, false);
                                serverSelByRole.set(r.id, new Set());
                            }
                        });
                        setRoleServerMenuIdsMap(serverSelByRole);
                    } catch {
                        const cleared = new Map<string, Set<string>>();
                        (allRoles || []).forEach((r) => { selByRole.set(r.id, new Set()); lockedByRole.set(r.id, false); cleared.set(r.id, new Set()); });
                        setRoleServerMenuIdsMap(cleared);
                    }
                } else {
                    const cleared = new Map<string, Set<string>>();
                    (allRoles || []).forEach((r) => { selByRole.set(r.id, new Set()); lockedByRole.set(r.id, false); cleared.set(r.id, new Set()); });
                    setRoleServerMenuIdsMap(cleared);
                }
                setRoleSelectionMenuIdsMap(selByRole);
                setRoleLockedMap(lockedByRole);

                // 3) Snapshot karşılaştırması ve newIds
                const newByRole = new Map<string, Set<string>>();
                for (const r of allRoles) {
                    const ids = globalByRole.get(r.id) || new Set<string>();
                    const snapshotKey = `tenantRoleMenuSnapshot:${tenantId}:${r.id}`;
                    let snapshotIds = new Set<string>();
                    try {
                        const raw = localStorage.getItem(snapshotKey);
                        if (raw) {
                            const parsed: string[] = JSON.parse(raw);
                            if (Array.isArray(parsed)) snapshotIds = new Set(parsed.map(String));
                        }
                    } catch { }
                    const newIds = new Set<string>();
                    ids.forEach((id) => { if (!snapshotIds.has(id)) newIds.add(id); });
                    newByRole.set(r.id, newIds);
                }
                setRoleNewIdsMap(newByRole);

                // 4) Ağaç: üstte rol düğümleri; altında rolün menü ağacı (allMenus hiyerarşisi süzülerek)
                const byParent: Record<string, any[]> = {};
                (allMenus || []).forEach((m: any) => {
                    const pid = String(m.parentMenuId ?? "root");
                    byParent[pid] = byParent[pid] || [];
                    byParent[pid].push(m);
                });

                const makeMenuNodes = (roleId: string, idsSet: Set<string>, highlightSet: Set<string>) => {
                    const toNode = (m: any): any => {
                        const menuId = String(m.id);
                        const children = (byParent[menuId] || []).map(toNode).filter(Boolean);
                        if (!idsSet.has(menuId) && children.length === 0) return null; // sadece ilgili menüler
                        const isNew = highlightSet.has(menuId);
                        return {
                            key: `m:${roleId}:${menuId}`,
                            label: m.name || m.title || m.text || `Menu ${menuId}`,
                            children,
                            style: isNew ? { color: '#e65100', fontWeight: 600 } : undefined,
                        };
                    };
                    return (byParent["root"] || []).map(toNode).filter(Boolean);
                };

                const roleNodes = (allRoles || []).map((r) => {
                    const idsSet = globalByRole.get(r.id) || new Set<string>();
                    const highlightSet = newByRole.get(r.id) || new Set<string>();
                    return {
                        key: `role:${r.id}`,
                        label: r.label,
                        children: makeMenuNodes(r.id, idsSet, highlightSet),
                        selectable: true,
                    };
                });
                setMenuTreeNodes(roleNodes);

                // 5) PrimeReact selectionKeys: tüm rol seçimlerini işaretle (rol düğümü, alt menüler)
                const selection: any = {};
                selByRole.forEach((ids, rid) => {
                    if ((ids?.size || 0) > 0) {
                        selection[`role:${rid}`] = { checked: true };
                    }
                    ids.forEach((id) => { selection[`m:${rid}:${id}`] = { checked: true }; });
                });
                setMenuSelectionKeys(selection);
            } catch (e) {
                console.error(e);
                setMenuTreeNodes([]);
                setMenuSelectionKeys({});
            }
        };
        if ((allRoles || []).length > 0) build();
    }, [allRoles, allMenus]);

    // Not: Seçim değiştiğinde node listesini yeniden kurmuyoruz; ağaç kapanmasını önlemek için yalnızca selectionKeys ve expandedKeys kontrol ediliyor.

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

                <MDBox px={4} pb={2}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Card style={{ borderRadius: 14 }}>
                                <MDBox p={2} display="flex" alignItems="center" justifyContent="space-between" style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 1, borderBottom: '1px solid #eee', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                                    <MDBox display="flex" alignItems="center" gap={2}></MDBox>
                                    <MDBox display="flex" alignItems="center" gap={1}>
                                        {Array.from(roleNewIdsMap.values()).some((s) => (s?.size || 0) > 0) && (
                                            <Chip label="Güncelleme var" color="error" variant="outlined" size="small" />
                                        )}
                                        <MDButton variant="outlined" color="secondary" size="small" onClick={() => {
                                            // Tüm rollerin tüm global menülerini seç
                                            const allSel: any = {};
                                            const newSelByRole = new Map<string, Set<string>>();
                                            (allRoles || []).forEach((r) => {
                                                const ids = roleGlobalMenuIdsMap.get(r.id) || new Set<string>();
                                                newSelByRole.set(r.id, new Set(ids));
                                                // role node'u işaretli olsun
                                                allSel[`role:${r.id}`] = { checked: true };
                                                ids.forEach((id) => { allSel[`m:${r.id}:${id}`] = { checked: true }; });
                                            });
                                            setMenuSelectionKeys(allSel);
                                            setRoleSelectionMenuIdsMap(newSelByRole);
                                        }}>Hepsini Seç</MDButton>
                                        <MDButton variant="outlined" color="secondary" size="small" onClick={() => {
                                            setMenuSelectionKeys({});
                                            const cleared = new Map<string, Set<string>>();
                                            (allRoles || []).forEach((r) => cleared.set(r.id, new Set()));
                                            setRoleSelectionMenuIdsMap(cleared);
                                        }}>Hepsini Kaldır</MDButton>
                                        <MDButton variant="outlined" color="info" size="small" onClick={async () => {
                                            if (!tenantId) return;
                                            try {
                                                // BulkSaveWithMenus payload (tüm roller; selected true/false)
                                                const items = (allRoles || []).map((r) => {
                                                    const roleKey = `role:${r.id}`;
                                                    const isSelected = Boolean((menuSelectionKeys || {})[roleKey]?.checked);
                                                    const menuIdsForRole = Array.from(roleSelectionMenuIdsMap.get(r.id) || new Set<string>());
                                                    return {
                                                        roleId: String(r.id),
                                                        isActive: true,
                                                        isLocked: Boolean(roleLockedMap.get(r.id)),
                                                        selected: isSelected,
                                                        menuPermissions: menuIdsForRole.map((mid) => ({
                                                            menuId: String(mid),
                                                            canView: true,
                                                            canAdd: true,
                                                            canEdit: true,
                                                            canDelete: true,
                                                        })),
                                                    };
                                                });
                                                await rolesTenantsApi.apiRolesTenantsBulkSaveWithMenusPost({ tenantId: String(tenantId), items });
                                                // Bildirim: kaç rol gönderildi
                                                const sentRoles = items.map((i) => i.roleId).join(", ");
                                                console.info(`Bulk kaydedildi. Roller: ${sentRoles}`);
                                            } catch (err) {
                                                console.error(err);
                                            }
                                        }}>Seçimleri Kaydet</MDButton>
                                        <MDButton variant="outlined" color="error" size="small" onClick={() => {
                                            // Tüm roller için snapshot'ı global menü id setlerine göre güncelle
                                            try {
                                                (allRoles || []).forEach((r) => {
                                                    const snapKey = `tenantRoleMenuSnapshot:${tenantId}:${r.id}`;
                                                    const ids = Array.from(roleGlobalMenuIdsMap.get(r.id) || new Set<string>());
                                                    localStorage.setItem(snapKey, JSON.stringify(ids));
                                                });
                                                // New flags reset (basitçe sıfırlayalım)
                                                const cleared = new Map<string, Set<string>>();
                                                (allRoles || []).forEach((r) => cleared.set(r.id, new Set()));
                                                setRoleNewIdsMap(cleared);
                                            } catch { }
                                        }}>Senkronize Et</MDButton>
                                    </MDBox>
                                </MDBox>
                                <MDBox px={2} pb={2} style={{ maxHeight: 560, overflow: 'auto', background: '#f9fafb', borderRadius: 12, border: '1px solid #e8e8e8', margin: 24, padding: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)' }}>
                                    <Tree
                                        value={menuTreeNodes}
                                        selectionMode="checkbox"
                                        selectionKeys={menuSelectionKeys}
                                        expandedKeys={expandedKeys}
                                        nodeTemplate={renderTreeNode}
                                        onSelectionChange={(e: any) => {
                                            const nextKeys = e.value || {};
                                            setMenuSelectionKeys(nextKeys);
                                            // Checked keys: role node'ları ve m:{roleId}:{menuId}
                                            const checkedKeys = Object.keys(nextKeys).filter((k) => nextKeys[k]?.checked);
                                            const newSelByRole = new Map<string, Set<string>>();
                                            (allRoles || []).forEach((r) => newSelByRole.set(r.id, new Set()));

                                            // 1) Rol node'u işaretlendiyse, o rolün tüm global menülerini seç
                                            (allRoles || []).forEach((r) => {
                                                const roleKey = `role:${r.id}`;
                                                if (checkedKeys.includes(roleKey)) {
                                                    const allIds = roleGlobalMenuIdsMap.get(r.id) || new Set<string>();
                                                    newSelByRole.set(r.id, new Set(allIds));
                                                }
                                            });

                                            // 2) Tekil menü anahtarları: m:{roleId}:{menuId}
                                            checkedKeys.forEach((k) => {
                                                if (k.startsWith('m:')) {
                                                    const [, rid, mid] = k.split(':');
                                                    const setForRole = newSelByRole.get(rid) || new Set<string>();
                                                    setForRole.add(mid);
                                                    newSelByRole.set(rid, setForRole);
                                                }
                                            });

                                            setRoleSelectionMenuIdsMap(newSelByRole);

                                            // 3) Rol altında herhangi bir seçim varsa rol checkbox'ını da işaretle
                                            const normalizedSelection: any = { ...nextKeys };
                                            (allRoles || []).forEach((r) => {
                                                const setForRole = newSelByRole.get(r.id) || new Set<string>();
                                                if ((setForRole?.size || 0) > 0) {
                                                    normalizedSelection[`role:${r.id}`] = { checked: true };
                                                    // Alt menü anahtarlarının zaten e.value içinde olması beklenir
                                                } else {
                                                    // altı boşsa rol işareti kaldırılabilir
                                                    if (normalizedSelection[`role:${r.id}`]) {
                                                        delete normalizedSelection[`role:${r.id}`];
                                                    }
                                                }
                                            });
                                            setMenuSelectionKeys(normalizedSelection);
                                        }}
                                        onExpand={(e: any) => setExpandedKeys(e.value || {})}
                                        onCollapse={(e: any) => setExpandedKeys(e.value || {})}
                                        className="w-full"
                                    />
                                    {(menuTreeNodes || []).length === 0 && (
                                        <MDTypography variant="button" color="text">Bu rol için menü bulunamadı.</MDTypography>
                                    )}
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>

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
                                    if (!tenantId) {
                                        return;
                                    }
                                    setSaving(true);
                                    // Değişiklik kontrolü: sağ taraftaki (target) durum mevcut atamalarla (existingAssignments) aynıysa ve hiçbir rol 'Rolü yenile' değilse çağrı yapma
                                    const currentMap = new Map<string, boolean>(target.map((t) => [t.roleId, Boolean(t.locked)]));
                                    let hasChange = false;
                                    if (currentMap.size !== existingAssignments.size) {
                                        hasChange = true;
                                    } else {
                                        for (const [rid, exist] of existingAssignments) {
                                            const cur = currentMap.get(rid);
                                            if (cur === undefined || cur !== Boolean(exist.isLocked)) {
                                                hasChange = true;
                                                break;
                                            }
                                        }
                                    }
                                    // 'Rolü yenile' işaretli olan var mı?
                                    const hasRefresh = target.some((t) => Boolean((t as any).refresh));
                                    if (!hasChange && !hasRefresh) {
                                        // Menüler için de kaydetme yapılacak; bu durumda doğrudan geçmeyelim
                                    }
                                    try {
                                        // Sadece değişen roller veya 'Rolü yenile' işaretliler için çağrı gönder
                                        const targetByRole = new Map<string, AssignmentItem>(target.map((t) => [t.roleId, t]));
                                        const bulkCalls: Promise<any>[] = [];

                                        const changedOrRefreshIds = new Set<string>();
                                        const allIds = new Set<string>([...Array.from(existingAssignments.keys()), ...Array.from(targetByRole.keys())]);
                                        allIds.forEach((rid) => {
                                            const exist = existingAssignments.get(rid);
                                            const now = targetByRole.get(rid);
                                            const membershipChanged = (!!exist) !== (!!now);
                                            const lockChanged = !!exist && !!now && Boolean(exist.isLocked) !== Boolean(now.locked);
                                            const refresh = !!now && Boolean((now as any).refresh);
                                            if (membershipChanged || lockChanged || refresh) {
                                                changedOrRefreshIds.add(rid);
                                            }
                                        });

                                        changedOrRefreshIds.forEach((rid) => {
                                            const item = targetByRole.get(rid);
                                            const items = item
                                                ? [{ tenantId: String(tenantId), isActive: true, isLocked: Boolean(item.locked) }]
                                                : [];
                                            bulkCalls.push(
                                                rolesTenantsApi.apiRolesTenantsBulkSavePost({
                                                    roleId: String(rid),
                                                    items,
                                                })
                                            );
                                        });

                                        await Promise.all(bulkCalls);

                                        // Menü seçimlerini toplu kaydet (tüm roller; selected true/false dahil)
                                        const items = (allRoles || []).map((r) => {
                                            const roleKey = `role:${r.id}`;
                                            const isSelected = Boolean((menuSelectionKeys || {})[roleKey]?.checked);
                                            const menuIdsForRole = Array.from(roleSelectionMenuIdsMap.get(r.id) || new Set<string>());
                                            return {
                                                roleId: String(r.id),
                                                roleName: String(r.label || r.id),
                                                isActive: true,
                                                isLocked: Boolean(roleLockedMap.get(r.id)),
                                                selected: isSelected,
                                                menuPermissions: menuIdsForRole.map((mid) => ({
                                                    menuId: String(mid),
                                                    canView: true,
                                                    canAdd: true,
                                                    canEdit: true,
                                                    canDelete: true,
                                                })),
                                            };
                                        });
                                        await rolesTenantsApi.apiRolesTenantsBulkSaveWithMenusPost({ tenantId: String(tenantId), items });
                                        const sentRoles = items.map((i) => i.roleId).join(", ");
                                        console.info(`Bulk kaydedildi. Roller: ${sentRoles}`);
                                        dispatchAlert({ message: "Değişiklikler başarıyla kaydedildi", type: MessageBoxType.Success });
                                    } catch (e) {
                                        console.error(e);
                                    } finally {
                                        // Kaydetme sonrası bu sayfada kal
                                        setSaving(false);
                                    }
                                }}
                                variant="gradient"
                                color="info"
                                disabled={saving}
                                startIcon={saving ? <i className="pi pi-spin pi-spinner" /> : undefined}
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


