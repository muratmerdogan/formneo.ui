import { Dialog, DialogContent, DialogTitle, Fade, Grid, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import React, { useState } from "react";
import VpnSelection from "./VpnSelection";
import MDTypography from "components/MDTypography";
import VPNDetail from "../components/vpnDetail";

export interface VpnCardItem {
  id: string;
  title: string;
  vpnAdrees: string;
  link: string;
  description: string;
}

function VpnSelectionContainer() {
  const [openDialog, setOpenDialog] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [cards, setCards] = useState<VpnCardItem[]>([
    {
      id: "1",
      title: "VPN 1",
      vpnAdrees: "192.168.1.1",
      link: "https://www.google.com",
      description: "VPN 1 description",
    },
    {
      id: "2",
      title: "VPN 2",
      vpnAdrees: "192.168.1.2",
      link: "https://www.goog5435le.com",
      description: "VPN 2 description",
    },
  ]);

  const handleEdit = (id: string) => {
    console.log(id);
  };

  const handleDelete = (id: string) => {
    console.log(id);
  };

  const handleShare = (id: string) => {
    console.log(id);
  };

  const handleBackToCards = () => {
    setShowDetail(false);
    setSelectedCard(null);
  };

  const handleCardClick = (card: VpnCardItem) => {
    setSelectedCard(card);
    setShowDetail(true);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleAddCard = () => {
    console.log("add card");
  };

  return (
    <MDBox p={3}>
      {!showDetail ? (
        <Fade in={!showDetail}>
          <div>
            <MDBox display="flex" justifyContent="flex-end" alignItems="center" mb={3}>
              <MDButton
                variant="gradient"
                color="info"
                startIcon={<Icon>add</Icon>}
                size="small"
                onClick={handleOpenDialog}
              >
                Yeni VPN Eklemek İçin Tıklayınız
              </MDButton>
            </MDBox>
            <Grid container spacing={2}>
              {cards.map((card) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
                  <div onClick={() => handleCardClick(card)}>
                    <VpnSelection
                      cardItem={card}
                      onEdit={() => handleEdit(card.id)}
                      onDelete={() => handleDelete(card.id)}
              
                    />
                  </div>
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
              {selectedCard && (
                <MDTypography variant="h4" ml={2}>
                  {selectedCard.title} ({selectedCard.vpnAdrees})
                </MDTypography>
              )}
              <div></div>
            </MDBox>
            {selectedCard && <VPNDetail selectedServerId={selectedCard.id} />}
          </div>
        </Fade>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} >
        <DialogTitle>Yeni VPN Ekle</DialogTitle>
        <DialogContent>
          <MDInput label="Başlık" fullWidth />
          <MDInput label="VPN Adresi" fullWidth />
          <MDInput label="Açıklama" fullWidth />
          <MDInput label="Link" fullWidth />
          <MDButton variant="contained" color="primary" onClick={handleAddCard}>
            Ekle
          </MDButton>
        </DialogContent>
      </Dialog>
    </MDBox>
  );
}

export default VpnSelectionContainer;
