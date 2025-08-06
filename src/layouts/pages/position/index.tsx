import { MessageBox, MessageBoxType, ObjectPageTitle } from "@ui5/webcomponents-react";
import { ObjectPage } from "@ui5/webcomponents-react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useEffect, useState } from "react";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import DataTable from "examples/Tables/DataTable";
import Footer from "examples/Footer";
import { useNavigate } from "react-router-dom";
import CustomMessageBox from "../Components/CustomMessageBox";
import getConfiguration from "confiuration";
import { PositionListDto, PositionsApi } from "api/generated";
import { useAlert } from "../hooks/useAlert";
import { useBusy } from "../hooks/useBusy";
function PositionPage() {
  const [isQuestionMessageBoxOpen, setIsQuestionMessageBoxOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dataTableData, setDataTableData] = useState<PositionListDto[]>([]);
  const dispatchAlert = useAlert();
  const dispatchBusy = useBusy();
  const navigate = useNavigate();

  const handleCloseQuestionBox = async (action: string) => {
    if (action === "Evet") {
      //Delete
      try {
        let conf = getConfiguration();
        let api = new PositionsApi(conf);
        let response = await api.apiPositionsDelete(selectedId);
        dispatchAlert({
          message: "Pozisyon başarıyla silindi",
          type: MessageBoxType.Success,
        });
      } catch (error) {
        dispatchAlert({
          message: "Pozisyon silinemedi",
          type: MessageBoxType.Error,
        });
      }
      finally {
        fetchDataList();
        setIsQuestionMessageBoxOpen(false);
      }
    } else if (action === "İptal") {
      setIsQuestionMessageBoxOpen(false);
    }
  };

  const handleOpenQuestionBox = (id: string) => {
    setSelectedId(id);
    setIsQuestionMessageBoxOpen(true);
  };

  const fetchDataList = async () => {
    try {
      dispatchBusy({ isBusy: true }); 
      let conf = getConfiguration();
      let api = new PositionsApi(conf);
      let response = await api.apiPositionsGet();
      setDataTableData(response.data);
    } catch (error) {
      dispatchAlert({
        message: "Pozisyonlar alınamadı",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  useEffect(() => {
    fetchDataList();
  }, []);

  const columns = [
    {
      id: "company",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Şirket</div>,
      accessor: "customerName",
      key: "company",
    },
    {
      id: "name",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Pozisyon Adı</div>,
      accessor: "name",
      key: "name",
    },
    {
      id: "description",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Açıklama</div>,
      accessor: "description",
      key: "description",
    },
    {
      accessor: "actions",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>işlemler</div>,
      Cell: ({ row }: any) => (
        <MDBox mx={2}>
          <Icon
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/position/detail/${row.original.id}`)}
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
                  onClick={() => navigate(`/position/detail`)}
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
                  Yeni Pozisyon
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
                Pozisyon Yönetimi
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#7b809a",
                }}
              >
                Pozisyonları görüntüleyin, oluşturun ve dahası
              </Typography>
            </MDBox>
          </ObjectPageTitle>
        }
      >
        <Grid xs={12} lg={6} sx={{ paddingLeft: "3px" }}>
          <Card style={{ height: "650px" }}>
            <MDBox>
              <MDBox height="565px">
                <DataTable
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
      <CustomMessageBox
        isQuestionmessageBoxOpen={isQuestionMessageBoxOpen}
        handleCloseQuestionBox={handleCloseQuestionBox}
        titleText="Pozisyon Silme"
        contentText="Bu pozisyonu silmek istediğinize emin misiniz?"
        warningText={{
          text: "Bu işlem geri alınamaz.",
          color: "red",
        }}
        type="warning"
      />
      <Footer />
    </DashboardLayout>
  );
}

export default PositionPage;
