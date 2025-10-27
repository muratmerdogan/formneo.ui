import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useMemo, useState } from "react";
import { Grid, Card, Divider, Icon, Tooltip } from "@mui/material";
import { useParams } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Footer from "examples/Footer";
import { PickList } from "primereact/picklist";
import { MessageBoxType } from "@ui5/webcomponents-react";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { FormDataApi } from "api/generated";
import { fetchLatestFormsPerFamily, fetchTenantFormAssignments, insertTenantFormAssignments, updateTenantFormAssignments, fetchTenantFormRoleList } from "api/tenantFormRoleService";
import getConfiguration from "confiuration";

type FormItem = {
  id: string;
  formName: string;
  formDescription?: string | null;
};

export default function TenantFormRole(): JSX.Element {
  const { id: routeRoleId } = useParams<{ id?: string }>();
  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();

  const [tenantId, setTenantId] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState<string>("");
  const [roleDescription, setRoleDescription] = useState<string>("");
  const [source, setSource] = useState<FormItem[]>([]); // Tenant’taki tüm yayınlanmış/aktif formlar
  const [target, setTarget] = useState<FormItem[]>([]); // Role atanacak formlar

  const storageKey = useMemo(() => `mock:tenantFormAssignments:${tenantId || "__unknown__"}:${roleId || "new"}`, [tenantId, roleId]);
  const roleListKey = useMemo(() => `mock:tenantFormRoles:${tenantId || "__unknown__"}`, [tenantId]);

  const itemTemplate = (item: FormItem) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontWeight: 600 }}>{item.formName}</span>
      {item.formDescription ? (
        <span style={{ fontSize: 12, color: "#637381" }}>{item.formDescription}</span>
      ) : null}
    </div>
  );

  const onChange = (event: any) => {
    setSource(event.source);
    setTarget(event.target);
  };

  const loadForms = async (): Promise<FormItem[]> => {
    try {
      dispatchBusy({ isBusy: true });
      // Yeni: latest-per-family ile son revizyonlar
      const latest = await fetchLatestFormsPerFamily();
      const rootForms: FormItem[] = (latest || []).map((f: any) => ({ id: f.id, formName: f.formName, formDescription: f.formDescription }));
      setSource(rootForms);
      return rootForms;
    } catch (error) {
      dispatchAlert({ message: "Formlar yüklenemedi", type: MessageBoxType.Error });
      return [];
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const loadAssignments = async (forms: FormItem[]) => {
    try {
      if (!tenantId || !roleId) { setTarget([]); return; }
      const ids = await fetchTenantFormAssignments(roleId, tenantId);
      const idSet = new Set(ids);
      const selected = forms.filter((s) => idSet.has(String(s.id)));
      const remaining = forms.filter((s) => !idSet.has(String(s.id)));
      setTarget(selected);
      setSource(remaining);
    } catch {
      setTarget([]);
    }
  };

  const loadRoleDetail = async () => {
    try {
      if (!roleId) return;
      const list = await fetchTenantFormRoleList();
      const role: any = (list || []).find((x: any) => String(x.id || x.formTenantRoleId) === String(roleId));
      if (role) {
        setRoleName(String(role.roleName || role.name || ""));
        setRoleDescription(String(role.roleDescription || role.description || ""));
      }
    } catch {
      // ignore
    }
  };

  const handleSave = async () => {
    try {
      const ids = target.map((t) => String(t.id));
      if (!ids.length) { dispatchAlert({ message: "En az bir form seçin", type: MessageBoxType.Error }); return; }
      if (roleId) {
        await updateTenantFormAssignments({ roleId, roleName: roleName || "", formIds: ids });
      } else {
        await insertTenantFormAssignments({ roleName: roleName || "", formIds: ids });
      }
      dispatchAlert({ message: "Atamalar kaydedildi", type: MessageBoxType.Success });
    } catch (error) {
      dispatchAlert({ message: "Kaydetme sırasında hata", type: MessageBoxType.Error });
    }
  };

  useEffect(() => {
    const tid = localStorage.getItem("selectedTenantId");
    setTenantId(tid);
    if (routeRoleId) {
      setRoleId(String(routeRoleId));
    }
  }, []);

  useEffect(() => {
    if (tenantId) {
      (async () => {
        await loadRoleDetail();
        const forms = await loadForms();
        await loadAssignments(forms);
      })();
    }
  }, [tenantId, roleId]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mx={2} mt={2} mb={1}>
        <Card style={{ borderRadius: 14 }}>
          <MDBox p={3}>
            <MDTypography variant="h5" fontWeight="medium" color="text" mb={1}>
              Tenant FormRol Yönetimi
            </MDTypography>
            <MDTypography variant="button" color="text" sx={{ opacity: 0.7 }}>
              Sol tarafta tenant içindeki formlar, sağ tarafta atanmış formlar yer alır.
            </MDTypography>
          </MDBox>
          <Divider />

          <MDBox p={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <MDInput
                  type="text"
                  label="Rol Adı"
                  variant="outlined"
                  fullWidth
                  value={roleName}
                  onChange={(e: any) => setRoleName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <MDInput
                  type="text"
                  label="Açıklama"
                  variant="outlined"
                  fullWidth
                  value={roleDescription}
                  onChange={(e: any) => setRoleDescription(e.target.value)}
                />
              </Grid>
            </Grid>
          </MDBox>

          <MDBox px={3} pb={3}>
            <MDTypography variant="h6" fontWeight="medium" color="text" mb={2}>
              Form Atama
            </MDTypography>
            <Divider sx={{ mb: 3 }} />

            <div className="surface-card shadow-2 border-round" style={{ width: "100%" }}>
              <PickList
                dataKey="id"
                source={source}
                target={target}
                onChange={(event) => {
                  onChange(event);
                }}
                itemTemplate={itemTemplate}
                sourceItemTemplate={itemTemplate}
                targetItemTemplate={itemTemplate}
                filter
                filterBy="formName,formDescription"
                breakpoint="1280px"
                sourceHeader={
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <MDTypography style={{ color: "#4f46e5", fontWeight: 600 }}>
                      Tenant’taki Formlar
                    </MDTypography>
                  </div>
                }
                targetHeader={
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <MDTypography style={{ color: "#4f46e5", fontWeight: 600 }}>
                      Atanan Formlar
                    </MDTypography>
                  </div>
                }
                sourceStyle={{ height: "26rem", width: "100%" }}
                targetStyle={{ height: "26rem", width: "100%" }}
              />
            </div>

            <MDBox display="flex" justifyContent="flex-end" mt={3} gap={1.5}>
              <MDButton
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setTarget([]);
                  setSource((prev) => [...prev, ...target]);
                }}
              >
                Temizle
              </MDButton>
              <MDButton variant="gradient" color="info" onClick={handleSave}>
                Kaydet
              </MDButton>
            </MDBox>
          </MDBox>
        </Card>
        <Footer />
      </MDBox>
    </DashboardLayout>
  );
}


