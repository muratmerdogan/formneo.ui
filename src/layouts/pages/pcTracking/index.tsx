import {
  Autocomplete,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Icon,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Button,
  Box,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import getConfiguration from "confiuration";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import MDDatePicker from "components/MDDatePicker";
import MDInput from "components/MDInput";
import {
  UserApi,
  UserAppDto,
  TicketProjectsApi,
  UserAppDtoOnlyNameId,
  PCTrackingApi,
  PcTrackGraphicDto,
  TicketDepartmentsApi,
  TicketDepartmensListDto,
} from "api/generated";
import { MessageBoxType } from "@ui5/webcomponents-react";
import MDAvatar from "components/MDAvatar";
import { useTranslation } from "react-i18next";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import { TabMenu } from "primereact/tabmenu";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface GroupedUserData {
  user: UserAppDto;
  logins: PcTrackGraphicDto[];
}

function PCTrackingManagement() {
  // State for the selected user and user data
  const [selectedUser, setSelectedUser] = useState<UserAppDto[]>([]);
  const [userData, setUserData] = useState<UserAppDto[]>([]);
  const [departments, setDepartments] = useState<TicketDepartmensListDto[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<TicketDepartmensListDto>();
  // State for the selected date and hour range
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedEndDate, setSelectedEndDate] = useState<string>("");
  const [hourRange, setHourRange] = useState([9, 18]);
  const [isAllUserSelected, setIsAllUserSelected] = useState(false);
  // State for the PC Data
  const [pcData, setPcData] = useState<GroupedUserData[]>([]);
  // State for showing only first data entry for each user
  const [showOnlyFirstData, setShowOnlyFirstData] = useState(false);
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  // Filtered data based on showOnlyFirstData state
  const [filteredPcData, setFilteredPcData] = useState<GroupedUserData[]>([]);
  const [filteredSessionData, setFilteredSessionData] = useState<GroupedUserData[]>([]);
  const [filteredTableData, setFilteredTableData] = useState<GroupedUserData[]>([]);

  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const { t } = useTranslation();

  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    { label: "Tablo Şeklinde Göster", icon: "pi pi-table", className: "custom-tab-item", },
    {
      label: "Liste Şeklinde Göster", icon: "pi pi-list"
      , className: "custom-tab-item",
    },
    // { label: "Grid Şeklinde Göster", icon: "pi pi-server", className: "custom-tab-item", },
    
  ];

  const fetchPcData = async (isAllUser: boolean = false) => {
    if (
      !isAllUser &&
      (selectedUser.length === 0 ||
        selectedUser.length === undefined ||
        selectedUser.length === null)
    ) {
      dispatchAlert({
        message: "Lütfen kullanıcı seçiniz",
        type: MessageBoxType.Error,
      });
      setPcData([]);
      setFilteredPcData([]);
      return;
    }

    if (!selectedDate) {
      dispatchAlert({
        message: "Lütfen tarih seçiniz",
        type: MessageBoxType.Error,
      });
      return;
    }
    try {
      dispatchBusy({ isBusy: true });
      let config = getConfiguration();
      let api = new PCTrackingApi(config);
      //format date to yyyy-mm-dd
      let formattedStartDate = selectedDate.split(".").reverse().join("-");
      let formattedEndDate = selectedEndDate.split(".").reverse().join("-");
      let response;
      if (isAllUser) {
        response = await api.apiPCTrackingGetByUserGet(
          null,
          formattedStartDate,
          formattedEndDate,
          hourRange[0],
          hourRange[1] - 3,
          true
        );
        console.log("response", response.data);
      } else {
        response = await api.apiPCTrackingGetByUserGet(
          selectedUser?.map((user) => user.id.toString()),
          formattedStartDate,
          formattedEndDate,
          hourRange[0],
          hourRange[1] - 3
        );
        console.log("response", response.data);
      }
      const groupedDataByUser: GroupedUserData[] = response.data.reduce(
        (acc: GroupedUserData[], item: PcTrackGraphicDto) => {
          const userId = item.user.id;

          const existingUserIndex = acc.findIndex((user) => user.user.id === userId);
          if (existingUserIndex !== -1) {
            acc[existingUserIndex].logins.push(item);
          } else {
            // Yeni kullanıcı oluştur
            acc.push({
              user: {
                id: item.user.id,
                firstName: item.user.firstName,
                lastName: item.user.lastName,
                userName: item.user.userName,
              },
              logins: [item],
            });
          }

          return acc;
        },
        []
      );

      console.log("transformedDataByUser", groupedDataByUser);
      setPcData(groupedDataByUser);

      const filteredActiveData = groupedDataByUser.map((userData: GroupedUserData) => ({
        ...userData,
        logins: userData.logins.filter((login: PcTrackGraphicDto) => login.loginType !== 5),
      }));
      console.log("filteredActiveData", filteredActiveData);
      setFilteredSessionData(filteredActiveData);
      setFilteredTableData(filteredActiveData);
      setFilteredPcData(
        filteredActiveData
      );
      setShowOnlyActive(true); // çünkü veriler ilk başta filtreli gelicek

    } catch (error) {
      setPcData([]);
      setFilteredPcData([]);
      dispatchAlert({
        message: `${error} `,
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };


  const handleToggleFirstData = () => {
    const newShowOnlyFirstData = !showOnlyFirstData;
    setShowOnlyFirstData(newShowOnlyFirstData);

    if (newShowOnlyFirstData) {
      const firstDataOnly = pcData.map((userData: GroupedUserData) => ({
        ...userData,
        logins: userData.logins.length > 0 ? [userData.logins[0]] : [],
      }));
      setFilteredPcData(firstDataOnly);
    } else {
      setFilteredPcData(pcData);
    }
  };

  const handleToggleActive = () => {
    const newShowOnlyActive = !showOnlyActive;
    setShowOnlyActive(newShowOnlyActive);

    if (newShowOnlyActive) {
      const filteredActiveData = pcData.map((userData: GroupedUserData) => ({
        ...userData,
        logins: userData.logins.filter((login: PcTrackGraphicDto) => login.loginType !== 5),
      }));
      setFilteredPcData(filteredActiveData);
    } else {
      setFilteredPcData(pcData);
    }
  };

  useEffect(() => {
    const fetchDepartmentsData = async () => {
      if (departments.length > 0) return;
      try {
        dispatchBusy({ isBusy: true });
        let config = getConfiguration();
        let api = new TicketDepartmentsApi(config);
        let response = await api.apiTicketDepartmentsGetOnlyVesaDepartmentsGet();

        setDepartments(response.data);
      } catch (error) {
        console.log("error", error);
      } finally {
        dispatchBusy({ isBusy: false });
      }
    };
    fetchDepartmentsData();
  }, []);

  useEffect(() => {
    const fetchUsersData = async () => {
      if (!selectedDepartment) {
        setUserData([]);
        return;
      }
      if (selectedDepartment) {
        setUserData([]);
      }
      if (selectedDepartment && selectedUser) {
        setSelectedUser([]);
      }
      try {
        dispatchBusy({ isBusy: true });
        let config = getConfiguration();
        let api = new UserApi(config);
        let response = await api.apiUserVesaUsersWithoutPhotoGet(
          selectedDepartment.id
        );
        console.log("response", response.data);
        setUserData(response.data);
      } catch (error) {
        console.log("error", error);
      } finally {
        dispatchBusy({ isBusy: false });
      }
    };
    fetchUsersData();
  }, [selectedDepartment]);

  useEffect(() => {
    console.log("isAllUserSelected", isAllUserSelected);
    if (isAllUserSelected) {
      setSelectedDepartment(null);
      setSelectedUser([]);
      setUserData([]);
    }
  }, [isAllUserSelected]);



  // Handle hour range change
  const handleHourRangeChange = (event: Event, newValue: number | number[]) => {
    setHourRange(newValue as number[]);
  };

  const getPCStatus = (loginType: number) => {
    if (loginType === 2) {
      return { label: "Açıldı", color: "info", icon: "computer" };
    } else if (loginType === 5) {
      return { label: "Aktif", color: "success", icon: "check_circle" };
    } else if (loginType === 7) {
      return { label: "Kilit Açıldı", color: "warning", icon: "lock_open" };
    } else if (loginType === 11) {
      return { label: "Önbellekli Giriş", color: "secondary", icon: "vpn_key" };
    } else {
      return { label: "Bilinmiyor", color: "default", icon: "help" };
    }
  };

  // Handle fetch button click
  const handleFetchData = () => {
    if (isAllUserSelected) {
      fetchPcData(true);
    } else {
      fetchPcData();
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <MDBox mb={3}>
          <Card
            sx={{
              py: 2,
              px: 2,
            }}
          >
            <MDBox>
              <MDTypography variant="h5">Bilgisayar Takip Paneli</MDTypography>
            </MDBox>
          </Card>
        </MDBox>
        <MDBox mb={3}>
          <Card>
            <MDBox p={3}>
              <MDTypography variant="h6" gutterBottom>
                Filtreler
                <MDTypography variant="button" color="text" fontWeight="regular" ml={1}>
                  (Aktiflik durumu default olarak fitrelenmiş gelecektir)
                </MDTypography>
              </MDTypography>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <MDBox >
                    {!isAllUserSelected && (
                      <MDBox >
                        <MDBox mt={9}>
                          <MDTypography variant="body2" color="text" mb={1}>
                            Departman
                          </MDTypography>
                          <Autocomplete
                            key={selectedDepartment?.id}
                            options={departments}
                            getOptionLabel={(option: TicketDepartmensListDto) => {
                              return option?.departmentText || "";
                            }}
                            sx={{
                              mb: 2,
                            }}
                            value={selectedDepartment}
                            isOptionEqualToValue={(
                              option: TicketDepartmensListDto,
                              value: TicketDepartmensListDto
                            ) => option?.id === value?.id}
                            onChange={(event, newValues: TicketDepartmensListDto | null) => {
                              if (newValues) {
                                setSelectedDepartment(newValues);
                              } else {
                                setSelectedDepartment(null);
                              }
                            }}
                            renderInput={(params) => (
                              <MDInput
                                {...params}
                                inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                              />
                            )}
                          />
                        </MDBox>
                        <MDBox>
                          <MDTypography variant="body2" color="text" mb={1}>
                            Kullanıcı/Kullancılar
                          </MDTypography>

                          <Autocomplete
                            key={selectedUser?.length}
                            options={userData}
                            getOptionLabel={(option: UserAppDto) => {
                              return `${option?.firstName} ${option?.lastName}` || "";
                            }}
                            multiple={true}
                            value={selectedUser}
                            isOptionEqualToValue={(option: UserAppDto, value: UserAppDto) =>
                              option?.id === value?.id
                            }
                            onChange={(event, newValues: UserAppDto[] | null) => {
                              if (newValues) {
                                setSelectedUser(newValues);
                              } else {
                                setSelectedUser([]);
                              }
                            }}
                            renderInput={(params) => (
                              <MDInput
                                {...params}
                                inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                              />
                            )}
                            renderOption={(props, option) => (
                              <li
                                {...props}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "flex-start",
                                  flexDirection: "column",
                                  gap: "10px",
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                                  padding: "10px",
                                  cursor: "pointer",
                                }}
                              >
                                <MDBox sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                                  <Icon sx={{ mt: 0.5 }}>person</Icon>
                                  <MDTypography
                                    variant="button"
                                    color="text"
                                    fontWeight="regular"
                                    sx={{ alignSelf: "flex-start" }}
                                  >
                                    {option?.firstName} {option?.lastName}
                                  </MDTypography>
                                </MDBox>
                                <MDBox sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                                  <Icon sx={{ mt: 0.5 }}>mail</Icon>

                                  <MDTypography
                                    variant="button"
                                    color="text"
                                    fontWeight="regular"
                                    sx={{ alignSelf: "flex-start" }}
                                  >
                                    {option?.userName}
                                  </MDTypography>
                                </MDBox>
                              </li>
                            )}
                          />
                        </MDBox>
                      </MDBox>
                    )}

                    <MDBox mt={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isAllUserSelected}
                            onChange={() => setIsAllUserSelected(!isAllUserSelected)}
                          />
                        }
                        label="Tüm Vesa'yı Getir"
                      />
                    </MDBox>
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={4}>
                  <MDBox mb={2}>
                    <MDTypography variant="body2" color="text" mb={1}>
                      Başlangıç Tarihi Seç
                    </MDTypography>
                    <MDDatePicker
                      value={selectedDate}
                      onChange={(date: Date[]) => {
                        if (date && date[0]) {
                          const d = date[0];
                          const day = String(d.getDate()).padStart(2, "0");
                          const month = String(d.getMonth() + 1).padStart(2, "0"); // Aylar 0-indexli
                          const year = d.getFullYear();
                          const formattedDate = `${day}.${month}.${year}`;
                          setSelectedDate(formattedDate);
                        }
                      }}
                      options={{ dateFormat: "d.m.Y" }}
                      input={{ fullWidth: true }}
                    />
                  </MDBox>
                  <MDBox>
                    <MDTypography variant="body2" color="text" mb={1}>
                      Bitiş Tarihi Seç
                    </MDTypography>
                    <MDDatePicker
                      value={selectedEndDate}
                      onChange={(date: Date[]) => {
                        if (date && date[0]) {
                          const d = date[0];
                          const day = String(d.getDate()).padStart(2, "0");
                          const month = String(d.getMonth() + 1).padStart(2, "0"); // Aylar 0-indexli
                          const year = d.getFullYear();
                          const formattedDate = `${day}.${month}.${year}`;
                          setSelectedEndDate(formattedDate);
                        }
                      }}
                      options={{ dateFormat: "d.m.Y" }}
                      input={{ fullWidth: true }}
                    />
                  </MDBox>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <MDBox>
                    <MDTypography variant="body2" color="text">
                      Saat Aralığı: {hourRange[0]}:00 - {hourRange[1]}:00
                    </MDTypography>
                    <MDBox
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        marginTop: "10px",
                      }}
                    >
                      <Slider
                        value={hourRange}
                        onChange={handleHourRangeChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={24}
                        step={1}
                        marks
                        valueLabelFormat={(value) => `${value}:00`}
                      />
                    </MDBox>
                  </MDBox>
                </Grid>
              </Grid>

              {/* Fetch Button */}
              <MDBox mt={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={handleFetchData}
                  startIcon={<Icon>sync</Icon>}
                >
                  <MDTypography variant="button" color="white" fontWeight="medium">
                    Verileri Getir
                  </MDTypography>
                </MDButton>
              </MDBox>
            </MDBox>
          </Card>
        </MDBox>

        <TabMenu
          model={items}
          style={{
            border: "none",
            backgroundColor: "transparent",
            borderRadius: "8px",
          }}
          activeIndex={activeIndex}
          onTabChange={(e) => {
            setActiveIndex(e.index);
            console.log("e", e.index);
          }}
          className="custom-tab-menu"
        />
        {activeIndex === 1 && (
          <MDBox>
            <MDBox sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              <MDBox mb={3} sx={{ display: "flex", justifyContent: "flex-start" }}>
                <MDButton
                  variant="contained"
                  color={showOnlyFirstData ? "primary" : "info"}
                  onClick={handleToggleFirstData}
                >
                  <Icon>{showOnlyFirstData ? "format_list_bulleted" : "filter_1"}</Icon>
                  <MDTypography variant="button" color="white" fontWeight="medium" ml={1}>
                    {showOnlyFirstData
                      ? "Tüm Verileri Göster"
                      : "Her Kullanıcının ilk Verisini Göster"}
                  </MDTypography>
                </MDButton>
              </MDBox>
              <MDBox mb={3} sx={{ display: "flex", justifyContent: "flex-start" }}>
                <MDButton
                  variant="contained"
                  color={showOnlyActive ? "primary" : "info"}
                  onClick={handleToggleActive}
                >
                  <Icon>{showOnlyActive ? "format_list_bulleted" : "filter_1"}</Icon>
                  <MDTypography variant="button" color="white" fontWeight="medium" ml={1}>
                    {showOnlyActive ? "Aktiflik Durumunu Göster" : "Aktiflik Durumunu Gizle"}
                  </MDTypography>
                </MDButton>
              </MDBox>
            </MDBox>

            {filteredPcData.length > 0 ? (
              <Card>
                <MDBox p={3}>
                  {filteredPcData.map((userData, userIndex) => (
                    <MDBox
                      key={`user-${userData.user.id}-${userIndex}`}
                      mb={3}
                      sx={{
                        borderBottom:
                          userIndex < filteredPcData.length - 1
                            ? "1px solid rgba(0, 0, 0, 0.12)"
                            : "none",
                        pb: 2,
                      }}
                    >
                      <MDBox sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                        <Icon sx={{ fontSize: "20px", mt: 0.3 }}>person</Icon>
                        <MDTypography variant="h6" mb={2}>
                          {userData.user.firstName} {userData.user.lastName}
                        </MDTypography>
                        <MDTypography variant="body2" color="text" fontWeight="regular">
                          ({userData.user.userName})
                        </MDTypography>
                      </MDBox>

                      {userData.logins && userData.logins.length > 0 ? (
                        <MDBox
                          sx={{
                            display: "flex",
                            overflowX: "auto",
                            pb: 1,
                          }}
                        >
                          {userData.logins.map((login: PcTrackGraphicDto, loginIndex: number) => (
                            <Card
                              key={`login-${loginIndex}`}
                              sx={{
                                minWidth: 280,
                                maxWidth: 280,
                                mr: 2,
                                mb: 1,
                                my: 2,
                                border: "1px solid rgba(0, 0, 0, 0.12)",
                                boxShadow: "2px 2px 12px 0 rgba(0,0,0,0.1)",
                                "&:hover": {
                                  transform: "translateY(-5px)",
                                  transition: "transform 0.2s ease-in-out",
                                },
                              }}
                            >
                              <MDBox p={2}>
                                <MDBox
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  mb={1}
                                >
                                  <MDTypography variant="button" fontWeight="medium">
                                    Bilgisayar Adı:
                                  </MDTypography>
                                  <MDTypography variant="button" align="right">
                                    {login.pCname}
                                  </MDTypography>
                                </MDBox>

                                <MDBox
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  mb={2}
                                >
                                  <MDTypography variant="button" fontWeight="medium">
                                    {login.loginType === 2
                                      ? "Açılış Saati:"
                                      : login.loginType === 5
                                        ? "Aktif Saati:"
                                        : login.loginType === 7
                                          ? "Kilit açma"
                                          : login.loginType === 11
                                            ? "Önbellekli giriş"
                                            : "Bilinmiyor"}
                                  </MDTypography>
                                  <MDTypography variant="button" align="right">
                                    {new Date(login.adjustedProcessTime).toLocaleString()}
                                  </MDTypography>
                                </MDBox>

                                <MDBox display="flex" justifyContent="flex-end">
                                  <Chip
                                    icon={<Icon>{getPCStatus(login.loginType).icon}</Icon>}
                                    label={getPCStatus(login.loginType).label}
                                    color={getPCStatus(login.loginType).color as any}
                                    size="small"
                                  />
                                </MDBox>
                              </MDBox>
                            </Card>
                          ))}
                        </MDBox>
                      ) : (
                        <MDBox
                          p={3}
                          textAlign="center"
                          sx={{
                            borderRadius: "8px",
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            bgcolor: "rgba(0, 0, 0, 0.02)",
                          }}
                        >
                          <Icon color="warning" sx={{ fontSize: 40, mb: 1 }}>
                            info
                          </Icon>
                          <MDTypography variant="body2" color="text" fontWeight="medium">
                            Kullanıcı için aktif veri bulunamadı
                          </MDTypography>
                        </MDBox>
                      )}
                    </MDBox>
                  ))}
                </MDBox>
              </Card>
            ) : (
              <Card>
                <MDBox p={4} textAlign="center">
                  <Icon color="info" sx={{ fontSize: 60, mb: 2 }}>
                    search_off
                  </Icon>
                  <MDTypography variant="h5" gutterBottom>
                    Sonuç bulunamadı
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    Lütfen filtreleri düzenleyin ve `&quot;`Verileri Getir`&quot;` butonuna tıklayın
                  </MDTypography>
                </MDBox>
              </Card>
            )}
          </MDBox>
        )}

        {/* {activeIndex === 1 && (
          <MDBox>
            <MDBox mb={3}>
              <MDTypography variant="h6" mb={2}>Oturum Takip</MDTypography>

              {filteredSessionData.length > 0 ? (
                <Card>
                  <MDBox p={2}>
                    <List>
                      {filteredSessionData.map((userData, userIndex) => (
                        <React.Fragment key={`session-user-${userData.user.id}-${userIndex}`}>
                          <ListItem
                            sx={{
                              flexDirection: "column",
                              alignItems: "flex-start",
                              py: 2,
                              px: 3,
                              "&:hover": {
                                bgcolor: "rgba(0, 0, 0, 0.04)",
                              },
                            }}
                          >
                  
                            <MDBox
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                mb: 2,
                              }}
                            >
                              <MDAvatar
                                sx={{
                                  bgcolor: "info.main",
                                  width: 40,
                                  height: 40,
                                  mr: 2,
                                }}
                              >
                                <Icon>person</Icon>
                              </MDAvatar>
                              <MDBox sx={{ flex: 1 }}>
                                <MDTypography variant="h6" fontWeight="medium">
                                  {userData.user.firstName} {userData.user.lastName}
                                </MDTypography>
                                <MDTypography variant="body2" color="text">
                                  @{userData.user.userName}
                                </MDTypography>
                              </MDBox>
                              <Chip
                                label={`${userData.logins?.length || 0} oturum`}
                                color="primary"
                                size="small"
                                variant="outlined"
                              />
                            </MDBox>

                       
                            {userData.logins && userData.logins.length > 0 ? (
                              <MDBox sx={{ width: "100%", pl: 7 }}>
                                {userData.logins.map((login: PcTrackGraphicDto, loginIndex: number) => (
                                  <MDBox
                                    key={`session-${loginIndex}`}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      py: 1.5,
                                      px: 2,
                                      mb: 1,
                                      bgcolor: "rgba(0, 0, 0, 0.02)",
                                      borderRadius: "8px",
                                      border: "1px solid rgba(0, 0, 0, 0.08)",
                                    }}
                                  >
                                    <MDBox sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                                      <Icon
                                        sx={{
                                          mr: 2,
                                          color: getPCStatus(login.loginType).color === "success"
                                            ? "success.main"
                                            : getPCStatus(login.loginType).color === "info"
                                              ? "info.main"
                                              : getPCStatus(login.loginType).color === "warning"
                                                ? "warning.main"
                                                : "text.secondary"
                                        }}
                                      >
                                        {getPCStatus(login.loginType).icon}
                                      </Icon>
                                      <MDBox>
                                        <MDTypography variant="button" fontWeight="medium">
                                          {login.pCname}
                                        </MDTypography>
                                        <MDTypography variant="caption" color="text" display="block">
                                          {new Date(login.adjustedProcessTime).toLocaleString("tr-TR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </MDTypography>
                                      </MDBox>
                                    </MDBox>

                                    <Chip
                                      icon={<Icon sx={{ fontSize: "16px !important" }}>{getPCStatus(login.loginType).icon}</Icon>}
                                      label={getPCStatus(login.loginType).label}
                                      color={getPCStatus(login.loginType).color as any}
                                      size="small"
                                      sx={{ ml: 2 }}
                                    />
                                  </MDBox>
                                ))}
                              </MDBox>
                            ) : (
                              <MDBox
                                sx={{
                                  width: "100%",
                                  pl: 7,
                                  py: 2,
                                  textAlign: "center",
                                  color: "text.secondary",
                                }}
                              >
                                <Icon sx={{ fontSize: 24, mb: 1, opacity: 0.5 }}>
                                  info_outline
                                </Icon>
                                <MDTypography variant="body2" color="text">
                                  Bu kullanıcı için oturum verisi bulunamadı
                                </MDTypography>
                              </MDBox>
                            )}
                          </ListItem>

                          {userIndex < filteredPcData.length - 1 && (
                            <Divider sx={{ my: 1 }} />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  </MDBox>
                </Card>
              ) : (
                <Card>
                  <MDBox p={4} textAlign="center">
                    <Icon color="info" sx={{ fontSize: 60, mb: 2, opacity: 0.5 }}>
                      list_alt
                    </Icon>
                    <MDTypography variant="h6" gutterBottom color="text">
                      Henüz oturum verisi yok
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      Oturum verilerini görüntülemek için filtreleri ayarlayın ve Verileri Getir butonuna tıklayın
                    </MDTypography>
                  </MDBox>
                </Card>
              )}
            </MDBox>
          </MDBox>
        )} */}

        {activeIndex === 0 && (
          <MDBox>
            {filteredTableData.length > 0 ? (
              <Card>
                <MDBox p={3}>
                  <MDTypography variant="h6" mb={2}>
                    Oturum Verileri Tablosu
                  </MDTypography>

                  <MDBox>
                    {/* Header Row */}
                    <Grid
                      container
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                        borderBottom: "2px solid rgba(0, 0, 0, 0.12)",
                        py: 2,
                        px: 1
                      }}
                    >
                      <Grid item xs={3.6}>
                        <MDBox sx={{ display: "flex", alignItems: "center", gap: 1, px: 2 }}>
                          <Icon sx={{ fontSize: "18px", color: "info.main" }}>person</Icon>
                          <MDTypography variant="button" fontWeight="medium">
                            Kullanıcı
                          </MDTypography>
                        </MDBox>
                      </Grid>
                      <Grid item xs={3}>
                        <MDBox sx={{ display: "flex", alignItems: "center", gap: 1, px: 2 }}>
                          <Icon sx={{ fontSize: "16px", color: "secondary.main" }}>computer</Icon>
                          <MDTypography variant="button" fontWeight="medium">
                            Bilgisayar Adı
                          </MDTypography>
                        </MDBox>
                      </Grid>
                      <Grid item xs={3.6}>
                        <MDBox sx={{ display: "flex", alignItems: "center", gap: 1, px: 2 }}>
                          <Icon sx={{ fontSize: "16px", color: "warning.main" }}>schedule</Icon>
                          <MDTypography variant="button" fontWeight="medium">
                            Oturum Zamanı
                          </MDTypography>
                        </MDBox>
                      </Grid>
                      <Grid item xs={1.8}>
                        <MDBox sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, px: 2 }}>
                          <Icon sx={{ fontSize: "16px", color: "success.main" }}>info</Icon>
                          <MDTypography variant="button" fontWeight="medium">
                            Durum
                          </MDTypography>
                        </MDBox>
                      </Grid>
                    </Grid>

                    {/* Data Rows */}
                    {filteredTableData.map((userData) =>
                      userData.logins.map((login, loginIndex) => (
                        <Grid
                          container
                          key={`${userData.user.id}-${loginIndex}`}
                          sx={{
                            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                            py: 2,
                            px: 1,
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.02)"
                            }
                          }}
                        >
                          <Grid item xs={3.6}>
                            <MDBox sx={{ display: "flex", alignItems: "center", gap: 1, px: 2 }}>
                              <Icon sx={{ fontSize: "18px", color: "info.main" }}>person</Icon>
                              <MDBox>
                                <MDTypography variant="button" fontWeight="medium">
                                  {userData.user.firstName} {userData.user.lastName}
                                </MDTypography>
                                <MDTypography variant="caption" color="text" display="block">
                                  ({userData.user.userName})
                                </MDTypography>
                              </MDBox>
                            </MDBox>
                          </Grid>
                          <Grid item xs={3}>
                            <MDBox sx={{ display: "flex", alignItems: "center", gap: 1, px: 2 }}>
                              <Icon sx={{ fontSize: "16px", color: "secondary.main" }}>computer</Icon>
                              <MDTypography variant="button">
                                {login.pCname}
                              </MDTypography>
                            </MDBox>
                          </Grid>
                          <Grid item xs={3.6}>
                            <MDBox sx={{ display: "flex", alignItems: "center", gap: 1, px: 2 }}>
                              <Icon sx={{ fontSize: "16px", color: "warning.main" }}>schedule</Icon>
                              <MDTypography variant="button">
                                {new Date(login.adjustedProcessTime).toLocaleString()}
                              </MDTypography>
                            </MDBox>
                          </Grid>
                          <Grid item xs={1.8}>
                            <MDBox sx={{ display: "flex", alignItems: "center", justifyContent: "center", px: 2 }}>
                              <Chip
                                icon={<Icon>{getPCStatus(login.loginType).icon}</Icon>}
                                label={getPCStatus(login.loginType).label}
                                color={getPCStatus(login.loginType).color as any}
                                size="small"
                              />
                            </MDBox>
                          </Grid>
                        </Grid>
                      ))
                    )}
                  </MDBox>
                </MDBox>
              </Card>
            ) : (
              <Card>
                <MDBox p={4} textAlign="center">
                  <Icon color="info" sx={{ fontSize: 60, mb: 2 }}>
                    table_view
                  </Icon>
                  <MDTypography variant="h6" gutterBottom>
                    Tablo Görünümü
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    Oturum verilerini görüntülemek için filtreleri ayarlayın ve Verileri Getir butonuna tıklayın
                  </MDTypography>
                </MDBox>
              </Card>
            )}
          </MDBox>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default PCTrackingManagement;
