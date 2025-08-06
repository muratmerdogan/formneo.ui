import { Card, CardContent, CardHeader, Grid, Icon, IconButton } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import { TabMenu } from "primereact/tabmenu";
import React, { useState } from "react";
import { historyLoginRows, historyLogonRows, loginTableRows } from "./mockData";

interface LogonLoginDetailProps {
  selectedServerId?: string;
}

function LogonLoginDetail({ selectedServerId }: LogonLoginDetailProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const tabItems = [
    {
      label: "Logon İşlem Geçmişi",
      icon: "pi pi-list",
    },
    {
      label: "Login İşlem Geçmişi",
      icon: "pi pi-list",
    },
  ];

  const loginTableColumns = [
    {
      field: "id",
      Header: <div>Id</div>,
      accessor: "id",
      width: 50,
    },
    {
      field: "ustBirim",
      Header: <div>Üst Birim</div>,
      accessor: "ustBirim",
    },
    {
      field: "title",
      Header: <div>Başlık</div>,
      accessor: "title",
    },
    {
      field: "username",
      Header: <div>Kullanıcı Adı</div>,
      accessor: "username",
    },
    {
      field: "password",
      Header: <div>Şifre</div>,
      accessor: "password",
    },
    {
      field: "ekBilgi",
      Header: <div>Ek Bilgi</div>,
      accessor: "ekBilgi",
    },
    {
      field: "action",
      Header: <div>İşlem</div>,
      accessor: "action",
      width: 100,
      Cell: ({ row }: any) => (
        <MDBox display="flex" alignItems="center">
          <>
            <Icon
              onClick={() => console.log(row.original.id)}
              sx={{ cursor: "pointer" }}
              style={{ marginRight: "8px" }}
            >
              edit
            </Icon>
            <Icon sx={{ cursor: "pointer" }} onClick={() => console.log(row.original.id)}>
              delete
            </Icon>
          </>
        </MDBox>
      ),
    },
  ];

  function logonCard() {
    return (
      <Card
        sx={{
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
          borderRadius: "16px",
          padding: "0 0 24px 0",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 24px rgba(0, 0, 0, 0.1)",
          },
          border: "1px solid #e2e8f0",
        }}
      >
        <CardHeader
          sx={{
            borderBottom: "1px solid #e2e8f0",
            padding: "16px 24px",
            backgroundColor: "#f8fafc",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            display: "flex",
            alignItems: "center",
          }}
          title={
            <MDBox display="flex" alignItems="center" gap={1}>
              <Icon sx={{ color: "text.primary" }} fontSize="small">
                settings
              </Icon>
              <MDTypography variant="h6" fontWeight="medium" color="text.primary">
                Logon Bilgisi
              </MDTypography>
            </MDBox>
          }
          action={
            <MDBox display="flex" alignItems="center">
              <IconButton
                sx={{
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  "&:hover": {
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                  },
                }}
              >
                <MDBox display="flex" alignItems="center" gap={1}>
                  <Icon sx={{ color: "text.primary" }} fontSize="small">
                    edit
                  </Icon>
                  <MDTypography variant="button" fontWeight="medium" color="text.primary">
                    Düzenle
                  </MDTypography>
                </MDBox>
              </IconButton>
            </MDBox>
          }
        />
        <CardContent
          sx={{
            padding: "24px",
          }}
        >
          <MDBox display="flex" flexDirection="column" gap={2}>
            <MDInput fullWidth label="Tanım" />
            <MDInput fullWidth label="Uygulama Sunucusu" />
            <MDInput fullWidth label="Birim Numarası" />
            <MDInput fullWidth label="Sistem Tn." />
            <MDInput fullWidth label="SAPRouter Dizilimi" />
          </MDBox>
        </CardContent>
      </Card>
    );
  }

  function loginCard() {
    return (
      <Card
        sx={{
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
          borderRadius: "16px",
          padding: "0 0 24px 0",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 24px rgba(0, 0, 0, 0.1)",
          },
          border: "1px solid #e2e8f0",
        }}
      >
        <CardHeader
          sx={{
            borderBottom: "1px solid #e2e8f0",
            padding: "16px 24px",
            backgroundColor: "#f8fafc",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            display: "flex",
            alignItems: "center",
          }}
          title={
            <MDBox display="flex" alignItems="center" gap={1}>
              <Icon sx={{ color: "text.primary" }} fontSize="small">
                login
              </Icon>
              <MDTypography variant="h6" fontWeight="medium" color="text.primary">
                Login Bilgisi
              </MDTypography>
            </MDBox>
          }
          action={
            <MDBox display="flex" alignItems="center" gap={1} mt={0.5}>
              <IconButton
                sx={{
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  "&:hover": {
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                  },
                }}
              >
                <MDBox display="flex" alignItems="center" gap={1}>
                  <Icon sx={{ cursor: "pointer" }} fontSize="small">
                    add
                  </Icon>
                  <MDTypography variant="button" fontWeight="medium" color="text.primary">
                    Yeni Ekle
                  </MDTypography>
                </MDBox>
              </IconButton>
            </MDBox>
          }
        />
        <CardContent
          sx={{
            padding: "24px",
          }}
        >
          <MDBox>
            <DataTable
              canSearch
              table={{
                columns: loginTableColumns,
                rows: loginTableRows,
              }}
            />
          </MDBox>
        </CardContent>
      </Card>
    );
  }

  function historyLogCard() {
    return (
      <Card
        sx={{
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
          borderRadius: "16px",
          padding: "0 0 24px 0",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 24px rgba(0, 0, 0, 0.1)",
          },
          border: "1px solid #e2e8f0",
        }}
      >
        <CardHeader
          sx={{
            borderBottom: "1px solid #e2e8f0",
            padding: "16px 24px",
            backgroundColor: "#f8fafc",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            display: "flex",
            alignItems: "center",
          }}
          title={
            <MDBox display="flex" alignItems="center" gap={1}>
              <Icon sx={{ color: "text.primary" }} fontSize="small">
                history
              </Icon>
              <MDTypography variant="h6" fontWeight="medium" color="text.primary">
                İşlem Geçmişi
              </MDTypography>
            </MDBox>
          }
        />
        <CardContent>
          <TabMenu
            className="custom-tab-menu"
            style={{
              border: "none",
              backgroundColor: "transparent",
              borderRadius: "8px",
            }}
            model={tabItems}
            activeIndex={activeIndex}
            onTabChange={(e: any) => setActiveIndex(e.index)}
          />
          {activeIndex === 0 && (
            <DataTable
              canSearch
              table={{
                columns: [
                  { field: "id", Header: "ID", accessor: "id", width: 50 },
                  { field: "timestamp", Header: "Timestamp", accessor: "timestamp" },
                  { field: "description", Header: "Description", accessor: "description" },
                ],
                rows: historyLogonRows,
              }}
            />
          )}
          {activeIndex === 1 && (
            <DataTable
              canSearch
              table={{
                columns: [
                  { field: "id", Header: "ID", accessor: "id", width: 50 },
                  { field: "timestamp", Header: "Timestamp", accessor: "timestamp" },
                  { field: "description", Header: "Description", accessor: "description" },
                ],
                rows: historyLoginRows,
              }}
            />
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <MDBox>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          md={6}
          lg={7}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {logonCard()}
          {loginCard()}
        </Grid>
        <Grid item xs={12} md={6} lg={5}>
          {historyLogCard()}
        </Grid>
      </Grid>
    </MDBox>
  );
}

export default LogonLoginDetail;
