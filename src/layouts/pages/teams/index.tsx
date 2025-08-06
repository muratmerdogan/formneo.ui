import { Autocomplete, Grid, Icon, Typography } from "@mui/material";
import "@ui5/webcomponents-icons/dist/add.js";
// import { TicketDepartmentsApi } from "api/generated";
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
import { TicketTeamApi } from "api/generated";
import { useTranslation } from "react-i18next";

function Departmens() {
  const [departmanData, setDepartmanData] = useState<[]>([]);
  const dispatchAlert = useAlert();
  const dispatchBusy = useBusy();
  const navigate = useNavigate();
  const [isQuestionMessageBoxOpen, setIsQuestionMessageBoxOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const { t } = useTranslation();

  const fetchData = async () => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new TicketTeamApi(conf);
      var data = await api.apiTicketTeamWithoutTeamGet();
      console.log("data", data.data);
      setDepartmanData(data.data as any);
      dispatchBusy({ isBusy: false });
    } catch (error) {
      dispatchAlert({
        message: t("ns1:TeamPage.TeamList.EkipListesiHata"),
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
      var api = new TicketTeamApi(conf);
      await api.apiTicketTeamIdDelete(id);
      dispatchAlert({
        message: t("ns1:TeamPage.TeamList.TakimSilindi"),
        type: MessageBoxType.Success,
      });
      dispatchBusy({ isBusy: false });
      fetchData();
    } catch (error) {
      dispatchAlert({
        message: t("ns1:TeamPage.TeamList.HataOlustu"),
        type: MessageBoxType.Error,
      });
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
      accessor: "name",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:TeamPage.TeamList.TakimAdi")}
        </div>
      ),
      Cell: ({ value, row }: any) => <GlobalCell value={value} />,
    },
    {
      accessor: "department.departmentText",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:TeamPage.TeamList.Departman")}
        </div>
      ),
      Cell: ({ value, row }: any) => <GlobalCell value={value} />,
    },

    {
      accessor: "workCompany.name",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:TeamPage.TeamList.Sirket")}
        </div>
      ),
      Cell: ({ value, row }: any) => <GlobalCell value={value} />,
    },
    {
      accessor: "manager",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:TeamPage.TeamList.Yonetici")}
        </div>
      ),
      Cell: ({ value, row }: any) => (
        <GlobalCell value={value ? `${value.firstName} ${value.lastName}` : ""} />
      ),
    },
    {
      accessor: "actions",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:TeamPage.TeamList.Islemler")}
        </div>
      ),
      Cell: ({ row }: any) => (
        <MDBox display="flex" alignItems="center">
          <>
            <Icon
              onClick={() => navigate(`/teams/createTeam/${row.original.id}`)}
              sx={{ cursor: "pointer" }}
              style={{ marginRight: "8px" }}
            >
              edit
            </Icon>
            <Icon sx={{ cursor: "pointer" }} onClick={() => handleOpenQuestionBox(row.original.id)}>
              delete
            </Icon>
          </>
        </MDBox>
      ),
    },
  ];

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
                  onClick={() => navigate(`/teams/createTeam`)}
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
                  {t("ns1:TeamPage.TeamList.YeniTakim")}
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
                {t("ns1:TeamPage.TeamList.TeamTitle")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#7b809a",
                }}
              >
                {t("ns1:TeamPage.TeamList.TeamSubTitle")}
              </Typography>
            </MDBox>
          </ObjectPageTitle>
        }
      >
        <Grid xs={12} lg={6} sx={{ paddingLeft: "3px", marginTop: "5px" }}>
          <Card>
            <MDBox>
              <MDBox>
                <MDBox height="100%" padding="1rem" minHeight="60vh">
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
