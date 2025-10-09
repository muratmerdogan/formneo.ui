import React, { useEffect, useMemo, useRef, useState } from "react";

// MUI
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Icon from "@mui/material/Icon";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Local components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { useNavigate, useParams } from "react-router-dom";
import ProjectShell from "./ProjectShell";
import ProjectSwitcher from "./ProjectSwitcher";
import ProjectCreateDialog from "./ProjectCreateDialog";
import { TenantProjectsApi } from "api/generated/api";
import getConfiguration from "confiuration";

function ProjectsDashboard(): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [switcherProjects, setSwitcherProjects] = useState<{ id: string; name: string }[]>([]);
  const [search, setSearch] = useState("");
  // Global keyboard shortcut (Cmd/Ctrl+K) to open switcher
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmd = isMac ? e.metaKey : e.ctrlKey;
      if (cmd && (e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setSwitcherOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  // Removed mock projects; using real data from switcherProjects

  useEffect(() => {
    (async () => {
      try {
        const api = new TenantProjectsApi(getConfiguration());
        const res: any = await api.apiTenantProjectsGet();
        const items: any[] = (res as any)?.data || [];
        setSwitcherProjects(items.map((p: any) => ({ id: String(p.id || p.projectId || ""), name: String(p.name || p.title || "") })));
      } catch {
        setSwitcherProjects([]);
      }
    })();
  }, []);
  // Auto-redirect removed: stay on /projects until user selects a project

  // no right preview drawer in master-detail layout

  const openProject = (id: string) => navigate(`/projects/${id}/tasks`);

  // Sidebar removed in favor of command-palette switcher

  return (
    <DashboardLayout>
      <MDBox sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1300 }}>
        <DashboardNavbar light absolute />
      </MDBox>

      <MDBox mt={10} mb={3} mx={0.5}>
        <MDBox p={3}>
          {/* Header */}
          <MDBox>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} md={7}>
                <MDTypography variant="h4">Projeler</MDTypography>
              </Grid>
              <Grid item xs={12} md={5} sx={{ textAlign: "right" }}>
                {!isMdUp && (
                  <MDButton variant="text" color="info" onClick={() => setMobileSidebarOpen(true)} sx={{ mr: 1 }}>
                    <Icon>menu_open</Icon>&nbsp; Panel
                  </MDButton>
                )}
                <MDButton variant="gradient" color="info" onClick={() => setCreateOpen(true)}>
                  <Icon>add</Icon>&nbsp; Yeni Proje
                </MDButton>
              </Grid>
            </Grid>
          </MDBox>

          {/* Content with Sidebar (Master-Detail) */}
          <MDBox mt={3}>
            <Grid container spacing={3}>
              {/* Header quick switcher button */}
              {/* Quick switcher is integrated as a header pill in ProjectShell; extra row removed */}

              {/* Main Content: Project Detail (tabs) */}
              <Grid item xs={12}>
                <MDBox>
                  {id ? (
                    <ProjectShell embedded onOpenSwitcher={() => setSwitcherOpen(true)} />
                  ) : (
                    <Card>
                      <CardContent>
                        <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                          <MDTypography variant="h6">Projeler</MDTypography>
                          <MDButton variant="text" color="info" onClick={() => setSwitcherOpen(true)}>
                            <Icon>search</Icon>&nbsp; Hızlı Seç (Cmd/Ctrl+K)
                          </MDButton>
                        </MDBox>
                        <MDBox mb={1.5}>
                          <MDInput
                            fullWidth
                            placeholder="Proje ara..."
                            value={search}
                            onChange={(e: any) => setSearch(String(e.target.value || ""))}
                          />
                        </MDBox>
                        {switcherProjects.length > 0 ? (
                          <List>
                            {switcherProjects
                              .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
                              .map((p, idx, arr) => (
                              <React.Fragment key={p.id}>
                                <ListItem button onClick={() => openProject(p.id)}>
                                  <ListItemText primary={p.name} />
                                </ListItem>
                                  {idx < arr.length - 1 && <Divider component="li" />}
                              </React.Fragment>
                            ))}
                          </List>
                        ) : (
                          <MDTypography variant="body2" color="text">Proje bulunamadı.</MDTypography>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </MDBox>
      {/* Command-palette Project Switcher */}
      <ProjectSwitcher
        open={switcherOpen}
        onClose={() => setSwitcherOpen(false)}
        onSelect={(pid) => { setSwitcherOpen(false); navigate(`/projects/${pid}/tasks`); }}
        projects={switcherProjects}
      />
      <ProjectCreateDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreated={() => { /* optionally refresh list here */ }} />
      <Footer />
    </DashboardLayout>
  );
}

export default ProjectsDashboard;


