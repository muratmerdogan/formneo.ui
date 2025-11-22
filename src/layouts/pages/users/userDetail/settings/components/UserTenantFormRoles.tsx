import React, { useEffect, useMemo, useRef, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { Card } from "@mui/material";
import { Tree } from "primereact/tree";
import { useNavigate } from "react-router-dom";
import { fetchTenantFormRoleList } from "api/tenantFormRoleService";
import getConfiguration from "confiuration";
import { UserTenantFormRolesApi } from "api/generated";

type TreeNode = any;

export default function UserTenantFormRoles({ userId }: { userId?: string }): JSX.Element {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [selectionKeys, setSelectionKeys] = useState<any>({});
  const [expandedKeys, setExpandedKeys] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const originalSelectedRef = useRef<Set<string>>(new Set());
  const navigate = useNavigate();

  const hasSelection = useMemo(() => Object.keys(selectionKeys).some(k => selectionKeys[k]?.checked), [selectionKeys]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const list = await fetchTenantFormRoleList();
        const roles: any[] = Array.isArray(list) ? list : [];
        const roleNodes: TreeNode[] = roles.map((r: any) => {
          const id = String(r.id || r.formTenantRoleId || "");
          const name = r.roleName || r.name || id;
          const count = Array.isArray(r.forms) ? r.forms.length : Array.isArray(r.formPermissions) ? r.formPermissions.length : 0;
          return {
            key: `frole:${id}`,
            label: `${name} ${count ? `(${count})` : ""}`.trim(),
            children: [],
            data: { id, name, count },
            selectable: true,
          } as TreeNode;
        });
        setNodes(roleNodes);

        // Kullanıcıya atanmış rolleri getir ve işaretle
        if (userId) {
          const api = new UserTenantFormRolesApi(getConfiguration());
          const res = await api.apiUserTenantFormRolesByUserIdGet(userId);
          const assigned: any[] = (res as any)?.data || [];
          const assignedIds = new Set<string>(assigned.map((x: any) => String(x.formTenantRoleId)));
          originalSelectedRef.current = new Set(assignedIds);
          const preselect: any = {};
          roleNodes.forEach((n: any) => {
            const rid = String(n?.data?.id || "");
            if (assignedIds.has(rid)) preselect[n.key] = { checked: true, partialChecked: false };
          });
          setSelectionKeys(preselect);
        } else {
          originalSelectedRef.current = new Set();
          setSelectionKeys({});
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const expandAll = () => {
    const all: any = {};
    (nodes || []).forEach((n) => (all[n.key] = true));
    setExpandedKeys(all);
  };
  const collapseAll = () => setExpandedKeys({});

  const currentSelectedIds = useMemo(() => {
    return new Set<string>(
      Object.entries(selectionKeys)
        .filter(([_, v]: any) => v?.checked)
        .map(([k]) => String(k).replace(/^frole:/, ""))
    );
  }, [selectionKeys]);

  const hasChanges = useMemo(() => {
    const a = originalSelectedRef.current;
    const b = currentSelectedIds;
    if (a.size !== b.size) return true;
    for (const id of a) if (!b.has(id)) return true;
    return false;
  }, [currentSelectedIds]);

  const handleSave = async () => {
    if (!userId) return;
    try {
      setSaving(true);
      const api = new UserTenantFormRolesApi(getConfiguration());
      await api.apiUserTenantFormRolesBulkSavePost({
        userId,
        formTenantRoleIds: Array.from(currentSelectedIds),
      } as any);
      originalSelectedRef.current = new Set(currentSelectedIds);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card style={{ borderRadius: 14, margin: 8, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}>
      <MDBox p={2} display="flex" alignItems="center" justifyContent="space-between" sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider" }}>
        <MDBox display="flex" alignItems="center" gap={1}>
          <i className="pi pi-shield" style={{ fontSize: 18, opacity: 0.9 }} />
          <MDTypography variant="h6">Form Rolleri</MDTypography>
          {loading && <MDTypography variant="button" color="text" sx={{ ml: 1 }}>Yükleniyor…</MDTypography>}
        </MDBox>
        <MDBox display="flex" alignItems="center" gap={1}>
          <MDButton variant="outlined" color="secondary" size="small" onClick={expandAll}>Hepsini Aç</MDButton>
          <MDButton variant="outlined" color="secondary" size="small" onClick={collapseAll}>Hepsini Kapat</MDButton>
          <MDButton variant="outlined" color="secondary" size="small" onClick={() => setSelectionKeys({})}>Seçimleri Temizle</MDButton>
          <MDButton variant="gradient" color="info" size="small" disabled={!userId || saving || loading || !hasChanges} onClick={handleSave}>
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </MDButton>
        </MDBox>
      </MDBox>
      <MDBox px={3} py={2} style={{ maxHeight: 560, overflow: "auto" }}>
        <MDBox style={{ background: "#f9fafb", borderRadius: 12, border: "1px solid #e8e8e8", padding: 16, boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)" }}>
          <Tree
            value={nodes}
            selectionMode="checkbox"
            selectionKeys={selectionKeys}
            expandedKeys={expandedKeys}
            onSelectionChange={(e: any) => setSelectionKeys(e.value || {})}
            onExpand={(e: any) => setExpandedKeys(e.value || {})}
            onCollapse={(e: any) => setExpandedKeys(e.value || {})}
            className="w-full"
            // Detaya gitme davranışı kaldırıldı
          />
          {(nodes || []).length === 0 && !loading && (
            <MDTypography variant="button" color="text">Kayıt bulunamadı.</MDTypography>
          )}
        </MDBox>
      </MDBox>
    </Card>
  );
}


