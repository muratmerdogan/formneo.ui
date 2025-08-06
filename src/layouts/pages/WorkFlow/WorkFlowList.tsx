//https://sdk.openui5.org/test-resources/sap/m/demokit/iconExplorer/webapp/index.html#/overview/SAP-icons/?tab=grid&icon=add&search=Add
import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "@ui5/webcomponents-icons/dist/decline";
import "@ui5/webcomponents-icons/dist/add";
import { useNavigate } from "react-router-dom";
import "@ui5/webcomponents-icons/dist/save";
import "@ui5/webcomponents-icons/dist/delete";
import { useForm, Controller } from "react-hook-form";
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme";
import {
  Card,
  MessageStrip,
  ObjectPage,
  ObjectPageHeader,
  ObjectPageSection,
  ObjectPageSubSection,
  ObjectPageTitle,
  Toolbar,
  ToolbarButton,
  VerticalAlign,
} from "@ui5/webcomponents-react";
import { Text } from "@ui5/webcomponents-react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import {
  BudgetPeriodApi,
  BudgetPeriodInsertDto,
  BudgetPeriodListDto,
  BudgetPeriodUpdateDto,
  Configuration,
  WorkFlowDefinationApi,
  WorkFlowDefinationListDto,
} from "api/generated";
import { AxiosResponse } from "axios";
import { format, parseISO } from "date-fns";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import FilterTableMethod from "../talepYonetimi/components";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import GlobalCell from "../talepYonetimi/allTickets/tableData/globalCell";
import { Icon, Typography } from "@mui/material";
import MDButton from "components/MDButton";
import Footer from "examples/Footer";
import getConfiguration from "confiuration";
// setTheme("sap_horizon");
setTheme("sap_fiori_3");
// setTheme("sap_belize");
function WorkFlowList() {
  const navigate = useNavigate();
  const [gridData, setGridData] = useState<WorkFlowDefinationListDto[]>([]);

  const configuration = getConfiguration();

  useEffect(() => {
    getData();
  }, []); //
  async function getData() {
    var conf = getConfiguration();
    var api = new WorkFlowDefinationApi(conf);
    var data = await api.apiWorkFlowDefinationGet();
    setGridData(data.data);
  }
  function onNew(obj: any): void {
    navigate("/CreateWorkFlow");
  }
  function onDelete(obj: any): void { }
  function onEdit(obj: any): void {
    navigate("/CreateWorkFlow?id=" + obj.cell.row.original.id);
  }
  const tableData = {
    columns: [
      {
        Header: (
          <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>İş Akışı Kodu</div>
        ),
        accessor: "id",

        Cell: ({ row, value, column }: any) => (
          <GlobalCell value={value} columnName={column.id} testRow={row.original} />
        ),
      },

      {
        Header: (
          <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>İş Akışı Adı</div>
        ),
        accessor: "workflowName",

        Cell: ({ row, value, column }: any) => (
          <GlobalCell value={value} columnName={column.id} testRow={row.original} />
        ),
      },

      {
        accessor: "actions",
        Header: (
          <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>işlemler</div>
        ),
        Cell: ({ row }: any) => (
          <MDBox mx={2}>
            <Icon
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/WorkFlowList/detail/${row.original.id}`)}
              style={{ marginRight: "8px" }}
            >
              edit
            </Icon>

            <Icon sx={{ cursor: "pointer" }} onClick={() => onEdit(row.original.id)}>
              delete
            </Icon>
          </MDBox>
        ),
      },
    ],
    rows: gridData,
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
                  onClick={() => navigate(`/WorkFlowList/detail`)}
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
                  Yeni Onay Akışı
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
                Onay Akışı Yönetimi
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#7b809a",
                }}
              >
                Onay Akışlarını görüntüleyin, oluşturun ve dahası
              </Typography>
            </MDBox>
          </ObjectPageTitle>
        }
      >
        <Card>
          <MDBox paddingTop={3} height="525px">
            <DataTable canSearch={true} table={tableData}></DataTable>
          </MDBox>
        </Card>
      </ObjectPage>
      <Footer />
    </DashboardLayout>
  );
}
export default WorkFlowList;
