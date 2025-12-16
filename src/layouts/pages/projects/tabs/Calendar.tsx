import React, { useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Calendar from "examples/Calendar";
import { IconButton, Tooltip, Icon, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack } from "@mui/material";

// Demo event verisi (gün, hafta, ay, tatil, görev)
// Türkiye 2025 ve 2026 resmi tatilleri (her biri 'Resmi Tatil' olarak gösterilecek)
const turkiyeResmiTatilleri = [
  // 2025
  { date: "2025-01-01" }, // Yılbaşı
  { date: "2025-03-31" }, // Ramazan Bayramı 1
  { date: "2025-04-01" }, // Ramazan Bayramı 2
  { date: "2025-04-02" }, // Ramazan Bayramı 3
  { date: "2025-04-23" }, // 23 Nisan
  { date: "2025-05-01" }, // 1 Mayıs
  { date: "2025-05-19" }, // 19 Mayıs
  { date: "2025-06-08" }, // Kurban Bayramı 1
  { date: "2025-06-09" }, // Kurban Bayramı 2
  { date: "2025-06-10" }, // Kurban Bayramı 3
  { date: "2025-06-11" }, // Kurban Bayramı 4
  { date: "2025-07-15" }, // 15 Temmuz
  { date: "2025-08-30" }, // 30 Ağustos
  { date: "2025-10-29" }, // 29 Ekim
  // 2026
  { date: "2026-01-01" }, // Yılbaşı
  { date: "2026-03-20" }, // Ramazan Bayramı 1
  { date: "2026-03-21" }, // Ramazan Bayramı 2
  { date: "2026-03-22" }, // Ramazan Bayramı 3
  { date: "2026-04-23" }, // 23 Nisan
  { date: "2026-05-01" }, // 1 Mayıs
  { date: "2026-05-19" }, // 19 Mayıs
  { date: "2026-05-27" }, // Kurban Bayramı 1
  { date: "2026-05-28" }, // Kurban Bayramı 2
  { date: "2026-05-29" }, // Kurban Bayramı 3
  { date: "2026-05-30" }, // Kurban Bayramı 4
  { date: "2026-07-15" }, // 15 Temmuz
  { date: "2026-08-30" }, // 30 Ağustos
  { date: "2026-10-29" }, // 29 Ekim
];

const demoEvents = [
  {
    title: "Proje Başlangıcı",
    start: new Date().toISOString().slice(0, 10),
    end: new Date().toISOString().slice(0, 10),
    className: "info",
  },
  {
    title: "Toplantı",
    start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    className: "success",
  },
  {
    title: "Görev Teslimi",
    start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    className: "warning",
  },
  
  ...turkiyeResmiTatilleri.map(tatil => ({
    title: "Resmi Tatil",
    start: tatil.date,
    end: tatil.date,
    className: "error", // Kırmızı renk
  })),
];





function CalendarTab(): JSX.Element {
  const [events, setEvents] = useState(demoEvents);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");

  const handleAddEvent = () => {
    if (!newTitle.trim() || !newDate) return;
    setEvents([
      ...events,
      {
        title: newTitle,
        start: newDate,
        end: newDate,
        className: "info",
      },
    ]);
    setDialogOpen(false);
    setNewTitle("");
    setNewDate("");
  };

  return (
    <MDBox>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <MDTypography variant="h6">Takvim</MDTypography>
        <Button
          variant="contained"
          color="info"
          startIcon={<Icon>add</Icon>}
          onClick={() => setDialogOpen(true)}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
        >
          Yeni Etkinlik
        </Button>
      </Stack>
      <Calendar
        header={{ title: "Proje Takvimi" }}
        initialView="dayGridMonth"
        events={events}
        height={600}
        eventContent={(arg: any) => {
          const id = arg.event.id || arg.event._def.publicId || arg.event.startStr + arg.event.title;
          return (
            <div
              onMouseEnter={() => setHoveredEventId(id)}
              onMouseLeave={() => setHoveredEventId(null)}
              style={{
                position: "relative",
                paddingRight: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 28,
                width: "100%"
              }}
            >
              <span style={{ width: "100%", textAlign: "center", fontWeight: 500 }}>{arg.event.title}</span>
              {hoveredEventId === id && (
                <Tooltip title="Sil" placement="top">
                  <IconButton
                    size="small"
                    color="error"
                    sx={{ position: "absolute", top:0, right: 0, zIndex: 2 }}
                    onClick={e => {
                      e.stopPropagation();
                      setEvents(evts => evts.filter(ev => {
                        const evId = ev.start + ev.title;
                        return evId !== id;
                      }));
                    }}
                  >
                    <Icon fontSize="small">delete</Icon>
                  </IconButton>
                </Tooltip>
              )}
            </div>
          );
        }}
      />
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Yeni Etkinlik Ekle</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Etkinlik Başlığı"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              fullWidth
              autoFocus
            />
            <TextField
              label="Tarih"
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="inherit">İptal</Button>
          <Button onClick={handleAddEvent} color="info" variant="contained" disabled={!newTitle.trim() || !newDate}>Ekle</Button>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}



export default CalendarTab;


