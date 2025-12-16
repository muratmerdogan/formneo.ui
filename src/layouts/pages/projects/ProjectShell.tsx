import React, { useEffect, useState } from "react";

// MUI
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";

// Local components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import { useNavigate, useParams, useLocation } from "react-router-dom";
import { TenantProjectsApi } from "api/generated/api";
import getConfiguration from "confiuration";
import OverviewTab from "./tabs/Overview";
import TasksTab from "./tabs/Tasks";
import CalendarTab from "./tabs/Calendar";
import FilesTab from "./tabs/Files";
import ReportsTab from "./tabs/Reports";
import SettingsTab from "./tabs/Settings";

const TABS = ["overview", "tasks", "calendar", "files", "reports", "settings"] as const;

type ProjectShellProps = {
  embedded?: boolean;
  onOpenSwitcher?: () => void;
};

function ProjectShell({ embedded, onOpenSwitcher }: ProjectShellProps): JSX.Element {
  const navigate = useNavigate();
  const { id, tab } = useParams<{ id: string; tab?: string }>();
  const location = useLocation();

  const [projectName, setProjectName] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        if (!id) { setProjectName(""); return; }
        const api = new TenantProjectsApi(getConfiguration());
        const res: any = await api.apiTenantProjectsIdGet(id);
        const data: any = (res && (res.data ?? res)) || {};
        setProjectName(String(data.name || data.title || ""));
      } catch {
        setProjectName("");
      }
    })();
  }, [id]);

  const currentTab = (tab && TABS.includes(tab as any) ? tab : "tasks") as typeof TABS[number];

  const handleChange = (_: React.SyntheticEvent, value: string) => {
    if (!id) return;
    navigate(`/projects/${id}/${value}`);
  };

  const Content = (
    <MDBox>
      {/* Ana listeye dön butonu */}
      <MDBox mb={2}>
        <MDButton
          variant="outlined"
          color="info"
          size="small"
          startIcon={<Icon>arrow_back</Icon>}
          onClick={() => navigate("/projects")}
          sx={{ borderRadius: 8, fontWeight: 500 }}
        >
          Projeler Sayfasına Dön
        </MDButton>
      </MDBox>

      {/* Header with project name and quick actions */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <MDTypography variant="h4">
            {projectName ? `Proje: ${projectName}` : "Proje"}
            <MDBox component="span" ml={1} onClick={() => { if (onOpenSwitcher) onOpenSwitcher(); else if (id) navigate(`/projects/${id}/tasks`); }} sx={{ cursor: "pointer", display: "inline-flex", alignItems: "center", px: 1.5, py: 0.5, borderRadius: 9999, border: "1px solid", borderColor: "divider", ml: 1 }}>
              <Icon sx={{ fontSize: 18, mr: 0.5 }}>swap_horiz</Icon> Proje Değiştir
            </MDBox>
          </MDTypography>
          <MDTypography variant="body2" color="text">
            Proje detayları ve çalışma alanları arasında hızlı geçiş yapın.
          </MDTypography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" } }}>
          <MDBox sx={{ display: "inline-flex", maxWidth: "100%" }}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "nowrap", overflowX: "auto", whiteSpace: "nowrap" }}>
              <MDButton variant="outlined" color="info" size="small"><Icon sx={{ fontSize: 18, mr: 0.5 }}>add_task</Icon>Görev</MDButton>
              <MDButton variant="outlined" color="info" size="small"><Icon sx={{ fontSize: 18, mr: 0.5 }}>upload</Icon>Dosya</MDButton>
              <MDButton variant="outlined" color="info" size="small"><Icon sx={{ fontSize: 18, mr: 0.5 }}>file_download</Icon>Rapor</MDButton>
              <MDButton variant="outlined" color="info" size="small"><Icon sx={{ fontSize: 18, mr: 0.5 }}>smart_toy</Icon>Ask AI</MDButton>
              <MDButton variant="text" color="info" size="small"><Icon sx={{ fontSize: 18, mr: 0.5 }}>share</Icon>Paylaş</MDButton>
            </Stack>
          </MDBox>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={currentTab} onChange={handleChange} variant="scrollable" scrollButtons>
          <Tab icon={<Icon>space_dashboard</Icon>} iconPosition="start" value="overview" label="Overview" />
          <Tab icon={<Icon>view_kanban</Icon>} iconPosition="start" value="tasks" label="Tasks" />
          <Tab icon={<Icon>event</Icon>} iconPosition="start" value="calendar" label="Calendar" />
          <Tab icon={<Icon>folder</Icon>} iconPosition="start" value="files" label="Files" />
          <Tab icon={<Icon>bar_chart</Icon>} iconPosition="start" value="reports" label="Reports" />
          <Tab icon={<Icon>settings</Icon>} iconPosition="start" value="settings" label="Settings" />
        </Tabs>
      </Box>

      <MDBox mt={3}>
        {currentTab === "overview" && <OverviewTab />}
        {currentTab === "tasks" && <TasksTab />}
        {currentTab === "calendar" && <CalendarTab />}
        {currentTab === "files" && <FilesTab />}
        {currentTab === "reports" && <ReportsTab />}
        {currentTab === "settings" && <SettingsTab />}
      </MDBox>
    </MDBox>
  );

  if (embedded) {
    return (
      <MDBox>
        {Content}
      </MDBox>
    );
  }

  return (
    <DashboardLayout>
      <MDBox width="calc(100% - 48px)" position="absolute" top="1.75rem">
        <DashboardNavbar light absolute />
      </MDBox>
      <MDBox mt={5} mb={3} mx={0.5}>
        <MDBox p={3}>{Content}</MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ProjectShell;


