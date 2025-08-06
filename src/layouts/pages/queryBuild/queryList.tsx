import MDBox from "components/MDBox";
import { MessageBoxType, ObjectPage, ObjectPageTitle } from "@ui5/webcomponents-react";
import React, { useEffect, useState } from "react";
import MDButton from "components/MDButton";
import { Card, Grid, Icon } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { Typography } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { fetchTicketRuleEngineData } from "./controller/custom/apiCalls";
import { TicketRuleEngineListDto } from "api/generated/api";
import GlobalCell from "../talepYonetimi/allTickets/tableData/globalCell";
import CustomMessageBox from "../Components/CustomMessageBox";
import { useAlert } from "../hooks/useAlert";
import { useBusy } from "../hooks/useBusy";
import { useTranslation } from "react-i18next";

function QueryList() {
  const navigate = useNavigate();
  const dispatchAlert = useAlert();
  const dispatchBusy = useBusy();
  const [queryList, setQueryList] = useState<TicketRuleEngineListDto[]>([]);
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);
  const [isQuestionMessageBoxOpen, setIsQuestionMessageBoxOpen] = useState(false);
  const { t } = useTranslation();

  const columns = [
    {
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:QueryPage.QueryList.SorguAdi")}
        </div>
      ),
      accessor: "ruleName",
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "order",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:QueryPage.QueryList.SorguSirasi")}
        </div>
      ),
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "actions",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:QueryPage.QueryList.Islemler")}
        </div>
      ),
      Cell: ({ row }: any) => (
        <MDBox mx={2}>
          <Icon
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/queryBuild/detail/${row.original.id}`)}
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
  ];

  const fetchQueryList = async () => {
    const ticketRuleEngineApi = await fetchTicketRuleEngineData();
    const response = await ticketRuleEngineApi.apiTicketRuleEngineAllGet();
    setQueryList(response.data);
  };

  const handleOpenQuestionBox = (id: string) => {
    setIsQuestionMessageBoxOpen(true);
    setSelectedQueryId(id);
  };

  const handleCloseQuestionBox = async (action: string) => {
    setIsQuestionMessageBoxOpen(false);
    if (action === "Yes" || action === "Evet") {
      try {
        dispatchBusy({ isBusy: true });
        const response = await (
          await fetchTicketRuleEngineData()
        ).apiTicketRuleEngineIdDelete(selectedQueryId);
        dispatchAlert({
          message: t("ns1:QueryPage.QueryList.SorguSilindi"),
          type: MessageBoxType.Success,
        });
        setSelectedQueryId(null);
        fetchQueryList();
      } catch (error) {
        dispatchAlert({
          message: t("ns1:QueryPage.QueryList.SorguSilmeHata"),
          type: MessageBoxType.Error,
        });
      } finally {
        dispatchBusy({ isBusy: false });
      }
    }
  };

  useEffect(() => {
    fetchQueryList();
  }, []);

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
                  onClick={() => navigate(`/queryBuild/detail`)}
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
                  {t("ns1:QueryPage.QueryList.YeniSorgu")}
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
                {t("ns1:QueryPage.QueryList.QueryTitle")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#7b809a",
                }}
              >
                {t("ns1:QueryPage.QueryList.QuerySubTitle")}
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
                  table={{
                    columns: columns,
                    rows: queryList,
                  }}
                  canSearch
                />
              </MDBox>
            </MDBox>
          </Card>
        </Grid>
      </ObjectPage>
      <CustomMessageBox
        isQuestionmessageBoxOpen={isQuestionMessageBoxOpen}
        handleCloseQuestionBox={handleCloseQuestionBox}
        titleText={t("ns1:QueryPage.QueryList.Uyari")}
        contentText={t("ns1:QueryPage.QueryList.SorguSilmeUyari")}
        warningText={{
          text: t("ns1:QueryPage.QueryList.SorguSilmeGeriAlinamaz"),
          color: "#e74c3c",
        }}
        type="warning"
      />
    </DashboardLayout>
  );
}

export default QueryList;
