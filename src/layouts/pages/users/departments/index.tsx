import { Autocomplete, Grid, Icon, Typography } from "@mui/material";
import "@ui5/webcomponents-icons/dist/add.js";
import { TicketDepartmentsApi, WorkCompanyApi } from "api/generated";
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

function Departmens() {
  // Define custom colors
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
  const [departmanData, setDepartmanData] = useState<[]>([]);
  const dispatchAlert = useAlert();
  const dispatchBusy = useBusy();
  const navigate = useNavigate();
  const [isQuestionMessageBoxOpen, setIsQuestionMessageBoxOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [workCompanyData, setWorkCompanyData] = useState<WorkCompanyDto[]>([]);
  const [selectedWorkCompany, setSelectedWorkCompany] = useState<WorkCompanyDto | null>(null);
  const { t } = useTranslation();

  const fetchData = async () => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new TicketDepartmentsApi(conf);
      var data = await api.apiTicketDepartmentsGet();
      setDepartmanData(data.data as any);

      var api2 = new WorkCompanyApi(conf);
      var data2 = await api2.apiWorkCompanyGet();
      setWorkCompanyData(data2.data as any);

      dispatchBusy({ isBusy: false });
    } catch (error) {
      dispatchAlert({
        message: t("ns1:DepartmentPage.DepartmentList.DepartmanListesiHata"),
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new TicketDepartmentsApi(conf);
      await api.apiTicketDepartmentsIdDelete(id);
      dispatchAlert({
        message: t("ns1:DepartmentPage.DepartmentList.DepartmanSilindi"),
        type: MessageBoxType.Success,
      });
      dispatchBusy({ isBusy: false });
      fetchData();
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
      accessor: "departmentText",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:DepartmentPage.DepartmentList.DepartmanAdi")}
        </div>
      ),
      Cell: ({ value, row }: any) => <GlobalCell value={value} />,
    },
    {
      accessor: "workCompany.name",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:DepartmentPage.DepartmentList.SirketAdi")}
        </div>
      ),
      Cell: ({ value, row }: any) => <GlobalCell value={value} />,
    },
    {
      accessor: "deparmentCode",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:DepartmentPage.DepartmentList.DepartmanKodu")}
        </div>
      ),
      Cell: ({ value, row }: any) => <GlobalCell value={value} />,
    },
    {
      accessor: "isActive",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:DepartmentPage.DepartmentList.Durum")}
        </div>
      ),
      Cell: ({ value, column, row }: any) => <GlobalCell value={value} columnName={column.id} />,
    },
    {
      accessor: "manager",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:DepartmentPage.DepartmentList.Yonetici")}
        </div>
      ),
      Cell: ({ value }: any) => (
        <GlobalCell value={value ? `${value.firstName} ${value.lastName}` : ""} />
      ),
    },
    {
      accessor: "actions",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:DepartmentPage.DepartmentList.Islemler")}
        </div>
      ),
      Cell: ({ row }: any) => (
        <MDBox display="flex" alignItems="center">
          <>
            <Icon
              onClick={() => navigate(`/departments/detail/${row.original.id}`)}
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

        let conf = getConfiguration();
        let api = new TicketDepartmentsApi(conf);
        let response = await api.apiTicketDepartmentsAllFilteredCompanyGet(value.id.toString());
        setDepartmanData(response.data as any);
      } catch (error) {
        console.error("Error fetching departments data:", error);
        dispatchAlert({
          message: t("ns1:DepartmentPage.DepartmentList.DepartmanListesiHata"),
          type: MessageBoxType.Error,
        });
      } finally {
        dispatchBusy({ isBusy: false });
      }
    } else {
      try {
        dispatchBusy({ isBusy: true });
        var conf = getConfiguration();
        var api = new TicketDepartmentsApi(conf);
        var data = await api.apiTicketDepartmentsGet();
        setDepartmanData(data.data as any);
      } catch (error) {
        console.error("Error fetching departments data:", error);
        dispatchAlert({
          message: t("ns1:DepartmentPage.DepartmentList.DepartmanListesiHata"),
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
                  onClick={() => navigate(`/departments/detail`)}
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
                  {t("ns1:DepartmentPage.DepartmentList.YeniDepartman")}
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
                {t("ns1:DepartmentPage.DepartmentList.DepartmentTitle")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#7b809a",
                }}
              >
                {t("ns1:DepartmentPage.DepartmentList.DepartmentSubTitle")}
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
                  {t("ns1:DepartmentPage.DepartmentList.Sirket")}
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
                      placeholder={t("ns1:DepartmentPage.DepartmentList.SirketSecin")}
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
                      rows: departmanData,
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

export default Departmens;
