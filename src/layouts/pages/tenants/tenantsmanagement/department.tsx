import React, { useEffect, useState } from "react";
import {
  getDepartments,
  addDepartment,
  updateDepartment,
  softDeleteDepartment,
  Department,
} from "api/departmentService";
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

const defaultForm = { name: "", code: "", parentDepartmentId: "", isActive: true };

function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState<any>(defaultForm);
  const [editId, setEditId] = useState<string | null>(null);

  const fetch = async () => {
    const isActive = activeFilter === "all" ? null : activeFilter === "active";
    setDepartments(await getDepartments({ search, isActive }));
  };

  useEffect(() => { fetch(); }, [search, activeFilter]);

  const handleEdit = (dep: Department) => {
    setForm(dep);
    setEditId(dep.id);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    await softDeleteDepartment(id);
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
      await updateDepartment(editId, form);
    } else {
      await addDepartment(form);
    }
    handleDialogClose();
    fetch();
  };

  return (
    <MDBox p={3}>
      <Typography variant="h4" mb={2}>Departman Yönetimi</Typography>
      <Card sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <MDInput
              label="Ara (Ad/Kod)"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Aktif/Pasif</InputLabel>
              <Select
                value={activeFilter}
                label="Aktif/Pasif"
                onChange={e => setActiveFilter(e.target.value)}
              >
                <MenuItem value="all">Tümü</MenuItem>
                <MenuItem value="active">Aktif</MenuItem>
                <MenuItem value="passive">Pasif</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <MDButton color="info" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
              Yeni Departman
            </MDButton>
          </Grid>
        </Grid>
      </Card>
      <Card>
        <Grid container sx={{ p: 2, fontWeight: 600, borderBottom: "1px solid #eee" }}>
          <Grid item xs={3}>Ad</Grid>
          <Grid item xs={2}>Kod</Grid>
          <Grid item xs={3}>Bağlı Departman</Grid>
          <Grid item xs={2}>Durum</Grid>
          <Grid item xs={2}>Aksiyonlar</Grid>
        </Grid>
        {departments.map(dep => (
          <Grid container key={dep.id} sx={{ p: 2, borderBottom: "1px solid #f5f5f5" }} alignItems="center">
            <Grid item xs={3}>{dep.name}</Grid>
            <Grid item xs={2}>{dep.code}</Grid>
            <Grid item xs={3}>{departments.find(d => d.id === dep.parentDepartmentId)?.name || "-"}</Grid>
            <Grid item xs={2}>
              <Switch checked={dep.isActive} disabled />
              {dep.isActive ? "Aktif" : "Pasif"}
            </Grid>
            <Grid item xs={2}>
              <IconButton color="info" onClick={() => handleEdit(dep)}><EditIcon /></IconButton>
              <IconButton color="error" onClick={() => handleDelete(dep.id)}><DeleteIcon /></IconButton>
            </Grid>
          </Grid>
        ))}
        {departments.length === 0 && (
          <Typography align="center" sx={{ p: 3, color: "#aaa" }}>Kayıt bulunamadı.</Typography>
        )}
      </Card>
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? "Departman Düzenle" : "Yeni Departman"}</DialogTitle>
        <DialogContent>
          <MDInput
            label="Ad *"
            value={form.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <MDInput
            label="Kod"
            value={form.code}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, code: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Bağlı Departman</InputLabel>
            <Select
              value={form.parentDepartmentId || ""}
              label="Bağlı Departman"
              onChange={e => setForm({ ...form, parentDepartmentId: e.target.value })}
            >
              <MenuItem value="">Yok</MenuItem>
              {departments.filter(d => !editId || d.id !== editId).map(d => (
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

export default DepartmentManagement;
