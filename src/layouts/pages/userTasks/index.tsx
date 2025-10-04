import { Autocomplete, Grid, Icon, Typography } from "@mui/material";
import "@ui5/webcomponents-icons/dist/add.js";
import {
  ProjectTasksApi,
  ProjectTasksListDto,
  UserAppDto,
  UserApi,
  UserAppDtoOnlyNameId,
  TicketDepartmensListDto,
  TicketDepartmentsApi,
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
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
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

function UserTasks() {
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
  const [taskData, setTaskData] = useState<ProjectTasksListDto[]>([]);
  const { t } = useTranslation();
  const [userData, setUserData] = useState<UserAppDtoOnlyNameId[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserAppDtoOnlyNameId>();
  const [hasPerm, setHasPerm] = useState<boolean>();
  const [departmentsData, setDepartmentsData] = useState<TicketDepartmensListDto[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<TicketDepartmensListDto>();

  const fetchTaskData = async (userId: string) => {
    try {
      const conf = getConfiguration();
      const api = new ProjectTasksApi(conf);
      const data = await api.apiProjectTasksGetUserTasksGet(userId);
      setTaskData(data.data as any);
    } catch (error) {
      dispatchAlert({
        message: "Task verileri getirilirken hata oluştu.",
        type: MessageBoxType.Error,
      });
    }
  };

  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Geçersiz tarih kontrolü

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };
  const columns = [
    {
      accessor: "companyName",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Şirket</div>,
      Cell: ({ value, row }: any) => <GlobalCell value={value} />,
    },
    {
      accessor: "projectName",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Proje Tanımı</div>
      ),
      Cell: ({ value, row }: any) => <GlobalCell value={value} />,
    },
    {
      accessor: "taskName",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Görev Adı</div>,
      Cell: ({ value, row }: any) => <GlobalCell value={value} />,
    },
    {
      accessor: "startDate",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Başlangıç Tarihi</div>
      ),
      Cell: ({ value, row }: any) => <GlobalCell value={formatDate(value)} />,
    },
    {
      accessor: "progress",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          Tamamlanma Durumu
        </div>
      ),
      Cell: ({ value, row }: any) => <GlobalCell value={`% ${value}`} />,
    },
    // {
    //   accessor: "actions",
    //   Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>İşlemler</div>,
    //   Cell: ({ row }: any) => (
    //     <MDBox display="flex" alignItems="center">
    //       <>
    //         <Icon
    //           onClick={() => navigate(`/ticketProjects/detail/${row.original.id}`)}
    //           sx={{ cursor: "pointer", fontSize: "24px" }}
    //           style={{ marginRight: "8px" }}
    //         >
    //           edit
    //         </Icon>
    //         <Icon
    //           sx={{ cursor: "pointer", fontSize: "24px" }}
    //           onClick={() => handleOpenQuestionBox(row.original.id)}
    //         >
    //           delete
    //         </Icon>
    //       </>
    //     </MDBox>
    //   ),
    // },
  ];

  useEffect(() => {
    const init = async () => {
      dispatchBusy({ isBusy: true });
      try {
        await fetchHasPerm(); // Bu sırayla çalışmalı

        // Bu ikisini aynı anda çalıştır
        await Promise.all([fetchUsersData(), fetchDepartmentsData()]);
      } catch (error) {
        console.log("init error", error);
      } finally {
        dispatchBusy({ isBusy: false });
      }
    };
    init();
  }, []);

  useEffect(() => {
      if (selectedDepartment) {
        fetchUsersDataByDepartment(selectedDepartment.id);
      } else {
        fetchUsersData();
      }
      if (hasPerm === true) {
        setSelectedUser(null);
      }
    }, [selectedDepartment]);

  const fetchUsersData = async () => {
    try {
      let config = getConfiguration();
      let api = new UserApi(config);
      let response = await api.apiUserGetAllWithOuthPhotoGet();
      setUserData(response.data);
    } catch (error) {
      console.log("error", error);
    } finally {
    }
  };
  const fetchUsersDataByDepartment = async (departmentId: string) => {
    try {
      let config = getConfiguration();
      let api = new UserApi(config);
      let response = await api.apiUserGetAllUsersAsyncWitNameGet(departmentId);
      setUserData(response.data);
    } catch (error) {
      console.log("error", error);
    } finally {
    }
  };

  const fetchDepartmentsData = async () => {
    try {
      let config = getConfiguration();
      let api = new TicketDepartmentsApi(config);
      let response = await api.apiTicketDepartmentsGet();
      setDepartmentsData(response.data);
    } catch (error) {
      console.log("error", error);
    } finally {
    }
  };

  const fetchHasPerm = async () => {
    try {
      let config = getConfiguration();
      let api = new ProjectTasksApi(config);
      let response = await api.apiProjectTasksHasPermGet();
      setHasPerm(response.data);

      if (response.data !== true) {
        let api2 = new UserApi(config);
        let response2 = await api2.apiUserGetLoginUserDetailGet();
        setSelectedUser(response2.data);
        let response3 = await api2.apiUserUserDepartmentGet();
        setSelectedDepartment(response3.data);

        await fetchTaskData(response2.data.id);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
    }
  };

  const handleFilter = async () => {
    if (selectedUser) {
      await fetchTaskData(selectedUser.id);
    } else {
      dispatchAlert({
        message: "Lütfen kullanıcı seçiniz.",
        type: MessageBoxType.Error,
      });
    }
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
            actionsBar={<MDBox style={{ marginTop: "15px", marginRight: "15px" }}></MDBox>}
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
                Kullanıcı Görevleri
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#7b809a",
                }}
              >
                Kullanıcı görevlerini görüntüleyin
              </Typography>
            </MDBox>
          </ObjectPageTitle>
        }
      >
        <MDBox>
          <Grid container spacing={3} sx={{ p: 3 }}>
            <Grid item xs={6} md={3}>
              <MDBox>
                <Autocomplete
                  disabled={!hasPerm}
                  key={selectedDepartment?.id}
                  options={departmentsData}
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
                      size="medium"
                      InputLabelProps={{ shrink: true }}
                      label="Departman"
                    />
                  )}
                />
              </MDBox>
            </Grid>
            <Grid item xs={6} md={3}>
              <MDBox>
                <Autocomplete
                  disabled={!hasPerm}
                  key={selectedUser?.id}
                  options={userData}
                  getOptionLabel={(option: UserAppDtoOnlyNameId) => {
                    return `${option?.firstName || ""} ${option?.lastName || ""}`.trim();
                  }}
                  value={selectedUser}
                  isOptionEqualToValue={(
                    option: UserAppDtoOnlyNameId,
                    value: UserAppDtoOnlyNameId
                  ) => option?.id === value?.id}
                  onChange={(event, newValues: UserAppDtoOnlyNameId | null) => {
                    if (newValues) {
                      setSelectedUser(newValues);
                    } else {
                      setSelectedUser(null);
                    }
                  }}
                  renderInput={(params) => (
                    <MDInput
                      {...params}
                      size="medium"
                      InputLabelProps={{ shrink: true }}
                      label="Kullanıcı"
                    />
                  )}
                />
              </MDBox>
            </Grid>
            <Grid item xs={6} md={1}>
              <MDBox>
                <MDButton
                  disabled={!hasPerm}
                  variant="gradient"
                  color="info"
                  fullWidth
                  onClick={handleFilter}
                  sx={{ height: "100%" }}
                >
                  Getir
                </MDButton>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <Grid xs={12} lg={6} sx={{ paddingLeft: "3px" }}>
          <Card style={{ height: "660px" }}>
            <MDBox>
              <MDBox>
                <MDBox height="565px">
                  <DataTable
                    canSearch={true}
                    table={{
                      columns: columns,
                      rows: taskData,
                    }}
                  ></DataTable>
                </MDBox>
              </MDBox>
            </MDBox>
          </Card>
        </Grid>
      </ObjectPage>
      <Footer />
    </DashboardLayout>
  );
}

export default UserTasks;
