/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.2
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";
import { Box, Button, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";
// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import { useLocation, useNavigate } from "react-router-dom";
// Data
import dataTableData from "layouts/applications/data-tables/data/dataTableData";
import { MenuApi, MenuListDto, UserApi, UserAppDto } from "api/generated";
import { useEffect, useState } from "react";
import getConfiguration from "confiuration";
import MDButton from "components/MDButton";
import { Icon } from "@mui/material";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { useUser } from "layouts/pages/hooks/userName";
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

import DataTable from "examples/Tables/DataTable";
import { id } from "date-fns/locale";
import GlobalCell from "../talepYonetimi/allTickets/tableData/globalCell";
import { useAlert } from "../hooks/useAlert";
import MessageBox from "../Components/MessageBox";
import "@ui5/webcomponents-icons/dist/add.js";
import { useTranslation } from "react-i18next";

function MenuList(): JSX.Element {
  const navigate = useNavigate(); // Navig
  const dispatchAlert = useAlert();
  const { userAppDto } = useUser(); // Context'ten veriyi alıyoruz
  const { t } = useTranslation();
  const dispatchBusy = useBusy();
  const [dataTableData, setDataTableData] = useState<[]>([]);
  const [isQuestionMessageBoxOpen, setIsQuestionMessageBoxOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const fetchMenus = async () => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new MenuApi(conf);
      var data = await api.apiMenuAllPlainGet();
      console.log(data.data);
      setDataTableData(data.data as any);
    } catch (error) {
      dispatchAlert({
        message: t("ns1:MenuPage.MenuList.MenuleriAlirkenHata"),
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new MenuApi(conf);
      await api.apiMenuIdDelete(id);
      dispatchAlert({
        message: t("ns1:MenuPage.MenuList.MenuSilindi"),
        type: MessageBoxType.Success,
      });
      dispatchBusy({ isBusy: false });
      fetchMenus();
    } catch (error) {
      dispatchAlert({
        message: t("ns1:MenuPage.MenuList.MenuSilmeHata"),
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleAdd = () => {
    navigate("/Menudetail");
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
    if (action === "No") {
      alert("silinme işlemi iptal edildi");
    }
  };

  const columns = [
    {
      id: "order",
      name: "Sıra No",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:MenuPage.MenuList.SiraNo")}
        </div>
      ),
      accessor: "order",

      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
      sortable: true,
    },
    {
      id: "name",
      name: "Menü Adı",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:MenuPage.MenuList.EkranAdi")}
        </div>
      ),
      accessor: "name",
      selector: (row: MenuListDto) => row.name,
      Cell: ({ row, value, column }: any) => <GlobalCell value={value} columnName={column.id} />,
      sortable: true,
    },
    {
      id: "route",
      name: "Rota",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:MenuPage.MenuList.HedefAdres")}
        </div>
      ),
      accessor: "href",
      selector: (row: MenuListDto) => row.route || row.href || "",

      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      id: "showMenu",
      name: "Görünüm",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:MenuPage.MenuList.Gorunum")}
        </div>
      ),
      accessor: "showMenu",
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      id: "menuCode",
      name: "menuCode",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:MenuPage.MenuList.Kod")}
        </div>
      ),
      accessor: "menuCode",
      selector: (row: MenuListDto) => row.menuCode || "",

      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      id: "isActive",
      name: "Durum",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:MenuPage.MenuList.Durum")}
        </div>
      ),
      accessor: "isActive",
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      id: "createdAt",
      name: "Olusturma Tarihi",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:MenuPage.MenuList.OlusturmaTarihi")}
        </div>
      ),
      accessor: "createdAt",
      selector: (row: MenuListDto) => row.createdAt || "",
      width: "15%",

      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "actions",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          {t("ns1:MenuPage.MenuList.Islemler")}
        </div>
      ),
      Cell: ({ row }: any) => (
        <MDBox mx={2}>
          <Icon
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/menus/detail/${row.original.id}`)}
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
                  onClick={() => navigate(`/menus/detail`)}
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
                  {t("ns1:MenuPage.MenuList.YeniMenu")}
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
                {t("ns1:MenuPage.MenuList.MenuTitle")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#7b809a",
                }}
              >
                {t("ns1:MenuPage.MenuList.MenuSubTitle")}
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
                  table={{
                    columns: columns,
                    rows: dataTableData,
                  }}
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

export default MenuList;
