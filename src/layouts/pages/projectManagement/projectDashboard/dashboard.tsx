import {
  Card,
  Grid,
  LinearProgress,
  Box,
  Divider,
  Icon,
  Typography,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  WorkCompanyApi,
  TicketProjectsApi,
  WorkCompanyDto,
  TicketProjectsListDto,
  ProjectTasksApi,
  UserAppDto,
} from "api/generated";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useNavigate, useLocation } from "react-router-dom";
import { useBusy } from "layouts/pages/hooks/useBusy";
import getConfiguration from "confiuration";
import React, { useEffect, useState } from "react";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { MessageBoxType } from "@ui5/webcomponents-react";
import TeamDialog from "./teamMembersDialog/teamDialog";

interface ProjectDashboardProps {
  selectedWorkCompany: WorkCompanyDto;
  onReturn: () => void;
  showTest: boolean;
}

function ProjectDashboard({ selectedWorkCompany, onReturn, showTest }: ProjectDashboardProps) {
  const navigate = useNavigate();
  const dispatchAlert = useAlert();

  const dispatchBusy = useBusy();
  const location = useLocation();
  const projectId = location.state?.projectId;

  const [selectedTicketProject, setSelectedTicketProject] = useState<TicketProjectsListDto | null>(
    null
  );
  const [projectData, setProjectData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<UserAppDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!selectedWorkCompany || !showTest) return;
      try {
        setIsLoading(true);
        console.log("projectId", projectId);
        const config = getConfiguration();
        const projectApi = new TicketProjectsApi(config);
        const response = await projectApi.apiTicketProjectsGetActiveProjectsGet(
          selectedWorkCompany.id
        );
        setProjectData(response.data);

        if (projectId) {
         
          let found = response.data.find(
            (project: TicketProjectsListDto) => project.id === projectId
          );
          if (!found) {
            // ! eğer x şirketinden y şirketine geçiş yapılmışsa ve projectId x şirketine göreyse set etme
            setIsLoading(false);
          
            return;
          } else if (found) {
            setSelectedTicketProject(found);
            navigate(location.pathname, {
              replace: true,
              state: null,
            });

          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [selectedWorkCompany, showTest]);

  const handleNavigateToTickets = () => {
    if (!selectedTicketProject) {
      dispatchAlert({
        message: "Lütfen bir proje seçiniz",
        type: MessageBoxType.Error,
      });
      return;
    }

    if (!selectedWorkCompany) {
      // buraya düşmez ama kontrol amaçlı
      dispatchAlert({
        message: "Lütfen bir şirket seçiniz",
        type: MessageBoxType.Error,
      });
      return;
    }

    navigate("/solveAllTicket", {
      state: {
        workCompanyId: selectedWorkCompany?.id,
        workCompanyName: selectedWorkCompany?.name, //
        projectId: selectedTicketProject?.id,
        projectName: selectedTicketProject?.name,
        projectSubName: selectedTicketProject?.subProjectName,
      },
    });
  };

  const handleTeamMembersDialog = async () => {
    if (!selectedTicketProject) {
      dispatchAlert({
        message: "Lütfen bir proje seçiniz",
        type: MessageBoxType.Error,
      });
      return;
    }

    if (!selectedWorkCompany) {
      //  buraya düşmez ama kontrol amaçlı
      dispatchAlert({
        message: "Lütfen bir şirket seçiniz",
        type: MessageBoxType.Error,
      });
      return;
    }

    try {
      dispatchBusy({ isBusy: true });
      const config = getConfiguration();
      const projectApi = new ProjectTasksApi(config);
      const response = await projectApi.apiProjectTasksGetProjectUsersWithPhotoGet(
        selectedTicketProject?.id,
        1
      );
      console.log("team members", response.data);
      setTeamMembers(response.data);
      setOpen(true);
    } catch (error) {
      console.log(error);
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const handlePageChange = async (page: number) => {
    try {
      dispatchBusy({ isBusy: true });
      const config = getConfiguration();
      const projectApi = new ProjectTasksApi(config);
      const response = await projectApi.apiProjectTasksGetProjectUsersWithPhotoGet(
        selectedTicketProject?.id,
        page
      );
      setTeamMembers(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  return (
    <MDBox
      p={3}
      pb={20}
      sx={{
        height: "100vh", // Veya ihtiyaca göre örn. "calc(100vh - 64px)"
        overflowY: "auto",
        position: "relative",
        
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 1000,
          }}
        >
          <CircularProgress
            sx={{
              width: "50%",
              height: 8,
              borderRadius: 4,
              marginBottom: "10px",
            }}
          />
          {projectId && (
            <MDTypography variant="h6" color="text">
              Seçili proje yükleniyor...
            </MDTypography>
          )}
          {!projectId && (
            <MDTypography variant="h6" color="text">
              Projeler yükleniyor...
            </MDTypography>
          )}
        </Box>
      )}
      <Card
        sx={{
          padding: "32px",
          background: "linear-gradient(to bottom right, #ffffff, #f9fafc) !important",
          border: "1px solid rgba(102, 126, 234, 0.08) !important",
          borderRadius: "20px !important",
          boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
          marginTop: "16px",
          opacity: 0,
          transform: "translateY(20px)",
          animation: "slideIn 0.5s ease forwards",
        }}
      >
        {/* Header with Back Button */}
        <MDBox display="flex" alignItems="center" mb={4} justifyContent="space-between">
          <MDButton
            onClick={() => {
              setSelectedTicketProject(null); // geri gelip farklı müşteri seçme durumunda mevcut projeyi sıfırlıyoruz
              onReturn();
            }}
            variant="contained"
            color="light"
            sx={{
              minWidth: "auto",
              p: 1.5,

              mb: 3,
              borderRadius: "12px",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            ←
          </MDButton>
          <MDTypography variant="h3" fontWeight="medium">
            {selectedWorkCompany?.name || "Project Dashboard"}
          </MDTypography>
          <MDBox>
            {/* <MDButton
              variant="gradient"
              color="info"
              size="small"
              sx={{
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.07)",
              }}
            >
              Export Report
            </MDButton> */}
          </MDBox>
        </MDBox>
        <MDBox mb={3}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              background: "linear-gradient(135deg, #f5f7ff 0%, #f9f9f9 100%)",
              padding: "14px",
            }}
          >
            <Autocomplete
              options={projectData}
              getOptionLabel={(option) =>
                option.subProjectName ? `${option.name} - ${option.subProjectName}` : option.name
              }
              value={selectedTicketProject}
              onChange={(e, val) => setSelectedTicketProject(val)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Proje Seçimi"
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 1 }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <span className="material-icons" style={{ color: "#666", marginRight: 8 }}>
                        work
                      </span>
                    ),
                  }}
                />
              )}
            />
          </Card>
        </MDBox>
        {/* Project Overview Card */}
        <MDBox mb={6}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              background: "linear-gradient(135deg, #f5f7ff 0%, #f9f9f9 100%)",
              padding: "14px",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <MDTypography variant="h6" mb={1}>
                  Proje Genel Bilgileri
                </MDTypography>
                <MDTypography variant="body2" color="text" mb={2}>
                  Proje Tanımı: {selectedTicketProject?.name}
                </MDTypography>
                <MDTypography variant="body2" color="text" mb={2}>
                  Proje Alt Tanımı:{" "}
                  {selectedTicketProject?.subProjectName
                    ? `${selectedTicketProject.subProjectName}`
                    : ""}
                </MDTypography>
                <MDTypography variant="body2" color="text" mb={2}>
                  Proje Riskleri: {selectedTicketProject?.risks}
                </MDTypography>

                {/* <MDBox display="flex" alignItems="center" mb={1}>
                  <MDTypography variant="button" color="text" mr={1}>
                    Completion:
                  </MDTypography>
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    color={
                      completionPercentage > 75
                        ? "success"
                        : completionPercentage > 50
                        ? "info"
                        : completionPercentage > 25
                        ? "warning"
                        : "error"
                    }
                  >
                    {completionPercentage}%
                  </MDTypography>
                </MDBox> */}

                {/* <MDBox sx={{ width: "100%", mb: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={completionPercentage}
                    color={
                      completionPercentage > 75
                        ? "success"
                        : completionPercentage > 50
                        ? "info"
                        : completionPercentage > 25
                        ? "warning"
                        : "error"
                    }
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "rgba(200,200,200,0.3)",
                    }}
                  />
                </MDBox> */}
              </Grid>

              <Grid item xs={12} md={4}>
                <MDBox
                  height="100%"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  borderLeft={{ md: "1px solid #eee" }}
                  pl={{ md: 3 }}
                >
                  <MDBox display="flex" justifyContent="space-between" mb={2}>
                    <MDTypography variant="button" color="text">
                      Oluşturulma Tarihi:
                    </MDTypography>
                    <MDTypography variant="button" fontWeight="medium">
                      {selectedTicketProject?.createdDate &&
                        new Date(selectedTicketProject.createdDate).toLocaleDateString("tr-TR")}
                    </MDTypography>
                  </MDBox>
                  {/* <MDBox display="flex" justifyContent="space-between" mb={2}>
                    <MDTypography variant="button" color="text">
                      Due Date:
                    </MDTypography>
                    <MDTypography variant="button" fontWeight="medium">
                      Dec 31, 2023
                    </MDTypography>
                  </MDBox> */}
                  <MDBox display="flex" justifyContent="space-between" mb={2}>
                    <MDTypography variant="button" color="text">
                      Proje Kategorisi:
                    </MDTypography>
                    <MDTypography variant="button" fontWeight="medium">
                      {selectedTicketProject?.projectCategory?.name}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between">
                    <MDTypography variant="button" color="text">
                      Proje Yöneticisi:
                    </MDTypography>
                    <MDTypography variant="button" fontWeight="medium">
                      {selectedTicketProject?.manager?.firstName}{" "}
                      {selectedTicketProject?.manager?.lastName}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Grid>
            </Grid>
          </Card>
        </MDBox>

        {/* Statistics Cards */}
        {/* <MDBox mb={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: "16px",
                  padding: "20px",
                  background: "linear-gradient(135deg, #e8f0fe 0%, #f5f9ff 100%)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  height: "100%",
                }}
              >
                <MDBox display="flex" flexDirection="column" alignItems="center" textAlign="center">
                  <MDTypography variant="h3" color="info" fontWeight="bold">
                    {statistics.totalTasks}
                  </MDTypography>
                  <MDTypography variant="button" color="text">
                    Total Tasks
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: "16px",
                  padding: "20px",
                  background: "linear-gradient(135deg, #e3fcef 0%, #f5fff9 100%)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  height: "100%",
                }}
              >
                <MDBox display="flex" flexDirection="column" alignItems="center" textAlign="center">
                  <MDTypography variant="h3" color="success" fontWeight="bold">
                    {statistics.completedTasks}
                  </MDTypography>
                  <MDTypography variant="button" color="text">
                    Completed
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: "16px",
                  padding: "20px",
                  background: "linear-gradient(135deg, #fff8e6 0%, #fffcf5 100%)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  height: "100%",
                }}
              >
                <MDBox display="flex" flexDirection="column" alignItems="center" textAlign="center">
                  <MDTypography variant="h3" color="warning" fontWeight="bold">
                    {statistics.inProgressTasks}
                  </MDTypography>
                  <MDTypography variant="button" color="text">
                    In Progress
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: "16px",
                  padding: "20px",
                  background: "linear-gradient(135deg, #ffeef1 0%, #fff5f6 100%)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  height: "100%",
                }}
              >
                <MDBox display="flex" flexDirection="column" alignItems="center" textAlign="center">
                  <MDTypography variant="h3" color="error" fontWeight="bold">
                    {statistics.pendingTasks}
                  </MDTypography>
                  <MDTypography variant="button" color="text">
                    Pending
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox> */}

        {/* Action Cards */}
        <Grid container spacing={3}>
          {/* Gantt Chart Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: "18px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
                padding: "24px",
                height: "100%",
                background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)",
                border: "1px solid rgba(102, 126, 234, 0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 20px rgba(0,0,0,0.08)",
                },
              }}
            >
              <MDBox display="flex" alignItems="center" mb={3}>
                <Box
                  sx={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 6px 12px rgba(71, 118, 230, 0.3)",
                    mr: 2,
                  }}
                >
                  <MDTypography variant="h5" color="white">
                    📊
                  </MDTypography>
                </Box>
                <MDTypography variant="h5" fontWeight="medium">
                  Gantt Chart
                </MDTypography>
              </MDBox>

              <MDTypography variant="body2" color="text" mb={3}>
                Proje zaman çizelgesini, bağımlılıkları ve görev planlamasını Gantt grafik biçiminde
                görüntüleyin.
              </MDTypography>

              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                sx={{
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px rgba(71, 118, 230, 0.2)",
                  padding: "10px",
                }}
                onClick={() => {
                  if (!selectedTicketProject) {
                    dispatchAlert({
                      message: "Lütfen bir proje seçiniz",
                      type: MessageBoxType.Error,
                    });
                    return;
                  }

                  if (!selectedWorkCompany) {
                    dispatchAlert({
                      message: "Lütfen bir şirket seçiniz",
                      type: MessageBoxType.Error,
                    });
                    return;
                  }

                  navigate("/projectManagement/chart", {
                    state: {
                      workCompanyId: selectedWorkCompany.id,
                      workCompanyName: selectedWorkCompany.name,
                      projectId: selectedTicketProject.id,
                      projectName: selectedTicketProject.name,
                      projectSubName: selectedTicketProject.subProjectName,
                    },
                  });
                }}
              >
                Gantt Chart Sayfasını Görüntüle
              </MDButton>
            </Card>
          </Grid>

          {/* Tickets Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: "18px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
                padding: "24px",
                height: "100%",
                background: "linear-gradient(135deg, #f5fff7 0%, #ffffff 100%)",
                border: "1px solid rgba(102, 126, 234, 0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 20px rgba(0,0,0,0.08)",
                },
              }}
            >
              <MDBox display="flex" alignItems="center" mb={3}>
                <Box
                  sx={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #43A047 0%, #66BB6A 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 6px 12px rgba(67, 160, 71, 0.3)",
                    mr: 2,
                  }}
                >
                  <MDTypography variant="h5" color="white">
                    <Icon>folder</Icon>
                  </MDTypography>
                </Box>
                <MDTypography variant="h5" fontWeight="medium">
                  Tickets
                </MDTypography>
              </MDBox>

              <MDTypography variant="body2" color="text" mb={3}>
                Ticketları, sorunları ve görevleri yönetin. İlerlemeyi takip edin ve ekip üyelerini
                atayın.
              </MDTypography>

              <MDButton
                variant="gradient"
                color="success"
                fullWidth
                // disabled
                sx={{
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px rgba(67, 160, 71, 0.2)",
                  padding: "10px",
                }}
                onClick={() => handleNavigateToTickets()}
              >
                Ticket Yönetimi
              </MDButton>
            </Card>
          </Grid>

          {/* Team Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: "18px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
                padding: "24px",
                height: "100%",
                background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)",
                border: "1px solid rgba(102, 126, 234, 0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 20px rgba(0,0,0,0.08)",
                },
              }}
            >
              <MDBox display="flex" alignItems="center" mb={3}>
                <Box
                  sx={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #5C6BC0 0%, #7986CB 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 6px 12px rgba(92, 107, 192, 0.3)",
                    mr: 2,
                  }}
                >
                  <MDTypography variant="h5" color="white">
                    👥
                  </MDTypography>
                </Box>
                <MDTypography variant="h5" fontWeight="medium">
                  Ekip Üyeleri
                </MDTypography>
              </MDBox>

              <MDTypography variant="body2" color="text" mb={3}>
                Bu projeye atanan ekip üyelerini ve proje yöneticisini görüntüleyin ve yönetin.
                {/* Şu an{" "}
                {teamM.activeMembers} / {statistics.totalMembers} üye aktif. */}
              </MDTypography>

              <MDButton
                variant="gradient"
                color="dark"
                // disabled
                fullWidth
                sx={{
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                  padding: "10px",
                }}
                onClick={() => handleTeamMembersDialog()}
              >
                Ekip Üyelerini Görüntüle
              </MDButton>
            </Card>
          </Grid>
        </Grid>
      </Card>
      <TeamDialog
        open={open}
        onClose={() => setOpen(false)}
        teamMembers={teamMembers}
        selectedProjectId={selectedTicketProject?.id || ""}
        handlePageChange={handlePageChange}
      />
    </MDBox>
  );
}

export default ProjectDashboard;
