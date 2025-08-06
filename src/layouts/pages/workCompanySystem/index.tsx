import { MessageBoxType, ToolbarButton } from "@ui5/webcomponents-react";
import { ObjectPageTitle, Toolbar } from "@ui5/webcomponents-react";
import { ObjectPageHeader } from "@ui5/webcomponents-react";
import { ObjectPage } from "@ui5/webcomponents-react";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import DataTable from "examples/Tables/DataTable";
import Footer from "examples/Footer";
import { Card, Grid, Icon, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useBusy } from "../hooks/useBusy";
import { useAlert } from "../hooks/useAlert";
import getConfiguration from "confiuration";
import { WorkCompanyApi, WorkCompanyDto, WorkCompanySystemInfoApi } from "api/generated/api";
import GlobalCell from "../talepYonetimi/allTickets/tableData/globalCell";
import MessageBox from "../Components/MessageBox";
import MDButton from "components/MDButton";
import { useTranslation } from "react-i18next";

function WorkCompanySystem() {
  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const [dataTableData, setDataTableData] = useState<WorkCompanyDto[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [isQuestionMessageBoxOpen, setIsQuestionMessageBoxOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  const navigate = useNavigate();

  const fetchData = async () => {
    dispatchBusy({ isBusy: true });
    var conf = getConfiguration();
    var api = new WorkCompanySystemInfoApi(conf);
    var response = await api.apiWorkCompanySystemInfoGet();
    console.log("response", response.data);
    setDataTableData(response.data);
    dispatchBusy({ isBusy: false });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenQuestionBox = (id: string) => {
    setSelectedId(id);
    setIsQuestionMessageBoxOpen(true);
  };

  const handleCloseQuestionBox = (action: string) => {
    setIsQuestionMessageBoxOpen(false);
    if (action === "Yes") {
      handleDelete(selectedId);
    }
    if (action === "No") {
      alert("silinme işlemi iptal edildi");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new WorkCompanySystemInfoApi(conf);
      await api.apiWorkCompanySystemInfoIdDelete(id);
      fetchData();

      dispatchAlert({
        message: t("ns1:CompanySystemPage.SystemList.SistemSilindi"),
        type: MessageBoxType.Success,
      });
    } catch (error) {
      dispatchAlert({
        message: t("ns1:CompanySystemPage.SystemList.SistemSilmeHata"),
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const tableData = {
    columns: [
      {
        Header: (
          <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
            {t("ns1:CompanySystemPage.SystemList.SistemAdi")}
          </div>
        ),
        accessor: "name",

        Cell: ({ row, value, column }: any) => (
          <GlobalCell value={value} columnName={column.id} testRow={row.original} />
        ),
      },
      {
        Header: (
          <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
            {t("ns1:CompanySystemPage.SystemList.SirketAdi")}
          </div>
        ),
        accessor: "workCompany.name",

        Cell: ({ row, value, column }: any) => (
          <GlobalCell value={value} columnName={column.id} testRow={row.original} />
        ),
      },
      {
        accessor: "actions",

        Header: (
          <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
            {t("ns1:CompanySystemPage.SystemList.Islemler")}
          </div>
        ),
        Cell: ({ row }: any) => (
          <MDBox mx={2}>
            <Icon
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/workCompanySystem/detail/${row.original.id}`)}
              style={{ marginRight: "8px" }}
            >
              edit
            </Icon>

            <Icon sx={{ cursor: "pointer" }} onClick={() => handleOpenQuestionBox(row.original.id)}>
              delete
            </Icon>
          </MDBox>
        ),
      },
    ],
    rows: dataTableData,
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
                  onClick={() => navigate(`/workCompanySystem/detail`)}
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
                  {t("ns1:CompanySystemPage.SystemList.YeniSistem")}
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
                {t("ns1:CompanySystemPage.SystemList.SystemTitle")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#7b809a",
                }}
              >
                {t("ns1:CompanySystemPage.SystemList.SystemSubTitle")}
              </Typography>
            </MDBox>
          </ObjectPageTitle>
        }
      >
        <Grid xs={12} lg={6} sx={{ paddingLeft: "3px" }}>
          <Card style={{ height: "660px" }}>
            <MDBox>
              <MDBox height="565px">
                <DataTable
                  canSearch={true}
                  table={tableData}
                  pagination={{ variant: "gradient", color: "info" }}
                />
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

export default WorkCompanySystem;
