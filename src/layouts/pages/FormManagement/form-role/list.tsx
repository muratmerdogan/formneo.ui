import { ObjectPage } from '@ui5/webcomponents-react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import React, { useState } from 'react'
import { ObjectPageTitle } from '@ui5/webcomponents-react';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import { Typography } from '@mui/material';
import { Icon } from '@mui/material';
import { Grid } from '@mui/material';
import { Card } from '@mui/material';
import DataTable from 'examples/Tables/DataTable';

import { useNavigate } from 'react-router-dom';
import CustomMessageBox from 'layouts/pages/Components/CustomMessageBox';
import Footer from 'examples/Footer';
import { PositionListDto } from 'api/generated';
import { useAlert } from 'layouts/pages/hooks/useAlert';
import { useBusy } from 'layouts/pages/hooks/useBusy';


function FormRoleList() {
    const navigate = useNavigate();
    const [isQuestionMessageBoxOpen, setIsQuestionMessageBoxOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [dataTableData, setDataTableData] = useState<any[]>([]);
    const dispatchAlert = useAlert();
    const dispatchBusy = useBusy();

    const handleCloseQuestionBox = async (action: string) => {
        if (action === "Sil") {
            setIsQuestionMessageBoxOpen(false);
        }
    }

    const handleOpenQuestionBox = (id: string) => {
        setIsQuestionMessageBoxOpen(true);
        setSelectedId(id);
    }

    const columns = [
        {
            id: "formRoleName",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Form Rolü Adı</div>,
      accessor: "formRoleName",
      key: "formRoleName",
    },
    // {
    //   id: "name",
    //   Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Pozisyon Adı</div>,
    //   accessor: "name",
    //   key: "name",
    // },
    // {
    //   id: "description",
    //   Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Açıklama</div>,
    //   accessor: "description",
    //   key: "description",
    // },
    {
      accessor: "actions",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>işlemler</div>,
      Cell: ({ row }: any) => (
        <MDBox mx={2}>
          <Icon
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/form-role/detail/${row.original.id}`)}
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
                onClick={() => navigate(`/form-role/detail`)}
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
                Yeni Form Rolü
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
              Form Rolü Yönetimi
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#7b809a",
              }}
            >
              Form Rolü Yönetimi
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
      titleText="Form Rolü Silme"
      contentText="Bu form rolünü silmek istediğinize emin misiniz?"
      warningText={{
        text: "Bu işlem geri alınamaz.",
        color: "red",
      }}
      type="warning"
    />
    <Footer />
  </DashboardLayout>
  )
}

export default FormRoleList;
