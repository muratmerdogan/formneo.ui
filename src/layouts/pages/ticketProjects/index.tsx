import { Autocomplete, Grid, Icon, Typography } from "@mui/material";
import "@ui5/webcomponents-icons/dist/add.js";
import { TicketProjectsApi, TicketProjectsListDto, WorkCompanyApi } from "api/generated";
import MDBox from "components/MDBox";
import getConfiguration from "confiuration";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { useBusy } from "layouts/pages/hooks/useBusy";
import GlobalCell from "layouts/pages/talepYonetimi/allTickets/tableData/globalCell";
import React, { useEffect, useRef, useState } from "react";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import MDTypography from "components/MDTypography";
import {
  Bar,
  Breadcrumbs,
  BreadcrumbsItem,
  MessageBoxType,
  MessageStrip,
  ObjectPage,
  ObjectPageHeader,
  ObjectPageTitle,
  ObjectStatus,
  Toolbar,
  ToolbarButton,
} from "@ui5/webcomponents-react";
import Footer from "examples/Footer";
import { useAlert } from "layouts/pages/hooks/useAlert";
import MessageBox from "layouts/pages/Components/MessageBox";
import { WorkCompanyDto } from "api/generated";
import { useTranslation } from "react-i18next";

function TicketProjects() {
  const customColors = {
    primary: "#4F46E5", // Indigo primary
    background: {
      paper: "#FFFFFF",
      light: "#F8FAFC",
    },
    text: {
      primary: "#1E293B",
      secondary: "#64748B",
    },
    border: "#E2E8F0",
  };
  const dispatchAlert = useAlert();
  const dispatchBusy = useBusy();
  const navigate = useNavigate();
  const [isQuestionMessageBoxOpen, setIsQuestionMessageBoxOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [projectsData, setProjectsData] = useState<TicketProjectsListDto[]>([]);
  const [workCompanyData, setWorkCompanyData] = useState<WorkCompanyDto[]>([]);
  const [selectedWorkCompany, setSelectedWorkCompany] = useState<WorkCompanyDto | null>(null);
  const { t } = useTranslation();

  const fetchProjectsData = async () => {
    try {
      dispatchBusy({ isBusy: true });

      //Tüm projeleri getir
      var conf = getConfiguration();
      var api = new TicketProjectsApi(conf);
      var data = await api.apiTicketProjectsGet();
      setProjectsData(data.data as any);
    } catch (error) {
      dispatchAlert({
        message: "Projeler getirilirken hata oluştu.",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };
  const fetchCompanyData = async () => {
    try {
      dispatchBusy({ isBusy: true });
      //Tüm şirketler
      var conf = getConfiguration();
      var api = new WorkCompanyApi(conf);
      var data = await api.apiWorkCompanyGetAssingListGet();
      setWorkCompanyData(data.data as any);
    } catch (error) {
      dispatchAlert({
        message: "Veriler getirilirken hata oluştu.",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  useEffect(() => {
    fetchProjectsData();
    fetchCompanyData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new TicketProjectsApi(conf);
      await api.apiTicketProjectsDelete(id);
      dispatchAlert({
        message: "Proje Silindi",
        type: MessageBoxType.Success,
      });
      fetchProjectsData();
    } catch (error) {
      console.log(error);
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const handleOpenQuestionBox = (id: string) => {
    setSelectedId(id);
    setIsQuestionMessageBoxOpen(true);
  };

  const handleCloseQuestionBox = (action: string) => {
    setIsQuestionMessageBoxOpen(false);
    if (action === "Yes") {
      handleDelete(selectedId);
    }
  };

  const columns = [
    {
      accessor: "workCompany.name",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Müşteri</div>
      ),
      Cell: ({ value, row }: any) => <GlobalCell value={value} />,
    },
    {
      accessor: "name",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Proje Tanımı</div>,
      Cell: ({ value, row }: any) => <GlobalCell value={value} />,
    },
      {
      accessor: "subProjectName",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Proje Alt Tanımı</div>,
      Cell: ({ value, row }: any) => <GlobalCell value={value} />,
    },
    {
      accessor: "isActive",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Durum</div>,
      Cell: ({ value, row }: any) => <GlobalCell value={value === true ? "Aktif" : "Pasif"} />,
    },
    {
      accessor: "createdDate",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          Oluşturulma Tarihi
        </div>
      ),
      Cell: ({ value, column, row }: any) => <GlobalCell value={value} columnName={column.id} />,
    },
    {
      accessor: "actions",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>İşlemler</div>,
      Cell: ({ row }: any) => (
        <MDBox display="flex" alignItems="center">
          <>
            <Icon
              onClick={() => navigate(`/ticketProjects/detail/${row.original.id}`)}
              sx={{ cursor: "pointer", fontSize: "24px" }}
              style={{ marginRight: "8px" }}
            >
              edit
            </Icon>
            <Icon
              sx={{ cursor: "pointer", fontSize: "24px" }}
              onClick={() => handleOpenQuestionBox(row.original.id)}
            >
              delete
            </Icon>
          </>
        </MDBox>
      ),
    },
  ];
  const handleWorkCompanyChange = async (event: any, value: WorkCompanyDto | null) => {
    setSelectedWorkCompany(value);

    if (value != null) {
      try {
        dispatchBusy({ isBusy: true });

        //Tüm projeleri getir
        var conf = getConfiguration();
        var api = new TicketProjectsApi(conf);
        var data = await api.apiTicketProjectsGet(value.id);
        setProjectsData(data.data as any);
        console.log("projeler", data.data);
      } catch (error) {
        dispatchAlert({
          message: "Projeler getirilirken hata oluştu.",
          type: MessageBoxType.Error,
        });
      } finally {
        dispatchBusy({ isBusy: false });
      }
    } else {
      try {
        dispatchBusy({ isBusy: true });

        //Tüm projeleri getir
        var conf = getConfiguration();
        var api = new TicketProjectsApi(conf);
        var data = await api.apiTicketProjectsGet();
        setProjectsData(data.data as any);
        console.log("projeler", data.data);
      } catch (error) {
        dispatchAlert({
          message: "Projeler getirilirken hata oluştu.",
          type: MessageBoxType.Error,
        });
      } finally {
        dispatchBusy({ isBusy: false });
      }
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ObjectPage
        mode="Default"
        hidePinButton
        style={{
          height: "100%",
          marginTop: "-15px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.1)",
        }}
        titleArea={
          <ObjectPageTitle
            style={{
              paddingTop: "24px",
              paddingLeft: "24px",
              paddingRight: "24px",
              backgroundColor: "#ffffff",
              cursor: "default",
            }}
            actionsBar={
              <MDBox style={{ marginTop: "15px", marginRight: "15px" }}>
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={() => navigate(`/ticketProjects/detail`)}
                  size="small"
                  startIcon={<Icon>add</Icon>}
                  sx={{
                    marginRight: "0.5rem",
                    bottom: "11px",
                    height: "2.25rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Yeni Proje
                </MDButton>
              </MDBox>
            }
          >
            <MDBox>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: "#344767",
                  marginBottom: "4px",
                }}
              >
                Proje Yönetimi
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#7b809a",
                }}
              >
                Projeleri görüntüleyin, oluşturun ve dahası
              </Typography>
            </MDBox>
          </ObjectPageTitle>
        }
      >
        <MDBox>
          <Grid container spacing={3} sx={{ p: 3 }}>
            {/* Left Column - Filters */}
            <Grid item xs={12} md={6}>
              {/* company Selection */}
              <MDBox mb={3}>
                <MDBox
                  component="label"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: customColors.text.primary,
                  }}
                >
                  Müşteri
                </MDBox>
                <Autocomplete
                  fullWidth
                  size="small"
                  options={workCompanyData}
                  getOptionLabel={(option) => option.name || ""}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <MDInput
                      {...params}
                      placeholder="Müşteri Seçiniz"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <Icon sx={{ color: customColors.text.secondary, mr: 1 }}>business</Icon>
                        ),
                      }}
                    />
                  )}
                  onChange={handleWorkCompanyChange}
                  value={selectedWorkCompany}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <Grid xs={12} lg={6} sx={{ paddingLeft: "3px" }}>
          <Card style={{ height: "660px" }}>
            <MDBox>
              <MDBox>
                <MDBox height="565px">
                  <DataTable
                    canSearch={true}
                    table={{
                      columns: columns,
                      rows: projectsData,
                    }}
                  ></DataTable>
                </MDBox>
              </MDBox>
            </MDBox>
          </Card>
        </Grid>
      </ObjectPage>
      <MessageBox
        isQuestionmessageBoxOpen={isQuestionMessageBoxOpen}
        handleCloseQuestionBox={handleCloseQuestionBox}
      />
      <Footer />
    </DashboardLayout>
  );
}

export default TicketProjects;
