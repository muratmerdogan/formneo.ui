import {
  Autocomplete,
  Grid,
  Icon,
  Typography,
  FormControlLabel,
  Checkbox,
  Tooltip,
} from "@mui/material";
import "@ui5/webcomponents-icons/dist/add.js";
import {
  ProjectTasksApi,
  ProjectTasksListDto,
  UserAppDto,
  UserApi,
  UserAppDtoOnlyNameId,
  ChangedTaskListDto,
  TicketProjectsApi,
} from "api/generated";
import MDBox from "components/MDBox";
import getConfiguration from "confiuration";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { useBusy } from "layouts/pages/hooks/useBusy";
import GlobalCell from "layouts/pages/talepYonetimi/allTickets/tableData/globalCell";
import React, { useEffect, useRef, useState, ChangeEvent } from "react";
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

function TicketProjectProgress() {
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
  const [projectsData, setProjectsData] = useState<ChangedTaskListDto[]>([]);
  const { t } = useTranslation();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [isNewProjects, setIsNewProjects] = useState(false);
  const AssignUsersCell = ({ value }: any) => {
    if (!value || value.length === 0) {
      return null;
    }

    if (value.length === 1) {
      const user = value[0];
      return <span>{`${user.firstName} ${user.lastName}`}</span>;
    }

    const firstUser = value[0];
    const otherUsers = value.slice(1);
    const tooltipContent = otherUsers
      .map((user: any) => `${user.firstName} ${user.lastName}`)
      .join(", ");

    return (
      <span>
        {`${firstUser.firstName} ${firstUser.lastName} `}
        <Tooltip title={tooltipContent}>
          <span style={{ color: "#007bff", cursor: "pointer" }}>+{value.length - 1} kişi</span>
        </Tooltip>
      </span>
    );
  };
  const fetchProjects = async () => {
    try {
      if (!start || !end) {
        dispatchAlert({
          message: "Başlangıç ve bitiş tarihleri dolu olmalıdır.",
          type: MessageBoxType.Error,
        });
        return;
      }

      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new TicketProjectsApi(conf);
      var data = await api.apiTicketProjectsGetChangedProjectsGet(start, end, isNewProjects);
      console.log("projects", data.data);
      setProjectsData(data.data);
    } catch (error) {
      dispatchAlert({
        message: "Proje verileri getirilirken hata oluştu.",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };
  const handleFilter = async () => {
    await fetchProjects();
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
      accessor: "managerName",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Proje Yöneticisi</div>
      ),
      Cell: ({ value, row }: any) => <GlobalCell value={value} />,
    },
    {
      accessor: "taskName",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Görev Adı</div>,
      Cell: ({ value, row }: any) => <GlobalCell value={value} />,
    },
    {
      accessor: "progress",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>İlerleme Durumu</div>
      ),
       Cell: ({ value }: any) => <GlobalCell value={`% ${value}`} />,
    },
    {
      accessor: "assignUsers",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          Atanan Kullanıcılar
        </div>
      ),
      Cell: AssignUsersCell,
    },
    {
      accessor: "changeType",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Değişiklik Tipi</div>
      ),
      Cell: ({ value, row }: any) => <GlobalCell value={value} />,
    },
    {
      accessor: "dateOfChange",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          Değişiklik Tarihi
        </div>
      ),
       Cell: ({ value, row }: any) => <GlobalCell value={formatDate(value)} />,
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
                Proje Değişiklik Takibi
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#7b809a",
                }}
              >
                Projelerinizi görüntüleyin ve dahası
              </Typography>
            </MDBox>
          </ObjectPageTitle>
        }
      >
        <MDBox>
          <Grid container spacing={3} sx={{ p: 3 }}>
            <Grid item xs={12} md={12}>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <MDInput
                    label="Başlangıç Tarihi"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                      sx: {
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        color: "text.primary",
                        mb: 0.5,
                      },
                    }}
                    value={start}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setStart(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <MDInput
                    label="Bitiş Tarihi"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                      sx: {
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        color: "text.primary",
                        mb: 0.5,
                      },
                    }}
                    value={end}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEnd(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isNewProjects}
                        onChange={(e) => setIsNewProjects(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Yeni eklenen projeleri de getir."
                  />
                </Grid>
                <Grid item xs={6} md={1}>
                  <MDButton
                    variant="gradient"
                    color="info"
                    fullWidth
                    onClick={handleFilter}
                    sx={{ height: "100%" }}
                  >
                    Getir
                  </MDButton>
                </Grid>
              </Grid>
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
                      rows: projectsData,
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

export default TicketProjectProgress;
