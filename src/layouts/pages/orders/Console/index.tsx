import { useMemo, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Icon from "@mui/material/Icon";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";

type OrderStatus = "new" | "preparing" | "waiting_courier" | "on_route" | "delivered" | "canceled";

type Channel = "Trendyol" | "Getir" | "Yemeksepeti" | "HepsiJet";

type Order = {
  id: string;
  channel: Channel;
  code: string;
  customer: string;
  itemsSummary: string;
  etaMin: number;
  status: OrderStatus;
  slaSecondsLeft: number;
  notes?: string;
};

const channelColor: Record<Channel, "primary" | "info" | "warning" | "error"> = {
  Trendyol: "warning",
  Getir: "info",
  Yemeksepeti: "error",
  HepsiJet: "primary",
};

function useMockOrders() {
  const [seed] = useState(1);
  return useMemo<Order[]>(
    () => [
      { id: "TY-1001", channel: "Trendyol", code: "#45213", customer: "Özgür Y.", itemsSummary: "2x Burger, 1x Kola", etaMin: 18, status: "new", slaSecondsLeft: 240 },
      { id: "GY-1002", channel: "Getir", code: "#45214", customer: "Ece A.", itemsSummary: "1x Pizza, 1x Ayran", etaMin: 22, status: "preparing", slaSecondsLeft: 420 },
      { id: "YS-1003", channel: "Yemeksepeti", code: "#45215", customer: "Mert K.", itemsSummary: "3x Lahmacun", etaMin: 15, status: "waiting_courier", slaSecondsLeft: 180 },
      { id: "TY-1004", channel: "Trendyol", code: "#45216", customer: "Deniz S.", itemsSummary: "1x Salata", etaMin: 35, status: "on_route", slaSecondsLeft: 900 },
      { id: "HP-1005", channel: "HepsiJet", code: "#45217", customer: "Gizem T.", itemsSummary: "1x Tatlı", etaMin: 8, status: "new", slaSecondsLeft: 120 },
    ],
    [seed]
  );
}

function StatusChip({ status }: { status: OrderStatus }) {
  const labelMap: Record<OrderStatus, string> = {
    new: "Yeni",
    preparing: "Hazırlanıyor",
    waiting_courier: "Kurye Bekliyor",
    on_route: "Yolda",
    delivered: "Teslim",
    canceled: "İptal",
  };
  const colorMap: Record<OrderStatus, "default" | "success" | "warning" | "error" | "info"> = {
    new: "info",
    preparing: "warning",
    waiting_courier: "warning",
    on_route: "info",
    delivered: "success",
    canceled: "error",
  };
  return <Chip size="small" color={colorMap[status]} label={labelMap[status]} />;
}

function OrderCard({ order, onSelect }: { order: Order; onSelect: (o: Order) => void }) {
  const danger = order.slaSecondsLeft < 180;
  const warn = order.slaSecondsLeft >= 180 && order.slaSecondsLeft < 360;
  return (
    <MDBox
      onClick={() => onSelect(order)}
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: "1px solid",
        borderColor: danger ? "error.main" : warn ? "warning.main" : "divider",
        bgcolor: danger ? "error.50" : warn ? "warning.50" : "background.paper",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <MDBox display="flex" alignItems="center" justifyContent="space-between">
        <MDBox display="flex" gap={1} alignItems="center">
          <Chip size="small" color={channelColor[order.channel]} label={order.channel} />
          <MDTypography variant="button" fontWeight="bold">{order.code}</MDTypography>
        </MDBox>
        <StatusChip status={order.status} />
      </MDBox>
      <MDTypography variant="body2" mt={0.5}>{order.customer}</MDTypography>
      <MDTypography variant="caption" color="text">
        {order.itemsSummary}
      </MDTypography>
      <MDBox display="flex" alignItems="center" justifyContent="space-between" mt={1}>
        <MDTypography variant="caption">ETA ~ {order.etaMin} dk</MDTypography>
        <MDTypography variant="caption" color={danger ? "error" : warn ? "warning" : "text"}>
          SLA {Math.max(0, Math.floor(order.slaSecondsLeft / 60))} dk
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

export default function OrdersConsolePage() {
  const orders = useMockOrders();
  const [tab, setTab] = useState<OrderStatus | "all">("all");
  const [selected, setSelected] = useState<Order | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    if (tab === "all") return orders;
    return orders.filter((o) => o.status === tab);
  }, [orders, tab]);

  return (
    <MDBox p={0}>
      <DashboardNavbar />

      <MDBox p={2}>
      <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
        <MDBox display="flex" alignItems="center" gap={1}>
          <MDTypography variant="h5">Sipariş Konsolu</MDTypography>
          <Chip size="small" label={`${orders.length} aktif`} />
        </MDBox>
        <MDBox display="flex" gap={1}>
          <MDButton variant="outlined" color="info" onClick={() => setFiltersOpen(true)}>
            <Icon>tune</Icon>&nbsp;Filtreler
          </MDButton>
          <MDButton variant="gradient" color="info">
            <Icon>refresh</Icon>&nbsp;Yenile
          </MDButton>
        </MDBox>
      </MDBox>

      <MDBox sx={{ bgcolor: "background.paper", borderRadius: 2 }} px={1}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value="all" label="Tümü" icon={<Icon>dashboard</Icon>} iconPosition="start" />
          <Tab value="new" label="Yeni" icon={<Icon>fiber_new</Icon>} iconPosition="start" />
          <Tab value="preparing" label="Hazırlanıyor" icon={<Icon>restaurant</Icon>} iconPosition="start" />
          <Tab value="waiting_courier" label="Kurye" icon={<Icon>delivery_dining</Icon>} iconPosition="start" />
          <Tab value="on_route" label="Yolda" icon={<Icon>near_me</Icon>} iconPosition="start" />
          <Tab value="delivered" label="Teslim" icon={<Icon>check_circle</Icon>} iconPosition="start" />
          <Tab value="canceled" label="İptal" icon={<Icon>cancel</Icon>} iconPosition="start" />
        </Tabs>
      </MDBox>

      <MDBox mt={1.5}>
        <Grid container spacing={1.25}>
          {filtered.map((o) => (
            <Grid key={o.id} item xs={12} sm={6} md={4} lg={3} xl={2.4 as any}>
              <OrderCard order={o} onSelect={setSelected} />
            </Grid>
          ))}
        </Grid>
      </MDBox>

      <Drawer anchor="right" open={!!selected} onClose={() => setSelected(null)}
        PaperProps={{ sx: { width: { xs: "100%", sm: 420 } } }}>
        <MDBox p={2}>
          <MDBox display="flex" alignItems="center" justifyContent="space-between">
            <MDTypography variant="h6">Sipariş Detayı</MDTypography>
            <MDButton variant="text" color="dark" onClick={() => setSelected(null)}>
              <Icon>close</Icon>
            </MDButton>
          </MDBox>
          <Divider sx={{ my: 1 }} />
          {selected && (
            <>
              <MDBox display="flex" gap={1} alignItems="center" mb={1}>
                <Chip size="small" color={channelColor[selected.channel]} label={selected.channel} />
                <MDTypography variant="button" fontWeight="bold">{selected.code}</MDTypography>
              </MDBox>
              <MDTypography variant="body2" mb={0.5}>{selected.customer}</MDTypography>
              <MDTypography variant="caption" color="text">{selected.itemsSummary}</MDTypography>
              <MDBox mt={1.25} display="flex" gap={1}>
                <MDButton color="info" variant="gradient">
                  <Icon>play_arrow</Icon>&nbsp;Hazırlanmaya Al
                </MDButton>
                <MDButton color="warning" variant="outlined">
                  <Icon>schedule</Icon>&nbsp;Süre Uzat
                </MDButton>
              </MDBox>
              <MDBox mt={1}>
                <MDTypography variant="caption" color="text">SLA kalan: {Math.max(0, Math.floor(selected.slaSecondsLeft / 60))} dk</MDTypography>
              </MDBox>
            </>
          )}
        </MDBox>
      </Drawer>

      <Drawer anchor="left" open={filtersOpen} onClose={() => setFiltersOpen(false)}
        PaperProps={{ sx: { width: { xs: "100%", sm: 360 } } }}>
        <MDBox p={2}>
          <MDBox display="flex" alignItems="center" justifyContent="space-between">
            <MDTypography variant="h6">Filtreler</MDTypography>
            <MDButton variant="text" color="dark" onClick={() => setFiltersOpen(false)}>
              <Icon>close</Icon>
            </MDButton>
          </MDBox>
          <Divider sx={{ my: 1 }} />
          <MDBox display="flex" gap={1} flexWrap="wrap">
            <Chip variant="outlined" label="Trendyol" />
            <Chip variant="outlined" label="Getir" />
            <Chip variant="outlined" label="Yemeksepeti" />
            <Chip variant="outlined" label="HepsiJet" />
          </MDBox>
          <MDBox mt={2}>
            <MDButton fullWidth color="info" variant="gradient">
              <Icon>done</Icon>&nbsp;Uygula
            </MDButton>
          </MDBox>
        </MDBox>
      </Drawer>
      </MDBox>
    </MDBox>
  );
}


