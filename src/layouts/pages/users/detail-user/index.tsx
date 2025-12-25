import React, { useEffect, useState } from "react";
import { Card, Grid, Typography, Divider, Chip, Button } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useLocation } from "react-router-dom";

// TODO: API'den veri çekilecek
const mockUser = {
  firstName: "Ali",
  lastName: "Kaan",
  email: "ali.kaan@example.com",
  status: "Active",
  department: { name: "Satış", isActive: true },
  position: { name: "Müdür", isActive: true },
  departmentHistory: [
    { name: "Satış", isActive: true, assignedAt: "2024-01-01" },
    { name: "Pazarlama", isActive: false, assignedAt: "2023-01-01" },
  ],
  positionHistory: [
    { name: "Müdür", isActive: true, assignedAt: "2024-01-01" },
    { name: "Genel Müdür", isActive: false, assignedAt: "2023-01-01" },
  ],
};

const UserDetail = () => {
  const location = useLocation();
  // const { userId } = location.state || {};
  // TODO: userId ile API'den veri çekilecek

  const [user, setUser] = useState(mockUser);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Profil */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Profil</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography><b>Ad Soyad:</b> {user.firstName} {user.lastName}</Typography>
            <Typography><b>E-posta:</b> {user.email}</Typography>
            <Typography>
              <b>Durum:</b> <Chip label={user.status} color={user.status === "Active" ? "success" : "default"} size="small" />
            </Typography>
          </Card>
        </Grid>
        {/* Organization */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Organization</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography><b>Departman:</b> {user.department?.name}</Typography>
            <Typography><b>Pozisyon:</b> {user.position?.name}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">Departman Geçmişi</Typography>
            {user.departmentHistory.map((d, i) => (
              <Typography key={i}>
                {d.name} - {d.assignedAt} <Chip label={d.isActive ? "Aktif" : "Pasif"} size="small" color={d.isActive ? "success" : "default"} />
              </Typography>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">Pozisyon Geçmişi</Typography>
            {user.positionHistory.map((p, i) => (
              <Typography key={i}>
                {p.name} - {p.assignedAt} <Chip label={p.isActive ? "Aktif" : "Pasif"} size="small" color={p.isActive ? "success" : "default"} />
              </Typography>
            ))}
            <Divider sx={{ my: 2 }} />
            <Button variant="contained" color="info">Pozisyon / Departman Ata</Button>
          </Card>
        </Grid>
      </Grid>
      <Footer />
    </DashboardLayout>
  );
};

export default UserDetail;
