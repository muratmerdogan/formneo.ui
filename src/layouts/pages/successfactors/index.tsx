import { useMemo } from "react";

// @mui
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Avatar from "@mui/material/Avatar";

// Project components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAvatar from "components/MDAvatar";

// Images
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";

import { useNavigate } from "react-router-dom";

type QuickAction = {
    label: string;
    icon: string;
    route: string;
    color?: "primary" | "info" | "success" | "warning" | "error" | "secondary";
};

export default function SuccessFactorsHome() {
    const navigate = useNavigate();

    const quickActions: QuickAction[] = useMemo(
        () => [
            { label: "Talep Oluştur", icon: "add_circle", route: "/tickets/detail", color: "info" },
            { label: "Onaylarım", icon: "verified", route: "/approve", color: "success" },
            { label: "Görevlerim", icon: "checklist", route: "/userTasks", color: "primary" },
            { label: "Takvim", icon: "event", route: "/calendar", color: "secondary" },
            { label: "Ekipler", icon: "groups", route: "/teams", color: "warning" },
            { label: "Org Chart", icon: "account_tree", route: "/organizationalChart" },
        ],
        []
    );

    const todos = useMemo(
        () => [
            { id: 1, title: "3 bekleyen onay", icon: "approval" },
            { id: 2, title: "2 açık görev", icon: "task" },
            { id: 3, title: "1 yaklaşan toplantı", icon: "event_upcoming" },
        ],
        []
    );

    const announcements = useMemo(
        () => [
            { id: 1, title: "Yeni sürüm yayınlandı", subtitle: "Form yönetiminde iyileştirmeler" },
            { id: 2, title: "Planlı bakım", subtitle: "Pazar 02:00-04:00 arası" },
        ],
        []
    );

    return (
        <MDBox p={3}>
            {/* Hero */}
            <Card>
                <MDBox p={3} sx={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(14,165,233,0.08))",
                    borderRadius: "0.75rem",
                }}>
                    <MDBox display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} justifyContent="space-between" gap={2}>
                        <MDBox>
                            <MDTypography variant="h4" fontWeight="medium">Hoş geldiniz</MDTypography>
                            <MDTypography variant="button" color="text">Bugünün işlerinize hızlı bir başlangıç yapın</MDTypography>
                        </MDBox>
                        <MDBox display="flex" alignItems="center" gap={1} width={{ xs: "100%", md: "40%" }}>
                            <MDInput fullWidth placeholder="Hızlı arama..." />
                            <MDButton variant="gradient" color="info">
                                <Icon>search</Icon>
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>

            {/* Quick actions */}
            <MDBox mt={3}>
                <Grid container spacing={3}>
                    {quickActions.map((qa) => (
                        <Grid item xs={12} sm={6} md={4} key={qa.label}>
                            <Card onClick={() => navigate(qa.route)} style={{ cursor: "pointer" }}>
                                <MDBox p={3} display="flex" alignItems="center" gap={2}>
                                    <MDBox display="grid" placeItems="center" width={40} height={40} borderRadius="md" color="white" bgColor={qa.color ?? "info"}>
                                        <Icon> {qa.icon} </Icon>
                                    </MDBox>
                                    <MDTypography variant="button" fontWeight="medium">{qa.label}</MDTypography>
                                </MDBox>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </MDBox>

            <MDBox mt={3}>
                <Grid container spacing={3}>
                    {/* To-do / Approvals */}
                    <Grid item xs={12} md={6} lg={4}>
                        <Card>
                            <MDBox p={3}>
                                <MDTypography variant="h6">Size Atananlar</MDTypography>
                            </MDBox>
                            <Divider />
                            <MDBox p={2}>
                                {todos.map((t) => (
                                    <MDBox key={t.id} display="flex" alignItems="center" justifyContent="space-between" p={1.5} borderRadius="md" sx={{ cursor: "pointer", transition: ".2s", "&:hover": { backgroundColor: "#f8f9fa" } }}>
                                        <MDBox display="flex" alignItems="center" gap={1}>
                                            <Icon fontSize="small">{t.icon}</Icon>
                                            <MDTypography variant="button" color="text">{t.title}</MDTypography>
                                        </MDBox>
                                        <Icon fontSize="small">chevron_right</Icon>
                                    </MDBox>
                                ))}
                            </MDBox>
                        </Card>
                    </Grid>

                    {/* KPIs */}
                    <Grid item xs={12} md={6} lg={4}>
                        <Card>
                            <MDBox p={3}>
                                <MDTypography variant="h6">Anlık Göstergeler</MDTypography>
                            </MDBox>
                            <Divider />
                            <MDBox p={2} display="grid" gridTemplateColumns={{ xs: "1fr 1fr" }} gap={1.5}>
                                <Card>
                                    <MDBox p={2}>
                                        <MDTypography variant="h5">8</MDTypography>
                                        <MDTypography variant="caption" color="text">Açık Görev</MDTypography>
                                    </MDBox>
                                </Card>
                                <Card>
                                    <MDBox p={2}>
                                        <MDTypography variant="h5">3</MDTypography>
                                        <MDTypography variant="caption" color="text">Bekleyen Onay</MDTypography>
                                    </MDBox>
                                </Card>
                                <Card>
                                    <MDBox p={2}>
                                        <MDTypography variant="h5">2</MDTypography>
                                        <MDTypography variant="caption" color="text">Yaklaşan Etkinlik</MDTypography>
                                    </MDBox>
                                </Card>
                                <Card>
                                    <MDBox p={2}>
                                        <MDTypography variant="h5">5</MDTypography>
                                        <MDTypography variant="caption" color="text">Yeni Bildirim</MDTypography>
                                    </MDBox>
                                </Card>
                            </MDBox>
                        </Card>
                    </Grid>

                    {/* Announcements */}
                    <Grid item xs={12} md={6} lg={4}>
                        <Card>
                            <MDBox p={3}>
                                <MDTypography variant="h6">Duyurular</MDTypography>
                            </MDBox>
                            <Divider />
                            <MDBox p={2}>
                                {announcements.map((a) => (
                                    <MDBox key={a.id} p={1.5} borderRadius="md" mb={0.5} sx={{ cursor: "pointer", transition: ".2s", "&:hover": { backgroundColor: "#f8f9fa" } }}>
                                        <MDTypography variant="button" fontWeight="medium">{a.title}</MDTypography>
                                        <MDTypography variant="caption" color="text">{a.subtitle}</MDTypography>
                                    </MDBox>
                                ))}
                            </MDBox>
                        </Card>
                    </Grid>

                    {/* Shortcuts / Suggested */}
                    <Grid item xs={12} lg={4}>
                        <Card>
                            <MDBox p={3}>
                                <MDTypography variant="h6">Kısayollar</MDTypography>
                            </MDBox>
                            <Divider />
                            <MDBox p={2} display="grid" gridTemplateColumns={{ xs: "1fr 1fr" }} gap={1.5}>
                                <MDButton color="info" variant="outlined" onClick={() => navigate("/settings/parameters")}>Form Parametreleri</MDButton>
                                <MDButton color="success" variant="outlined" onClick={() => navigate("/menus")}>Menüler</MDButton>
                                <MDButton color="warning" variant="outlined" onClick={() => navigate("/inventory")}>Envanter</MDButton>
                                <MDButton color="primary" variant="outlined" onClick={() => navigate("/projectManagement")}>Projeler</MDButton>
                            </MDBox>
                        </Card>
                    </Grid>

                    {/* My Team */}
                    <Grid item xs={12} lg={8}>
                        <Card>
                            <MDBox p={3} display="flex" alignItems="center" justifyContent="space-between">
                                <MDTypography variant="h6">Ekibim</MDTypography>
                                <MDButton variant="outlined" color="info" size="small" onClick={() => navigate("/userProjects")}>Tümünü Gör</MDButton>
                            </MDBox>
                            <Divider />
                            <MDBox p={2} display="flex" alignItems="center" gap={2} flexWrap="wrap">
                                <MDAvatar src={team1} alt="Üye 1" size="md" />
                                <MDAvatar src={team2} alt="Üye 2" size="md" />
                                <MDAvatar src={team3} alt="Üye 3" size="md" />
                                <Avatar sx={{ width: 40, height: 40 }}>+5</Avatar>
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </MDBox>
    );
}


