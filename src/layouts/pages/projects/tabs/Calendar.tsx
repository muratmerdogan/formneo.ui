import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Calendar from "examples/Calendar";

// Demo event verisi (gün, hafta, ay, tatil, görev)
// Türkiye 2025 resmi tatilleri (örnek)
const turkiyeResmiTatilleri = [
  { title: "Yılbaşı", date: "2025-01-01" },
  { title: "Ulusal Egemenlik ve Çocuk Bayramı", date: "2025-04-23" },
  { title: "Emek ve Dayanışma Günü", date: "2025-05-01" },
  { title: "Atatürk'ü Anma, Gençlik ve Spor Bayramı", date: "2025-05-19" },
  { title: "Demokrasi ve Milli Birlik Günü", date: "2025-07-15" },
  { title: "Zafer Bayramı", date: "2025-08-30" },
  { title: "Cumhuriyet Bayramı", date: "2025-10-29" },
  // Ramazan Bayramı (31 Mart - 2 Nisan 2025)
  { title: "Ramazan Bayramı 1. Gün", date: "2025-03-31" },
  { title: "Ramazan Bayramı 2. Gün", date: "2025-04-01" },
  { title: "Ramazan Bayramı 3. Gün", date: "2025-04-02" },
  // Kurban Bayramı (8-11 Haziran 2025)
  { title: "Kurban Bayramı 1. Gün", date: "2025-06-08" },
  { title: "Kurban Bayramı 2. Gün", date: "2025-06-09" },
  { title: "Kurban Bayramı 3. Gün", date: "2025-06-10" },
  { title: "Kurban Bayramı 4. Gün", date: "2025-06-11" },
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
  // Resmi tatilleri ekle
  ...turkiyeResmiTatilleri.map(tatil => ({
    title: tatil.title,
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


