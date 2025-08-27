import { Card, Grid, Icon, Typography } from "@mui/material";
import {
  Toolbar,
  ObjectPageTitle,
  ToolbarButton,
  ObjectPageHeader,
  MessageBoxType,
} from "@ui5/webcomponents-react";
import MessageBox from "layouts/pages/Components/MessageBox";
import { ObjectPage } from "@ui5/webcomponents-react";
import { FormDataApi } from "api/generated";
import MDBox from "components/MDBox";
import getConfiguration from "confiuration";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import GlobalCell from "layouts/pages/talepYonetimi/allTickets/tableData/globalCell";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { useAlert } from "layouts/pages/hooks/useAlert";
import MDButton from "components/MDButton";

function ListForm() {
  const navigate = useNavigate();
  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const [dataTableData, setDataTableData] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [isQuestionMessageBoxOpen, setIsQuestionMessageBoxOpen] = useState(false);

  const fetchData = async () => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new FormDataApi(conf);
      var data = await api.apiFormDataGet();
      console.log("formList>>", data.data);
      setDataTableData(data.data);
    } catch (error) {
      dispatchAlert({
        message: "Bir hata oluştu",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
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
      var api = new FormDataApi(conf);
      await api.apiFormDataIdDelete(id);
      fetchData();
      dispatchAlert({
        message: "Form başarıyla silindi",
        type: MessageBoxType.Success,
      });
    } catch (error) {
      dispatchAlert({
        message: "Bir hata oluştu",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const handlePreview = (id: string) => {
    navigate("/forms/view/" + id);

  };
  const handleData = (id: string) => {
    navigate("/formList/" + id);

  };

  const columns = [
    {
      id: "formName",
      name: "Form Adı",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Form Adı</div>,
      accessor: "formName",


      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
      sortable: true,
    },
    {
      id: "createdAt",
      name: "Oluşturulma Tarihi",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Oluşturulma Tarihi</div>,
      accessor: "createdDate",


      Cell: ({ row, value, column }: any) => <GlobalCell value={value} columnName={column.id} />,
      sortable: true,
    },
    {
      id: "isActive",
      name: "Durum",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Durum</div>,
      accessor: "isActive",


      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value == 1 ? true : false} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      id: "revision",
      name: "Revizyon",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Revizyon</div>,
      accessor: "revision",
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),

    },
    // {
    //   id: "formDesign",
    //   name: "Form Tasarımı",
    //   Header: "Form Tasarımı",
    //   accessor: "formDesign",
    //   Cell: ({ row, value, column }: any) => (
    //     <GlobalCell value={value} columnName={column.id} testRow={row.original} />
    //   ),
    // },
    {
      accessor: "actions",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>İşlemler</div>,
      Cell: ({ row }: any) => (
        <MDBox mx={2}>
          <Icon sx={{ cursor: "pointer", marginRight: '2px' }} onClick={() => handleOpenQuestionBox(row.original.id)}>
            delete
          </Icon>
          <Icon
            sx={{ cursor: "pointer" }}
            onClick={() => handleData(row.original.id)}
            style={{ marginRight: "8px", color: "#28a745" }}
          >
            storage
          </Icon>
          <Icon
            sx={{ cursor: "pointer" }}
            onClick={() => handlePreview(row.original.id)}
            style={{ marginRight: "8px", color: "#28a745" }}
          >
            visibility
          </Icon>
          <Icon
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/forms/detail/${row.original.id}`)}
            style={{ marginRight: "8px" }}
            hidden={!row.original.canEdit}
          >
            edit
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
                  onClick={() => navigate(`/parameters/detail`)}
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
                  Yeni Parametre
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
                Form Tasarımı
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#7b809a",
                }}
              >
                Formları görüntüleyin, oluşturun ve dahası
              </Typography>
            </MDBox>
          </ObjectPageTitle>
        }
      >
        <Grid xs={12} lg={6} sx={{ paddingLeft: "3px" }}>
          <Card>
            <MDBox>
              <MDBox height="655px">
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

export default ListForm;
