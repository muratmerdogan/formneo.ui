import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Calendar from "examples/Calendar";

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
  // Resmi tatilleri ekle (her biri 'Resmi Tatil' başlığıyla)
  ...turkiyeResmiTatilleri.map(tatil => ({
    title: "Resmi Tatil",
    start: tatil.date,
    end: tatil.date,
    className: "error", // Kırmızı renk
  })),
];

function CalendarTab(): JSX.Element {
  return (
    <MDBox>
      <MDTypography variant="h6" mb={2}>Takvim</MDTypography>
      <Calendar
        header={{ title: "Proje Takvimi" }}
        initialView="dayGridMonth"
        events={demoEvents}
        height={600}
      />
    </MDBox>
  );
}

export default CalendarTab;


