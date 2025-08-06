import { Autocomplete, Divider, Grid } from "@mui/material";
// import { TicketTeamsApi, UserApi, UserAppDto } from "api/generated";
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
import { TabMenu } from "primereact/tabmenu";
import "./index.css";
import ProfilesList, { ProfileDto } from "./List";
import {
  DepartmentsApi,
  TicketDepartmentsApi,
  TicketTeamApi,
  TicketTeamInsertDto,
  TicketTeamListDto,
  TicketTeamUpdateDto,
  TicketTeamUserAppInsertDto,
  UserApi,
  WorkCompanyApi,
} from "api/generated";
import { DataArray } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

function CreateTeam() {
  const [allDepartments, setAllDepartments] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectionManager, setSelectionManager] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchByName, setSearchByName] = useState<[]>([]);
  const [existingUsers, setExistingUsers] = useState<TicketTeamUserAppInsertDto[]>([]);
  const [selectedTeamUser, setSelectedTeamUser] = useState(null);
  const [selectionTeamUser, setSelectionTeamUser] = useState(null);
  const { t } = useTranslation();

  const [teamData, setTeamData] = useState<TicketTeamListDto>({
    id: null,
    name: "",
    departmentId: null,
    managerId: null,
    workCompanyId: null,
    teamList: [],
    department: null,
    workCompany: null,
    manager: null,
    // companyId: null,
  });

  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchDepartmentData = async () => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new TicketDepartmentsApi(conf);
      var data = await api.apiTicketDepartmentsGet();
      setAllDepartments(data.data as any);
    } catch (error) {
      dispatchAlert({
        message: `${t("ns1:TeamPage.TeamList.HataOlustu")} : ${error}`,
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const fetchCompany = async () => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new WorkCompanyApi(conf);
      var response = await api.apiWorkCompanyGet();
      setCompanies(response.data);
    } catch (error) {
      dispatchAlert({
        message: `${t("ns1:TeamPage.TeamList.HataOlustu")} : ${error}`,
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const fetchTeamID = async () => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new TicketTeamApi(conf);
      var response = await api.apiTicketTeamIdGet(id);

      setTeamData({
        id: response.data.id,
        name: response.data.name,
        departmentId: response.data.departmentId,
        managerId: response.data.managerId,
        teamList: response.data.teamList,
        department: response.data.department,
        workCompany: response.data.workCompany,
        manager: response.data.manager,
        workCompanyId: response.data.workCompanyId,
      });
      setSelectedDepartment(response.data.department);
      setSelectedCompany(response.data.workCompany);
      setSelectedManager(response.data.manager);
      setExistingUsers(response.data.teamList as any);
    } catch (error) {
      dispatchAlert({
        message: `${t("ns1:TeamPage.TeamList.HataOlustu")} : ${error}`,
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };
  useEffect(() => {
    fetchCompany();
    fetchDepartmentData();
  }, []);

  useEffect(() => {
    if (id) {
      fetchTeamID();
    }
  }, [id]);

  const handleCreateTeam = async () => {
    try {
      dispatchBusy({ isBusy: true });

      const teamList = existingUsers.map((user) => ({
        userAppId: user.userAppId,
        userApp: {
          id: user.userApp.id,
          firstName: user.userApp.firstName,
          lastName: user.userApp.lastName,
          email: user.userApp.email,
          photo: user.userApp.photo,
        },
      }));

      var jsonData: TicketTeamInsertDto = {
        departmentId: teamData.departmentId,
        name: teamData.name,
        managerId: teamData.managerId,
        teamList: teamList,
        workCompanyId: teamData.workCompanyId,
      };
      if (teamData.managerId == null) {
        dispatchAlert({
          message: t("ns1:TeamPage.TeamDetail.YoneticiSecilmedi"),
          type: MessageBoxType.Warning,
        });
        dispatchBusy({ isBusy: false });
        return;
      }
      if (teamData.workCompanyId == null) {
        dispatchAlert({
          message: t("ns1:TeamPage.TeamDetail.SirketSecilmedi"),
          type: MessageBoxType.Warning,
        });
        dispatchBusy({ isBusy: false });
        return;
      }
      if (teamData.name == null || teamData.name == "") {
        dispatchAlert({
          message: t("ns1:TeamPage.TeamDetail.TakimAdiGirilmedi"),
          type: MessageBoxType.Warning,
        });
        dispatchBusy({ isBusy: false });
        return;
      }
      var conf = getConfiguration();
      var api = new TicketTeamApi(conf);
      await api.apiTicketTeamPost(jsonData);

      dispatchAlert({
        message: t("ns1:TeamPage.TeamDetail.DepartmanEklendi"),
        type: MessageBoxType.Success,
      });
      dispatchBusy({ isBusy: false });
      navigate("/teams");
    } catch (error) {
      dispatchAlert({
        message: error?.toString(),
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const handleUpdateTeam = async () => {
    try {
      dispatchBusy({ isBusy: true });

      const teamList =
        existingUsers.length > 0
          ? existingUsers.map((user) => ({
              userAppId: user.userAppId,
              userApp: {
                id: user.userApp.id,
                firstName: user.userApp.firstName,
                lastName: user.userApp.lastName,
                email: user.userApp.email,
                photo: user.userApp.photo,
              },
            }))
          : [];

      var jsonDataWithId = {
        id: id,
        departmentId: selectedDepartment?.id || null,
        name: teamData.name,
        managerId: teamData.managerId,
        teamList: teamList,
        workCompanyId: selectedCompany.id,
      };

      if (teamData.managerId == null) {
        dispatchAlert({
          message: t("ns1:TeamPage.TeamDetail.YoneticiSecilmedi"),
          type: MessageBoxType.Warning,
        });
        dispatchBusy({ isBusy: false });
        return;
      }
      if (teamData.workCompanyId == null) {
        dispatchAlert({
          message: t("ns1:TeamPage.TeamDetail.SirketSecilmedi"),
          type: MessageBoxType.Warning,
        });
        dispatchBusy({ isBusy: false });
        return;
      }
      if (teamData.name == null || teamData.name == "") {
        dispatchAlert({
          message: t("ns1:TeamPage.TeamDetail.TakimAdiGirilmedi"),
          type: MessageBoxType.Warning,
        });
        dispatchBusy({ isBusy: false });
        return;
      }

      var conf = getConfiguration();
      var api = new TicketTeamApi(conf);
      await api.apiTicketTeamPut(jsonDataWithId);

      dispatchAlert({
        message: t("ns1:TeamPage.TeamDetail.EkipGuncellendi"),
        type: MessageBoxType.Success,
      });
      dispatchBusy({ isBusy: false });
      navigate("/teams");
    } catch (error) {
      dispatchAlert({ message: error?.toString(), type: MessageBoxType.Error });
    } finally {
      dispatchBusy({ isBusy: false });
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
        setSearchByName(pureData as any);
        dispatchBusy({ isBusy: false });
      } catch (error) {
        dispatchAlert({
          message: `${t("ns1:TeamPage.TeamList.HataOlustu")} : ${error}`,
          type: MessageBoxType.Error,
        });
      } finally {
        dispatchBusy({ isBusy: false });
      }
    }
  };

  const handleAddUser = () => {
    if (selectedTeamUser) {
      // Check if user already exists in the list
      const userExists = existingUsers.some((user) => user.userApp.id === selectedTeamUser.id);

      if (!userExists) {
        const newUser = {
          userApp: {
            id: selectedTeamUser.id,
            firstName: selectedTeamUser.firstName,
            lastName: selectedTeamUser.lastName,
            email: selectedTeamUser.email,
            photo: selectedTeamUser.photo,
          },

          userAppId: selectedTeamUser.id,
        };

        setExistingUsers((prev) => [...prev, newUser]);
        // Clear the selection after adding
        setTeamData({ ...teamData, teamList: [...teamData.teamList, newUser] });
        setSelectedTeamUser(null);
        setSelectionTeamUser(null);
      } else {
        dispatchAlert({
          message: t("ns1:TeamPage.TeamDetail.UyeEklendi"),
          type: MessageBoxType.Warning,
        });
      }
    }
  };

  const handleDeleteUser = (userId: string) => {
    setExistingUsers((prevUsers) => prevUsers.filter((user) => user.userAppId !== userId));
  };

  const items = [
    {
      label: t("ns1:TeamPage.TeamDetail.TakimBilgileri"),
      icon: "pi pi-user",
      className: "custom-tab-item",
    },
    {
      label: t("ns1:TeamPage.TeamDetail.Uyeler"),
      icon: "pi pi-users",
      className: "custom-tab-item",
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container mx={0.4}>
        <Grid item xs={12} lg={12}>
          <Card style={{ border: "none" }}>
            <MDBox p={3}>
              <MDBox mt={2} p={3}>
                <TabMenu
                  model={items}
                  className="custom-tab-menu"
                  style={{
                    border: "none",
                    backgroundColor: "transparent",
                    borderRadius: "8px",
                  }}
                  activeIndex={activeIndex}
                  onTabChange={(e) => setActiveIndex(e.index)}
                />
                <Divider sx={{ opacity: 1 }} />
              </MDBox>

              {activeIndex === 0 ? (
                <MDBox mt={2} p={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} lg={5.75}>
                      <Autocomplete
                        options={companies}
                        getOptionLabel={(option: any) => option.name}
                        isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                        value={selectedCompany}
                        onChange={(event, newValue) => {
                          if (!newValue) return;
                          setSelectedCompany(newValue);
                          setTeamData({ ...teamData, workCompanyId: newValue.id });
                        }}
                        renderInput={(params) => (
                          <MDInput
                            {...params}
                            label={`*${t("ns1:TeamPage.TeamDetail.SirketAdi")}`}
                            fullWidth
                            sx={{ mb: 3.2 }}
                            inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                          />
                        )}
                      />
                      <MDInput
                        type="text"
                        sx={{ mb: 3.2, height: 53 }}
                        value={teamData.name}
                        label={`*${t("ns1:TeamPage.TeamDetail.TakimAdi")}`}
                        onChange={(e: any) => {
                          setTeamData({ ...teamData, name: e.target.value });
                        }}
                        fullWidth
                      />
                    </Grid>

                    <Grid lg={0.5} />
                    <Grid item xs={12} sm={6} lg={5.75}>
                      <Autocomplete
                        options={allDepartments}
                        getOptionLabel={(option) => option.departmentText}
                        value={selectedDepartment}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            setTeamData({ ...teamData, departmentId: newValue.id });

                            setSelectedDepartment(newValue);
                          } else {
                            setTeamData({ ...teamData, departmentId: null });
                            setSelectedDepartment(null);
                          }
                        }}
                        fullWidth
                        sx={{ mb: 3.2 }}
                        renderInput={(params) => (
                          <MDInput
                            {...params}
                            size="large"
                            InputLabelProps={{ shrink: true }}
                            placeholder={t("ns1:TeamPage.TeamDetail.DepartmanSeciniz")}
                            label={t("ns1:TeamPage.TeamDetail.Departman")}
                            inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                          />
                        )}
                      />
                      <Autocomplete
                        options={searchByName}
                        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                        value={selectedManager}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={(event, newValue) => {
                          if (newValue == null) return;
                          if (newValue !== null) {
                            setSelectionManager(`${newValue.firstName} ${newValue.lastName}`);
                          }

                          setSelectedManager(newValue);
                          setTeamData({ ...teamData, managerId: newValue.id, manager: newValue });
                        }}
                        onInputChange={(event, newInputValue) => {
                          handleSearchByName(newInputValue);
                        }}
                        renderInput={(params) => (
                          <MDInput
                            {...params}
                            size="large"
                            InputLabelProps={{ shrink: true }}
                            placeholder={t("ns1:TeamPage.TeamDetail.YoneticiSeciniz")}
                            label={`*${t("ns1:TeamPage.TeamDetail.Yonetici")}`}
                            inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                          />
                        )}
                        renderOption={(props, option) => {
                          return (
                            <li {...props} key={option.id} style={{ listStyle: "none" }}>
                              {" "}
                              <MDBox
                                onClick={() => setSelectedManager(option)}
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
                          );
                        }}
                      />
                    </Grid>
                  </Grid>
                </MDBox>
              ) : (
                <MDBox mt={0} p={3} sx={{ marginLeft: 4 }}>
                  <MDBox>
                    <MDTypography variant="h4" color="text.secondary">
                      {" "}
                      {t("ns1:TeamPage.TeamDetail.TakimUyeleri")}{" "}
                    </MDTypography>

                    <MDBox mt={4}>
                      {existingUsers.length > 0 ? (
                        <ProfilesList
                          title={`${t("ns1:TeamPage.TeamDetail.MevcutUyeler")} (${
                            existingUsers.length
                          })`}
                          profiles={existingUsers.map((user) => ({
                            id: user.userApp.id,
                            name: `${user.userApp.firstName} ${user.userApp.lastName}`,
                            description: user.userApp.email,
                            image: user.userApp.photo,
                          }))}
                          shadow={false}
                          onDelete={handleDeleteUser}
                        />
                      ) : (
                        <MDBox pt={2} px={2} mb={2}>
                          <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                            {" "}
                            {t("ns1:TeamPage.TeamDetail.UyeYok")}{" "}
                          </MDTypography>
                        </MDBox>
                      )}
                    </MDBox>
                  </MDBox>
                  <MDBox mt={4}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} lg={5.75}>
                        <MDBox display="flex" justifyContent="space-between">
                          <Autocomplete
                            options={searchByName}
                            fullWidth
                            sx={{ mr: 2 }}
                            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                            value={selectedTeamUser}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            onChange={(event, newValue) => {
                              if (newValue !== null) {
                                setSelectionTeamUser(`${newValue.firstName} ${newValue.lastName}`);
                              }

                              setSelectedTeamUser(newValue);
                            }}
                            onInputChange={(event, newInputValue) => {
                              handleSearchByName(newInputValue);
                            }}
                            renderInput={(params) => (
                              <MDInput
                                {...params}
                                size="large"
                                InputLabelProps={{ shrink: true }}
                                placeholder={t("ns1:TeamPage.TeamDetail.TakimUyesiSeciniz")}
                              />
                            )}
                            renderOption={(props, option) => {
                              return (
                                <li {...props} key={option.id} style={{ listStyle: "none" }}>
                                  {" "}
                                  <MDBox
                                    onClick={() => setSelectedTeamUser(option)}
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
                              );
                            }}
                          />

                          <MDBox>
                            <MDButton
                              variant="outlined"
                              color="info"
                              sx={{ height: 53, mt: 0, width: 75 }}
                              onClick={handleAddUser}
                              disabled={!selectedTeamUser}
                            >
                              {t("ns1:TeamPage.TeamDetail.Ekle")}
                            </MDButton>
                          </MDBox>
                        </MDBox>
                      </Grid>
                    </Grid>
                  </MDBox>
                </MDBox>
              )}
            </MDBox>
            <MDBox />

            <MDBox
              mt={activeIndex == 0 ? 35.5 : -1}
              mb={3}
              display="flex"
              justifyContent="flex-end"
              width="100%"
            >
              <MDButton
                sx={{ mr: 3 }}
                variant="outlined"
                color="primary"
                onClick={() => navigate("/teams")}
              >
                {t("ns1:TeamPage.TeamDetail.Iptal")}
              </MDButton>
              <MDButton
                sx={{ mr: 3 }}
                variant="gradient"
                color="info"
                onClick={id ? handleUpdateTeam : handleCreateTeam}
              >
                {t("ns1:TeamPage.TeamDetail.Kaydet")}
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

export default CreateTeam;
