import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { Card, CardContent, Stack, List, ListItem, ListItemIcon, ListItemText, Icon, Divider } from "@mui/material";

// Mock kritik görevler/aktiviteler
const mockCriticalTasks = [
  {
    id: 1,
    title: "Müşteri Teklifi Gönderimi",
    dueDate: "2025-12-18",
    description: "ABC firmasına teklif gönderilecek.",
    icon: "assignment_late",
    color: "error.main"
  },
  {
    id: 2,
    title: "Proje Teslimi",
    dueDate: "2025-12-20",
    description: "X Projesi teslim tarihi yaklaşıyor.",
    icon: "event",
    color: "warning.main"
  },
  {
    id: 3,
    title: "Sözleşme Yenileme",
    dueDate: "2025-12-22",
    description: "Y şirketi ile sözleşme yenilenecek.",
    icon: "autorenew",
    color: "info.main"
  }
];

const CriticalTasksWidget: React.FC = () => {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <MDTypography variant="h6">Yaklaşan Kritik Görevler</MDTypography>
          <MDButton variant="outlined" color="info" size="small">Tümünü Gör</MDButton>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <List disablePadding>
          {mockCriticalTasks.map(task => (
            <ListItem key={task.id} sx={{ mb: 1, borderRadius: 2, '&:hover': { background: '#f5f6fa' } }}>
              <ListItemIcon>
                <Icon sx={{ color: task.color }}>{task.icon}</Icon>
              </ListItemIcon>
              <ListItemText
                primary={<MDTypography variant="button" fontWeight="bold">{task.title}</MDTypography>}
                secondary={<>
                  <MDTypography variant="caption" color="text" display="block">{task.description}</MDTypography>
                  <MDTypography variant="caption" color="error" fontWeight="bold">Son Tarih: {task.dueDate}</MDTypography>
                </>}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default CriticalTasksWidget;
