import React, { useEffect, useMemo, useRef, useState } from "react";

// MUI
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Icon from "@mui/material/Icon";
import Drawer from "@mui/material/Drawer";
import Chip from "@mui/material/Chip";
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

function ProjectsDashboard(): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
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

  type ProjectListItem = { id: string; name: string; status: string };
  const projects = useMemo<ProjectListItem[]>(
    () => Array.from({ length: 80 }, (_, i) => ({
      id: String(1000 + i),
      name: `Proje ${i + 1}`,
      status: (i % 3 === 0 ? "Aktif" : i % 3 === 1 ? "Beklemede" : "Tamamlandı"),
    })),
    []
  );
  // Auto-navigate to first project when no id is provided
  useEffect(() => {
    if (!id && projects.length > 0) {
      navigate(`/projects/${projects[0].id}/overview`, { replace: true });
    }
  }, [id, projects, navigate]);

  // Rudimentary virtualization for sidebar list
  const rowHeight = 56;
  const viewportRows = 10;
  const [startIndex, setStartIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const nextStart = Math.floor(el.scrollTop / rowHeight);
    setStartIndex(Math.max(0, Math.min(nextStart, Math.max(0, projects.length - viewportRows))));
  };
  const endIndex = Math.min(projects.length, startIndex + viewportRows + 3);

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
                <MDTypography variant="body2" color="text">
                  Projelerinizi keşfedin, filtreleyin ve hızlıca işlem yapın.
                </MDTypography>
              </Grid>
              <Grid item xs={12} md={5} sx={{ textAlign: "right" }}>
                {!isMdUp && (
                  <MDButton variant="text" color="info" onClick={() => setMobileSidebarOpen(true)} sx={{ mr: 1 }}>
                    <Icon>menu_open</Icon>&nbsp; Panel
                  </MDButton>
                )}
                <MDButton variant="gradient" color="info">
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
                        <MDTypography variant="h6">Bir proje seçin</MDTypography>
                        <MDTypography variant="body2" color="text">Soldaki listeden bir proje seçildiğinde detay burada açılır.</MDTypography>
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
        onSelect={(pid) => { setSwitcherOpen(false); navigate(`/projects/${pid}/overview`); }}
        projects={projects}
      />
      <Footer />
    </DashboardLayout>
  );
}

export default ProjectsDashboard;


