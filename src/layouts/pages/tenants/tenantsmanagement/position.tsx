
import React, { useEffect, useState } from "react";
import {
  getPositions,
  addPosition,
  updatePosition,
  softDeletePosition,
  Position,
} from "api/positionService";
import { getDepartments, Department } from "api/departmentService";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import {
  Card,
  Typography,
  Grid,
  IconButton,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const defaultForm = { name: "", code: "", departmentId: "", isActive: true };

function PositionManagement() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState<any>(defaultForm);
  const [editId, setEditId] = useState<string | null>(null);

  const fetch = async () => {
    const isActive = activeFilter === "all" ? null : activeFilter === "active";
    const departmentId = departmentFilter === "all" ? undefined : departmentFilter;
    setPositions(await getPositions({ search, departmentId, isActive }));
  };

  useEffect(() => { fetch(); }, [search, departmentFilter, activeFilter]);
  useEffect(() => { getDepartments().then(setDepartments); }, []);

  const handleEdit = (pos: Position) => {
    setForm(pos);
    setEditId(pos.id);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    await softDeletePosition(id);
    fetch();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setForm(defaultForm);
    setEditId(null);
  };

  const handleSave = async () => {
    if (!form.name) return;
    if (editId) {
      await updatePosition(editId, form);
    } else {
      await addPosition(form);
    }
    handleDialogClose();
    fetch();
  };

  return (
    <MDBox p={3}>
      <Typography variant="h4" mb={2}>Pozisyon Yönetimi</Typography>
      <Card sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <MDInput
              label="Ara (Pozisyon Adı/Kodu)"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Departman</InputLabel>
              <Select
                value={departmentFilter}
                label="Departman"
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <MenuItem value="all">Tümü</MenuItem>
                {departments.map(dep => (
                  <MenuItem key={dep.id} value={dep.id}>{dep.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Aktif/Pasif</InputLabel>
              <Select
                value={activeFilter}
                label="Aktif/Pasif"
                onChange={(e) => setActiveFilter(e.target.value)}
              >
                <MenuItem value="all">Tümü</MenuItem>
                <MenuItem value="active">Aktif</MenuItem>
                <MenuItem value="passive">Pasif</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <MDButton color="info" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
              Yeni Pozisyon
            </MDButton>
          </Grid>
        </Grid>
      </Card>
      <Card>
        <Grid container sx={{ p: 2, fontWeight: 600, borderBottom: "1px solid #eee" }}>
          <Grid item xs={3}>Pozisyon Adı</Grid>
          <Grid item xs={2}>Pozisyon Kodu</Grid>
          <Grid item xs={3}>Bağlı Departman</Grid>
          <Grid item xs={2}>Durum</Grid>
          <Grid item xs={2}>Aksiyonlar</Grid>
        </Grid>
        {positions.map(pos => (
          <Grid container key={pos.id} sx={{ p: 2, borderBottom: "1px solid #f5f5f5" }} alignItems="center">
            <Grid item xs={3}>{pos.name}</Grid>
            <Grid item xs={2}>{pos.code}</Grid>
            <Grid item xs={3}>{departments.find(d => d.id === pos.departmentId)?.name || "-"}</Grid>
            <Grid item xs={2}>
              <Switch checked={pos.isActive} disabled />
              {pos.isActive ? "Aktif" : "Pasif"}
            </Grid>
            <Grid item xs={2}>
              <IconButton color="info" onClick={() => handleEdit(pos)}><EditIcon /></IconButton>
              <IconButton color="error" onClick={() => handleDelete(pos.id)}><DeleteIcon /></IconButton>
            </Grid>
          </Grid>
        ))}
        {positions.length === 0 && (
          <Typography align="center" sx={{ p: 3, color: "#aaa" }}>Kayıt bulunamadı.</Typography>
        )}
      </Card>
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? "Pozisyon Düzenle" : "Yeni Pozisyon"}</DialogTitle>
        <DialogContent>
          <MDInput
            label="Pozisyon Adı *"
            value={form.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <MDInput
            label="Pozisyon Kodu"
            value={form.code}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, code: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Bağlı Departman</InputLabel>
            <Select
              value={form.departmentId || ""}
              label="Bağlı Departman"
              onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
            >
              <MenuItem value="">Yok</MenuItem>
              {departments.map(d => (
                <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={form.isActive}
                onChange={e => setForm({ ...form, isActive: e.target.checked })}
              />
            }
            label="Aktif"
          />
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleDialogClose} color="secondary">İptal</MDButton>
          <MDButton onClick={handleSave} color="info">Kaydet</MDButton>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}

export default PositionManagement;
