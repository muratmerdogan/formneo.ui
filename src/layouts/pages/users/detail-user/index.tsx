
import React, { useEffect, useState } from "react";
import { Card, Grid, Typography, Divider, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useLocation } from "react-router-dom";
import { getDepartments, Department } from "api/departmentService";
import { getPositions, Position } from "api/positionService";

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
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [openAssign, setOpenAssign] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("");

  useEffect(() => {
    getDepartments({ isActive: true }).then(setDepartments);
    getPositions({ isActive: true }).then(setPositions);
  }, []);

  const handleAssign = () => {
    // Eski atamaları pasif yap, yeni atamayı aktif olarak ekle
    setUser((prev) => ({
      ...prev,
      department: { name: departments.find((d) => d.id === selectedDepartment)?.name || "", isActive: true },
      position: { name: positions.find((p) => p.id === selectedPosition)?.name || "", isActive: true },
      departmentHistory: [
        { name: departments.find((d) => d.id === selectedDepartment)?.name || "", isActive: true, assignedAt: new Date().toISOString().slice(0, 10) },
        ...prev.departmentHistory.map((d) => ({ ...d, isActive: false })),
      ],
      positionHistory: [
        { name: positions.find((p) => p.id === selectedPosition)?.name || "", isActive: true, assignedAt: new Date().toISOString().slice(0, 10) },
        ...prev.positionHistory.map((p) => ({ ...p, isActive: false })),
      ],
    }));
    setOpenAssign(false);
  };

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
            <Button variant="contained" color="info" onClick={() => setOpenAssign(true)}>Pozisyon / Departman Ata</Button>
          </Card>
        </Grid>
      </Grid>
      {/* Atama Modalı */}
      <Dialog open={openAssign} onClose={() => setOpenAssign(false)}>
        <DialogTitle>Pozisyon / Departman Ata</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Departman</InputLabel>
            <Select
              value={selectedDepartment}
              label="Departman"
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {departments.map((dep) => (
                <MenuItem key={dep.id} value={dep.id}>{dep.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Pozisyon</InputLabel>
            <Select
              value={selectedPosition}
              label="Pozisyon"
              onChange={(e) => setSelectedPosition(e.target.value)}
            >
              {positions.map((pos) => (
                <MenuItem key={pos.id} value={pos.id}>{pos.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssign(false)}>İptal</Button>
          <Button onClick={handleAssign} variant="contained" color="info" disabled={!selectedDepartment || !selectedPosition}>Ata</Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </DashboardLayout>
  );
};

export default UserDetail;
