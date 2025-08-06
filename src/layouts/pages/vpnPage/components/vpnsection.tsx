import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Fade from "@mui/material/Fade";
import VPNDetail from "./vpnDetail";

interface VPNServer {
  id: string;
  title: string;
  description: string;
  vpnType: string;
}

function VPNSection() {
  const [servers, setServers] = useState<VPNServer[]>([
    {
      id: "1",
      title: "Main Office VPN",
      description: "Primary VPN connection for headquarters",
      vpnType: "Cisco AnyConnect",
    },
    {
      id: "2",
      title: "Remote Office VPN",
      description: "Secure connection for branch offices",
      vpnType: "OpenVPN",
    },
    {
      id: "3",
      title: "Development Server VPN",
      description: "Access to development environment",
      vpnType: "FortiClient VPN",
    },
    {
      id: "4",
      title: "Client Access VPN",
      description: "External client access point",
      vpnType: "Pulse Secure",
    },
  ]);

  const [selectedServer, setSelectedServer] = useState<VPNServer | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleCardClick = (server: VPNServer) => {
    setSelectedServer(server);
    setShowDetail(true);
  };

  const handleBackToCards = () => {
    setShowDetail(false);
    setSelectedServer(null);
  };

  return (
    <MDBox p={3}>
      {!showDetail ? (
        <Fade in={!showDetail}>
          <div>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <MDTypography variant="h5" fontWeight="medium">
                VPN Sunucuları
              </MDTypography>
              <MDButton variant="gradient" color="info" startIcon={<Icon>add</Icon>} size="small">
                Yeni VPN Ekle
              </MDButton>
            </MDBox>

            <Grid container spacing={2}>
              {servers.map((server) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={server.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                      },
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    onClick={() => handleCardClick(server)}
                  >
                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                      <MDBox display="flex" alignItems="flex-start" mb={2}>
                        <MDBox
                          width="3rem"
                          height="3rem"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          borderRadius="md"
                          color="white"
                          bgColor="info"
                          mr={2}
                        >
                          <Icon fontSize="medium">vpn_key</Icon>
                        </MDBox>
                        <MDBox flexGrow={1}>
                          <MDTypography variant="h6" fontWeight="medium">
                            {server.title}
                          </MDTypography>
                          <MDTypography variant="caption" color="text">
                            {server.vpnType}
                          </MDTypography>
                        </MDBox>
                      </MDBox>

                      <MDTypography variant="body2" color="text" sx={{ flexGrow: 1 }}>
                        {server.description}
                      </MDTypography>

                      <MDBox display="flex" justifyContent="flex-end" mt={2}>
                        <MDButton
                          variant="text"
                          color="info"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(server);
                          }}
                        >
                          Detaylar
                        </MDButton>
                      </MDBox>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </Fade>
      ) : (
        <Fade in={showDetail}>
          <div>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <MDButton
                startIcon={<Icon>arrow_back</Icon>}
                onClick={handleBackToCards}
                variant="outlined"
                color="info"
                size="small"
              >
                Geri Dön
              </MDButton>
              {selectedServer && <MDTypography variant="h4">{selectedServer.title}</MDTypography>}
              <div></div>
            </MDBox>
            {selectedServer && <VPNDetail selectedServerId={selectedServer.id} />}
          </div>
        </Fade>
      )}
    </MDBox>
  );
}

export default VPNSection;
