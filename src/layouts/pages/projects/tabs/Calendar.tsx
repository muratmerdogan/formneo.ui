import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Calendar from "examples/Calendar";

// Demo event verisi (gün, hafta, ay, tatil, görev)
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
    title: "Resmi Tatil",
    start: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    className: "error",
  },
  {
    title: "Görev Teslimi",
    start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    className: "warning",
  },
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


