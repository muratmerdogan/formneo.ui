import { Autocomplete, Grid, Checkbox, FormControlLabel } from "@mui/material";
import {
  TicketDepartmentsApi,
  UserApi,
  UserAppDto,
  InventoryListDto,
  TicketDepartmensListDto,
  InventoryApi,
  DeviceStatus,
  DeviceType,
  DiskType,
  LicenseStatus,
  OfficeLocation,
  EnumListDto,
  EnumDto,
  LicenceList,
} from "api/generated";
import MDAvatar from "components/MDAvatar";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import getConfiguration from "confiuration";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useBusy } from "layouts/pages/hooks/useBusy";
import React, { useEffect, useState } from "react";
import { Card } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { MessageBoxType } from "@ui5/webcomponents-react";
import { useTranslation } from "react-i18next";
import { formatDate } from "layouts/pages/calendar/utils/utils";
import { useTheme } from "@mui/material/styles";
function CreateInventory() {
  const [departments, setDepartments] = useState<TicketDepartmensListDto[]>([]);
  const [selectedKullanici, setSelectedKullanici] = useState<UserAppDto>();
  const [enumsData, setEnumsData] = useState<EnumListDto[]>([]);
  const [deviceTypeOptions, setDeviceTypeOptions] = useState<EnumDto[]>([]);
  const [deviceStatusOptions, setDeviceStatusOptions] = useState<EnumDto[]>([]);
  const [diskTypeOptions, setDiskTypeOptions] = useState<EnumDto[]>([]);
  const [licencestatusOptions, setLicencestatusOptions] = useState<EnumDto[]>([]);
  const [officeLocationOptions, setOfficeLocationOptions] = useState<EnumDto[]>([]);
  const theme = useTheme();
  const [selectionKullaniciId, setSelectionKullaniciId] = useState<string>();
  const [namesOfSelected, setNamesOfSelected] = useState<string>();
  const [searchByName, setSearchByName] = useState<UserAppDto[]>([]);
  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const [inventoryData, setInventoryData] = useState<InventoryListDto>({
    assetTag: null,
    deviceName: null,
    type: undefined,
    brand: null,
    model: null,
    serialNumber: null,
    status: undefined,
    description: null,
    cpu: null,
    ram: null,
    diskType: undefined,
    diskSize: null,
    gpu: null,
    macAddress: null,
    staticIPAddress: null,
    operatingSystem: null,
    oS_LicenseStatus: undefined,
    officeLicense: null,
    userAppId: null,
    userApp: undefined,
    ticketDepartmentId: null,
    ticketDepartment: undefined,
    officeLocation: undefined,
    purchaseDate: null,
    invoiceOrVendor: null,
    warrantyEndDate: null,
    assetNumber: null,
    lastMaintenanceDate: null,
    qRorBarcode: null,
  });
  const updateDto = {
    ...inventoryData,
    id: id,
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

  const fetchInventoryData = async () => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new InventoryApi(conf);
      var data = await api.apiInventoryIdGet(id);
      console.log("envanter data: ", data.data);
      setInventoryData(data.data);

      setSelectedKullanici(data.data.userApp);
      setSelectionKullaniciId(data.data.userAppId);
    } catch (error) {
      dispatchAlert({
        message: "Envanter bilgisi getirilirken hata oluştu.",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const fetchDepartments = async () => {
    try {
      dispatchBusy({ isBusy: true });
      let conf = getConfiguration();
      let api3 = new TicketDepartmentsApi(conf);
      let response = await api3.apiTicketDepartmentsGetAllVisibleDepartmentsGet();
      setDepartments(response.data);
    } catch (error) {
      dispatchAlert({
        message: "Departmanlar getirilirken hata oluştu.",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };
  const fetchEnums = async () => {
    try {
      dispatchBusy({ isBusy: true });
      let conf = getConfiguration();
      let api = new InventoryApi(conf);
      let response = await api.apiInventoryGetEnumsGet();
      setEnumsData(response.data);
      console.log("enums", response.data);

      const deviceTypes =
        response.data.find((e: EnumListDto) => e.enumClass === "DeviceType")?.enums || [];
      setDeviceTypeOptions(deviceTypes);

      const deviceStatues =
        response.data.find((e: EnumListDto) => e.enumClass === "DeviceStatus")?.enums || [];
      setDeviceStatusOptions(deviceStatues);

      const diskTypes =
        response.data.find((e: EnumListDto) => e.enumClass === "DiskType")?.enums || [];
      setDiskTypeOptions(diskTypes);

      const licenceStatus =
        response.data.find((e: EnumListDto) => e.enumClass === "LicenseStatus")?.enums || [];
      setLicencestatusOptions(licenceStatus);

      const officeLocations =
        response.data.find((e: EnumListDto) => e.enumClass === "OfficeLocation")?.enums || [];
      setOfficeLocationOptions(officeLocations);
    } catch (error) {
      dispatchAlert({
        message: "Seçenekler getirilirken hata oluştu.",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchEnums();
  }, []);

  useEffect(() => {
    if (id) {
      fetchInventoryData();
    }
  }, [id]);

  const handleCreateInventory = async () => {
    // if (projectData.name === "" || projectData.workCompany === null) {
    //   dispatchAlert({
    //     message: "Proje adı ve müşteri alanları zorunludur.",
    //     type: MessageBoxType.Error,
    //   });
    //   return;
    // }
    try {
      dispatchBusy({ isBusy: true });

      const editedInventoryData = {
        ...inventoryData,
        // userAppId: selectedKullanici.id,
        // userApp: selectedKullanici,
      };

      var conf = getConfiguration();
      var api = new InventoryApi(conf);
      await api.apiInventoryPost(editedInventoryData);
      dispatchAlert({
        message: "Envanter eklendi",
        type: MessageBoxType.Success,
      });
      navigate("/inventory");
    } catch (error) {
      dispatchAlert({ message: error?.toString(), type: MessageBoxType.Error });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const handleUpdateInventory = async () => {
    try {
      const editedInventoryData = {
        ...updateDto,
        // userAppId: selectedKullanici.id,
        // userApp: selectedKullanici,
      };
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new InventoryApi(conf);
      await api.apiInventoryPut(editedInventoryData);
      dispatchAlert({
        message: "Envanter güncellendi",
        type: MessageBoxType.Success,
      });
      navigate("/inventory");
    } catch (error) {
      dispatchAlert({ message: error?.toString(), type: MessageBoxType.Error });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container mt={3} mx={0.4}>
        <Grid item xs={12} lg={12}>
          <Card style={{ border: "none" }}>
            <MDBox p={3}>
              <MDBox p={2}>
                <MDTypography variant="h4" gutterBottom>
                  {id ? "Envanter Düzenle" : "Envanter Oluştur"}
                </MDTypography>
              </MDBox>

              <MDBox mt={1} px={3}>
                {/* GENEL BİLGİLER */}
                <MDTypography variant="h6" gutterBottom>
                  Genel Bilgiler
                </MDTypography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Autocomplete
                      options={departments}
                      getOptionLabel={(option: any) => option.departmentText}
                      isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                      value={inventoryData?.ticketDepartment || null}
                      onChange={(
                        event: React.SyntheticEvent,
                        newValue: TicketDepartmensListDto | null
                      ) =>
                        setInventoryData({
                          ...inventoryData,
                          ticketDepartmentId: newValue?.id ?? null,
                          ticketDepartment: newValue,
                        })
                      }
                      renderInput={(params) => (
                        <MDInput {...params} label="Departman" fullWidth sx={{ mb: 3.2 }} />
                      )}
                    />

                    <MDInput
                      type="text"
                      sx={{ mb: 3.2 }}
                      value={inventoryData?.assetTag || ""}
                      label={
                        <>
                          Envanter Numarası{" "}
                          <span style={{ color: theme.palette.error.main }}>*</span>
                        </>
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInventoryData({ ...inventoryData, assetTag: e.target.value })
                      }
                      fullWidth
                    />

                    <MDInput
                      type="text"
                      sx={{ mb: 3.2 }}
                      value={inventoryData?.brand || ""}
                      label="Marka"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInventoryData({ ...inventoryData, brand: e.target.value })
                      }
                      fullWidth
                    />
                    <Autocomplete
                      options={officeLocationOptions}
                      getOptionLabel={(option: EnumDto) => option.description || ""}
                      isOptionEqualToValue={(option: EnumDto, value: EnumDto) =>
                        option.number === value.number
                      }
                      value={
                        officeLocationOptions.find(
                          (opt) => opt.number === inventoryData.officeLocation
                        ) || null
                      }
                      onChange={(event: React.SyntheticEvent, newValue: EnumDto | null) =>
                        setInventoryData({
                          ...inventoryData,
                          officeLocation: (newValue?.number as OfficeLocation) ?? null,
                        })
                      }
                      renderInput={(params) => (
                        <MDInput {...params} label="Ofis Lokasyonu" fullWidth sx={{ mb: 3.2 }} />
                      )}
                    />
                    {/* <Autocomplete
                      sx={{ mb: 3.2 }}
                      key={selectedKullanici?.id}
                      options={searchByName}
                      getOptionLabel={(option: UserAppDto) => {
                        if (typeof option === "string") return option;
                        return option?.firstName && option?.lastName
                          ? `${option.firstName} ${option.lastName}`
                          : "";
                      }}
                      value={selectedKullanici}
                      isOptionEqualToValue={(option: UserAppDto, value: UserAppDto) =>
                        option?.id === value?.id
                      }
                      onChange={(event, newValues: UserAppDto | null) => {
                        setSelectedKullanici(newValues);
                        if (newValues) {
                          setSelectionKullaniciId(newValues.id);
                          setNamesOfSelected(`${newValues.firstName} ${newValues.lastName}`);
                        } else {
                          setSelectionKullaniciId(null);
                          setNamesOfSelected("");
                        }
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
                          label=""
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
                    /> */}
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Autocomplete
                      options={deviceTypeOptions}
                      getOptionLabel={(option: EnumDto) => option.description || ""}
                      isOptionEqualToValue={(option: EnumDto, value: EnumDto) =>
                        option.number === value.number
                      }
                      value={
                        deviceTypeOptions.find((opt) => opt.number === inventoryData.type) || null
                      }
                      onChange={(event: React.SyntheticEvent, newValue: EnumDto | null) =>
                        setInventoryData({
                          ...inventoryData,
                          type: (newValue?.number as DeviceType) ?? null,
                        })
                      }
                      renderInput={(params) => (
                        <MDInput {...params} label="Cihaz Tipi" fullWidth sx={{ mb: 3.2 }} />
                      )}
                    />

                    <MDInput
                      type="text"
                      sx={{ mb: 3.2 }}
                      value={inventoryData?.deviceName || ""}
                      label={
                        <>
                          Cihaz Adı <span style={{ color: theme.palette.error.main }}>*</span>
                        </>
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInventoryData({ ...inventoryData, deviceName: e.target.value })
                      }
                      fullWidth
                    />

                    <MDInput
                      type="text"
                      sx={{ mb: 3.2 }}
                      value={inventoryData?.model || ""}
                      label="Model"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInventoryData({ ...inventoryData, model: e.target.value })
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Autocomplete
                      options={deviceStatusOptions}
                      getOptionLabel={(option: EnumDto) => option.description || ""}
                      isOptionEqualToValue={(option: EnumDto, value: EnumDto) =>
                        option.number === value.number
                      }
                      value={
                        deviceStatusOptions.find((opt) => opt.number === inventoryData.status) ||
                        null
                      }
                      onChange={(event: React.SyntheticEvent, newValue: EnumDto | null) =>
                        setInventoryData({
                          ...inventoryData,
                          status: (newValue?.number as DeviceStatus) ?? null,
                        })
                      }
                      renderInput={(params) => (
                        <MDInput {...params} label="Cihaz Durum" fullWidth sx={{ mb: 3.2 }} />
                      )}
                    />

                    <MDInput
                      type="text"
                      sx={{ mb: 3.2 }}
                      value={inventoryData?.description || ""}
                      label="Açıklama"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInventoryData({ ...inventoryData, description: e.target.value })
                      }
                      fullWidth
                    />

                    <MDInput
                      type="text"
                      sx={{ mb: 3.2 }}
                      value={inventoryData?.serialNumber || ""}
                      label="Seri Numarası"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInventoryData({ ...inventoryData, serialNumber: e.target.value })
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox mt={1} px={3}>
                <MDTypography variant="h6" gutterBottom>
                  Donanım Bilgileri
                </MDTypography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    {/* Yeni Eklenen: CPU */}
                    <MDInput
                      type="text"
                      sx={{ mb: 3.2 }}
                      value={inventoryData?.cpu || ""}
                      label="CPU"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInventoryData({ ...inventoryData, cpu: e.target.value })
                      }
                      fullWidth
                    />
                    {/* Yeni Eklenen: MAC Address */}
                    <MDInput
                      type="text"
                      sx={{ mb: 3.2 }}
                      value={inventoryData?.macAddress || ""}
                      label="MAC Adresi"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInventoryData({ ...inventoryData, macAddress: e.target.value })
                      }
                      fullWidth
                    />
                    {/* Yeni Eklenen: Disk Tipi */}
                    <Autocomplete
                      options={diskTypeOptions}
                      getOptionLabel={(option: EnumDto) => option.description || ""}
                      isOptionEqualToValue={(option: EnumDto, value: EnumDto) =>
                        option.number === value.number
                      }
                      value={
                        diskTypeOptions.find((opt) => opt.number === inventoryData.diskType) || null
                      }
                      onChange={(event: React.SyntheticEvent, newValue: EnumDto | null) =>
                        setInventoryData({
                          ...inventoryData,
                          diskType: (newValue?.number as DiskType) ?? null,
                        })
                      }
                      renderInput={(params) => (
                        <MDInput {...params} label="Disk Tipi" fullWidth sx={{ mb: 3.2 }} />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    {/* Yeni Eklenen: RAM */}
                    <MDInput
                      type="number"
                      sx={{ mb: 3.2 }}
                      value={inventoryData?.ram || ""}
                      label="RAM (GB)"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInventoryData({
                          ...inventoryData,
                          ram: parseInt(e.target.value) || null,
                        })
                      }
                      fullWidth
                    />
                    {/* Yeni Eklenen: Statik IP */}
                    <MDInput
                      type="text"
                      sx={{ mb: 3.2 }}
                      value={inventoryData?.staticIPAddress || ""}
                      label="Statik IP Adresi"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInventoryData({ ...inventoryData, staticIPAddress: e.target.value })
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    {/* Yeni Eklenen: GPU */}
                    <MDInput
                      type="text"
                      sx={{ mb: 3.2 }}
                      value={inventoryData?.gpu || ""}
                      label="GPU"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInventoryData({ ...inventoryData, gpu: e.target.value })
                      }
                      fullWidth
                    />
                    {/* Yeni Eklenen: Disk Boyutu */}
                    <MDInput
                      type="number"
                      sx={{ mb: 3.2 }}
                      value={inventoryData?.diskSize || ""}
                      label="Disk Boyutu (GB)"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInventoryData({
                          ...inventoryData,
                          diskSize: parseInt(e.target.value) || null,
                        })
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox mt={1} px={3}>
                <MDTypography variant="h6" gutterBottom>
                  Yazılım / Lisans Bilgileri
                </MDTypography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <MDInput
                      type="text"
                      sx={{ mb: 3.2 }}
                      value={inventoryData?.operatingSystem || ""}
                      label="İşletim Sistemi"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInventoryData({ ...inventoryData, operatingSystem: e.target.value })
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Autocomplete
                      options={licencestatusOptions}
                      getOptionLabel={(option: EnumDto) => option.description || ""}
                      isOptionEqualToValue={(option: EnumDto, value: EnumDto) =>
                        option.number === value.number
                      }
                      value={
                        licencestatusOptions.find(
                          (opt) => opt.number === inventoryData.oS_LicenseStatus
                        ) || null
                      }
                      onChange={(event: React.SyntheticEvent, newValue: EnumDto | null) =>
                        setInventoryData({
                          ...inventoryData,
                          oS_LicenseStatus: (newValue?.number as LicenseStatus) ?? null,
                        })
                      }
                      renderInput={(params) => (
                        <MDInput {...params} label="Lisans Durum" fullWidth sx={{ mb: 3.2 }} />
                      )}
                    />
                  </Grid>

                  {inventoryData.oS_LicenseStatus === 0 && (
                    <Grid item xs={12} sm={4}>
                      <MDInput
                        type="text"
                        sx={{ mb: 3.2 }}
                        value={inventoryData?.officeLicense || ""}
                        label="Office Lisansı"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setInventoryData({ ...inventoryData, officeLicense: e.target.value })
                        }
                        fullWidth
                      />
                    </Grid>
                  )}
                </Grid>
              </MDBox>
              <MDBox mt={1} px={3}>
                <MDTypography variant="h6" gutterBottom>
                  Satın Alma / Garanti Bilgileri
                </MDTypography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <MDInput
                      type="date"
                      placeholder=""
                      value={inventoryData?.purchaseDate || ""}
                      label="Satın Alma Tarihi"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInventoryData({ ...inventoryData, purchaseDate: e.target.value })
                      }
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <MDInput
                      type="text"
                      sx={{ mb: 3.2 }}
                      value={inventoryData?.invoiceOrVendor || ""}
                      label="Fatura Numarası"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInventoryData({ ...inventoryData, invoiceOrVendor: e.target.value })
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <MDInput
                      type="date"
                      placeholder=""
                      value={inventoryData?.warrantyEndDate || ""}
                      label="Garanti Bitiş Tarihi"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInventoryData({ ...inventoryData, warrantyEndDate: e.target.value })
                      }
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox mt={1} px={3}>
                <MDTypography variant="h6" gutterBottom>
                  Ek Alanlar
                </MDTypography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <MDInput
                      type="text"
                      sx={{ mb: 3.2 }}
                      value={inventoryData?.assetNumber || ""}
                      label="Demirbaş Numarası"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInventoryData({ ...inventoryData, assetNumber: e.target.value })
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <MDInput
                      type="date"
                      placeholder=""
                      value={inventoryData?.lastMaintenanceDate || ""}
                      label="Son Bakım Tarihi"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInventoryData({ ...inventoryData, lastMaintenanceDate: e.target.value })
                      }
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <MDInput
                      type="text"
                      sx={{ mb: 3.2 }}
                      value={inventoryData?.qRorBarcode || ""}
                      label="QR Kod / Barkod"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInventoryData({ ...inventoryData, qRorBarcode: e.target.value })
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </MDBox>
            </MDBox>
            <MDBox mt={3} mb={3} display="flex" justifyContent="flex-end" width="100%">
              <MDButton
                sx={{ mr: 3 }}
                variant="outlined"
                color="primary"
                onClick={() => navigate("/inventory")}
              >
                İptal
              </MDButton>
              <MDButton
                sx={{ mr: 3 }}
                variant="gradient"
                color="info"
                onClick={id ? handleUpdateInventory : handleCreateInventory}
              >
                Kaydet
              </MDButton>
            </MDBox>
          </Card>
        </Grid>
      </Grid>
      <MDBox mt={1} />
      <Footer />
    </DashboardLayout>
  );
}

export default CreateInventory;
