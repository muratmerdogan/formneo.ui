import {
  Autocomplete,
  Grid,
  Icon,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import "@ui5/webcomponents-icons/dist/add.js";
import {
  InventoryApi,
  InventoryListDto,
  UserAppDto,
  UserApi,
  UserAppDtoOnlyNameId,
} from "api/generated";
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
import MDAvatar from "components/MDAvatar";
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

function Inventory() {
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
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [inventoryData, setInventoryData] = useState<InventoryListDto[]>([]);
  const [selectedKullanici, setSelectedKullanici] = useState<UserAppDto>();
  const [selectionKullaniciId, setSelectionKullaniciId] = useState<string>();
  const [searchByName, setSearchByName] = useState<UserAppDto[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<{
    name: string;
    type: number;
    userApp: UserAppDto;
  } | null>(null);
  const { t } = useTranslation();

  const fetchInventoryData = async () => {
    try {
      dispatchBusy({ isBusy: true });

      var conf = getConfiguration();
      var api = new InventoryApi(conf);
      var data = await api.apiInventoryGet();
      setInventoryData(data.data as any);
    } catch (error) {
      dispatchAlert({
        message: "Envanter bilgileri getirilirken hata oluştu.",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new InventoryApi(conf);
      await api.apiInventoryDelete(id);
      dispatchAlert({
        message: "Envanter Silindi",
        type: MessageBoxType.Success,
      });
      await fetchInventoryData();
    } catch (error) {
      dispatchAlert({
        message: "Envanter silinirken hata oluştu.",
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
  const handleSearchByName = async (value: string) => {
    if (value === "") {
      setSearchByName([]);
    } else {
      try {
        dispatchBusy({ isBusy: true });

        var conf = getConfiguration();
        var api = new UserApi(conf);
        var data = await api.apiUserGetAllUsersAsyncWitNameGet(value);
        var pureData = data.data;
        setSearchByName(pureData);

        dispatchBusy({ isBusy: false });
      } catch (error) {
        console.log("error", error);
      } finally {
        dispatchBusy({ isBusy: false });
      }
    }
  };
  const handleAssignInventory = async () => {
    try {
      dispatchBusy({ isBusy: true });
      console.log("selectedDeviceId", selectedDeviceId);
      console.log("selectionKullaniciId", selectionKullaniciId);
      var conf = getConfiguration();
      var api = new InventoryApi(conf);
      await api.apiInventoryAssignPut(selectedDeviceId, selectionKullaniciId);
      dispatchAlert({
        message: "Envanter ataması başarılı.",
        type: MessageBoxType.Success,
      });
      await fetchInventoryData();
    } catch (error) {
      dispatchAlert({
        message: "Envanter atanırken bir hata oluştu.",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const deviceTypeLabels: { [key: number]: string } = {
    0: "Masaüstü",
    1: "Dizüstü",
    2: "Tablet",
    3: "Diğer",
  };
  const deviceStateLabels: { [key: number]: string } = {
    0: "Aktif",
    1: "Pasif",
    2: "Tamirde",
    3: "Hurda",
  };

  const handleOpenAssignModal = async (id: string) => {
    try {
      dispatchBusy({ isBusy: true });

      var conf = getConfiguration();
      var api = new InventoryApi(conf);
      var data = await api.apiInventoryGetAssignUserGet(id);

      const device = inventoryData.find((item) => item.id === id);
      if (device) {
        setSelectedDeviceId(id);
        setSelectedDevice({
          name: device.deviceName,
          type: device.type,
          userApp: data.data,
        });
      }
      setIsAssignModalOpen(true);
    } catch (error) {
      dispatchAlert({
        message: "Atanan kişi bilgisi getirilirken bir hata oluştu.",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
    setSelectedId(null);
    setSelectedDevice({
      name: null,
      type: null,
      userApp: null,
    });
  };

  const columns = [
    {
      accessor: "assetTag",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Envanter No</div>
      ),
      Cell: ({ value, row }: any) => <GlobalCell value={value} />,
    },
    {
      accessor: "type",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Cihaz Tipi</div>
      ),
      Cell: ({ value }: any) => <GlobalCell value={deviceTypeLabels[value] || "-"} />,
    },

    {
      accessor: "deviceName",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Cihaz Adı</div>,
      Cell: ({ value, row }: any) => <GlobalCell value={value || "-"} />,
    },
    {
      accessor: "status",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Durum</div>,
      Cell: ({ value }: any) => <GlobalCell value={deviceStateLabels[value] || "-"} />,
    },
    {
      accessor: "userApp.firstName", // Bu hala gerekli, ama sadece row verisini almak için
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Atanan Kişi</div>
      ),
      Cell: ({ row }: any) => {
        const firstName = row.original.userApp?.firstName || "";
        const lastName = row.original.userApp?.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim() || "-";

        return <GlobalCell value={fullName} />;
      },
    },
    {
      accessor: "actions",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>İşlemler</div>,
      Cell: ({ row }: any) => (
        <MDBox display="flex" alignItems="center">
          <>
            <Icon
              onClick={() => handleOpenAssignModal(row.original.id)}
              sx={{ cursor: "pointer", fontSize: "24px" }}
              style={{ marginRight: "8px" }}
            >
              person_add
            </Icon>
            <Icon
              onClick={() => navigate(`/inventory/detail/${row.original.id}`)}
              sx={{ cursor: "pointer", fontSize: "24px" }}
              style={{ marginRight: "8px" }}
            >
              edit
            </Icon>
            <Icon
              onClick={() => handleOpenQuestionBox(row.original.id)}
              sx={{ cursor: "pointer", fontSize: "24px" }}
            >
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
                  onClick={() => navigate(`/inventory/detail`)}
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
                  Yeni Envanter
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
                Envanter Yönetimi
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#7b809a",
                }}
              >
                Envanteri görüntüleyin, oluşturun ve dahası
              </Typography>
            </MDBox>
          </ObjectPageTitle>
        }
      >
        <Grid xs={12} lg={6} sx={{ paddingLeft: "3px" }}>
          <Card style={{ height: "660px" }}>
            <MDBox>
              <MDBox>
                <MDBox height="565px">
                  <DataTable
                    canSearch={true}
                    table={{
                      columns: columns,
                      rows: inventoryData,
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
      <Dialog open={isAssignModalOpen} onClose={handleCloseAssignModal} fullWidth maxWidth="md">
        <DialogTitle>Atama Yap</DialogTitle>
        <DialogContent>
          <MDBox>
            <Grid container mt={3} mx={0.4}>
              <Grid item xs={12} sm={6}>
                <MDBox display="flex" alignItems="center">
                  <MDTypography variant="body2" fontWeight="bold" mr={1}>
                    Cihaz Tipi:
                  </MDTypography>
                  <MDTypography variant="body2">
                    {selectedDevice?.type !== undefined
                      ? deviceTypeLabels[selectedDevice.type]
                      : "-"}
                  </MDTypography>
                </MDBox>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDBox display="flex" alignItems="center">
                  <MDTypography variant="body2" fontWeight="bold" mr={1}>
                    Cihaz Adı:
                  </MDTypography>
                  <MDTypography variant="body2">{selectedDevice?.name || "-"}</MDTypography>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
          <MDBox sx={{ mt: 3.2 }}>
            <Autocomplete
              options={searchByName}
              getOptionLabel={(option: UserAppDto) => `${option.firstName} ${option.lastName}`}
              value={selectedDevice?.userApp || null}
              isOptionEqualToValue={(option: UserAppDto, value: UserAppDto) =>
                option?.id === value?.id
              }
              onChange={(event, newValue: UserAppDto | null) => {
                if (selectedDevice) {
                  setSelectedDevice({
                    ...selectedDevice,
                    userApp: newValue,
                  });
                }
                setSelectedKullanici(newValue);
                setSelectionKullaniciId(newValue?.id ?? "");
              }}
              onInputChange={(event, newInputValue) => {
                handleSearchByName(newInputValue);
              }}
              renderInput={(params) => (
                <MDInput
                  {...params}
                  size="large"
                  InputLabelProps={{ shrink: true }}
                  placeholder={t("ns1:DepartmentPage.DepartmentDetail.IsimAratin")}
                  label="Atanan Kişi"
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.id} style={{ listStyle: "none" }}>
                  <MDBox
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      py: 1,
                      mb: 1,
                      mx: 1,
                      cursor: "pointer",
                    }}
                  >
                    <MDBox mr={2}>
                      <MDAvatar
                        src={`data:image/png;base64,${option.photo}`}
                        alt={option.firstName}
                        shadow="md"
                      />
                    </MDBox>
                    <MDBox
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-start"
                      justifyContent="center"
                    >
                      <MDTypography variant="button" fontWeight="medium">
                        {option.firstName} {option.lastName}
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        {option.email}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </li>
              )}
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseAssignModal}>İptal</MDButton>
          <MDButton
            onClick={() => {
              handleAssignInventory();
              handleCloseAssignModal();
            }}
            variant="contained"
            color="info"
          >
            Kaydet
          </MDButton>
        </DialogActions>
      </Dialog>
      <Footer />
    </DashboardLayout>
  );
}

export default Inventory;
