import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, Icon } from "@mui/material";

interface SpecialDay {
  id: string;
  title: string;
  date: string;
}

const SpecialDaysPage: React.FC = () => {
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDay, setEditDay] = useState<SpecialDay | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  // Backend'den özel günleri çek (dummy fetch, backend ile değiştirilecek)
  useEffect(() => {
    // TODO: Replace with real API call
    setSpecialDays([
      { id: "1", title: "Yılbaşı", date: "2025-01-01" },
      { id: "2", title: "Proje Lansmanı", date: "2025-03-15" },
    ]);
  }, []);

  const handleOpenDialog = (day?: SpecialDay) => {
    if (day) {
      setEditDay(day);
      setTitle(day.title);
      setDate(day.date);
    } else {
      setEditDay(null);
      setTitle("");
      setDate("");
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!title.trim() || !date) return;
    if (editDay) {
      // Güncelle
      setSpecialDays(days => days.map(d => d.id === editDay.id ? { ...d, title, date } : d));
    } else {
      // Ekle
      setSpecialDays(days => [
        ...days,
        { id: Date.now().toString(), title, date },
      ]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setSpecialDays(days => days.filter(d => d.id !== id));
  };

  return (
    <MDBox>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <MDTypography variant="h6">Özel Günler</MDTypography>
        <MDButton variant="outlined" color="info" onClick={() => handleOpenDialog()}>
          <Icon>add</Icon> Yeni Özel Gün
        </MDButton>
      </Stack>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Başlık</TableCell>
              <TableCell>Tarih</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {specialDays.map(day => (
              <TableRow key={day.id}>
                <TableCell>{day.title}</TableCell>
                <TableCell>{day.date}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Düzenle">
                    <IconButton color="info" onClick={() => handleOpenDialog(day)}>
                      <Icon>edit</Icon>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sil">
                    <IconButton color="error" onClick={() => handleDelete(day.id)}>
                      <Icon>delete</Icon>
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {specialDays.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Kayıtlı özel gün yok.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editDay ? "Özel Günü Düzenle" : "Yeni Özel Gün"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Başlık"
              value={title}
              onChange={e => setTitle(e.target.value)}
              fullWidth
              autoFocus
            />
            <TextField
              label="Tarih"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setDialogOpen(false)} color="default">İptal</MDButton>
          <MDButton onClick={handleSave} color="info" variant="contained" disabled={!title.trim() || !date}>{editDay ? "Kaydet" : "Ekle"}</MDButton>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
};

export default SpecialDaysPage;
