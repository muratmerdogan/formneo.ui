import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import { Card, Icon, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

type TenantFormRoleItem = {
  id: string;
  name: string;
  description?: string;
  assignedFormIds: string[];
};

export default function TenantFormRoleList(): JSX.Element {
  const navigate = useNavigate();
  const [rows, setRows] = useState<TenantFormRoleItem[]>([]);

  const storageKey = useMemo(() => {
    const tid = localStorage.getItem("selectedTenantId") || "__unknown__";
    return `mock:tenantFormRoles:${tid}`;
  }, []);

  const load = async () => {
    try {
      const { fetchTenantFormRoleList } = await import("api/tenantFormRoleService");
      const serverList = await fetchTenantFormRoleList();
      if (Array.isArray(serverList) && serverList.length > 0) {
        const mapped = serverList.map((x: any) => ({
          id: String(x.id || x.formTenantRoleId || ""),
          name: String(x.roleName || x.name || ""),
          description: String(x.roleDescription || x.description || ""),
          assignedFormIds: (x.formPermissions || []).map((p: any) => String(p.formId)).filter(Boolean),
          updatedDate: x.updatedDate,
        }));
        setRows(mapped);
        return;
      }
      // fallback: local mock
      const raw = localStorage.getItem(storageKey);
      const list: TenantFormRoleItem[] = raw ? JSON.parse(raw) : [];
      setRows(Array.isArray(list) ? list : []);
    } catch (e) {
      // on error: try local
      try {
        const raw = localStorage.getItem(storageKey);
        const list: TenantFormRoleItem[] = raw ? JSON.parse(raw) : [];
        setRows(Array.isArray(list) ? list : []);
      } catch {
        setRows([]);
      }
    }
  };

  const save = (list: TenantFormRoleItem[]) => {
    localStorage.setItem(storageKey, JSON.stringify(list));
    setRows(list);
  };

  useEffect(() => {
    load();
  }, []);

  const columns: any[] = [
    {
      accessor: "actions",
      Header: <div style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>İşlemler</div>,
      Cell: ({ row }: any) => (
        <MDBox mx={0}>
          <Tooltip title="Düzenle">
            <Icon sx={{ cursor: "pointer", mr: 1, color: "#28a745" }} onClick={() => navigate(`/tenant/form-role/detail/${row.original.id}`)}>
              edit
            </Icon>
          </Tooltip>
          <Tooltip title="Sil">
            <Icon
              sx={{ cursor: "pointer", color: "red" }}
              onClick={() => {
                const filtered = rows.filter((r) => r.id !== row.original.id);
                save(filtered);
              }}
            >
              delete
            </Icon>
          </Tooltip>
        </MDBox>
      ),
    },
    {
      accessor: "name",
      Header: <div style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>Rol Adı</div>,
    },
    {
      accessor: "description",
      Header: <div style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>Açıklama</div>,
    },
    {
      accessor: "updatedDate",
      Header: <div style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>Güncellendi</div>,
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mx={2} mt={2} mb={1}>
        <Card style={{ borderRadius: 14 }}>
          <MDBox p={3} display="flex" alignItems="center" justifyContent="space-between">
            <MDTypography variant="h5" fontWeight="medium" color="text">
              Tenant FormRol Listesi
            </MDTypography>
            <MDButton variant="gradient" color="info" onClick={() => navigate("/tenant/form-role/detail")}
              startIcon={<Icon>add</Icon>} size="small">
              Yeni
            </MDButton>
          </MDBox>
          <MDBox px={3} pb={3}>
            <DataTable
              table={{ columns, rows }}
              setItemsPerPage={() => {}}
              totalRowCount={(rows || []).length}
            />
          </MDBox>
        </Card>
        <Footer />
      </MDBox>
    </DashboardLayout>
  );
}


