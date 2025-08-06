import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import LogonLoginSelection from "./LogonLoginSelection";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MDInput from "components/MDInput";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import LogonLoginDetail from "../components/logonLoginDetail";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";

interface CardItem {
  id: string;
  title: string;
  description: string;
  isNew?: boolean;
  vsqorvsp: string;
}

function LogonLoginSelectionContainer() {
  const [cards, setCards] = useState<CardItem[]>([
    {
      id: "1",
      title: "TeamPro",
      description: "Güncel Sistem Bilgileri",
      vsqorvsp: "VSQ",
    },
    {
      id: "2",
      title: "TeamPro",
      description: "SAP giriş bilgileri",
      vsqorvsp: "VSQ",
    },
    {
      id: "3",
      title: "TeamPro",
      description: "SAP Backend giriş bilgileri",
      vsqorvsp: "VSP",
    },
    {
      id: "4",
      title: "TeamPro",
      description: "Kullanıcı Bilgileri",
      vsqorvsp: "VSP",
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newCard, setNewCard] = useState<Omit<CardItem, "id" | "isNew">>({
    title: "",
    description: "",
    vsqorvsp: "VSQ",
  });

  // State to track selected card and detail view
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setNewCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCard = () => {
    const id = `${Date.now()}`;
    const cardToAdd = {
      ...newCard,
      id,
      isNew: true,
    };

    setCards((prev) => [...prev, cardToAdd]);
    setNewCard({
      title: "",
      description: "",
      vsqorvsp: "VSQ",
    });
    setOpenDialog(false);

    // Remove isNew flag after animation completes
    setTimeout(() => {
      setCards((prev) => prev.map((card) => (card.id === id ? { ...card, isNew: false } : card)));
    }, 500);
  };

  const handleEdit = (id: string) => {
    console.log(`Edit card ${id}`);
    // Implement edit functionality
  };

  const handleDelete = (id: string) => {
    console.log(`Delete card ${id}`);
    setCards(cards.filter((card) => card.id !== id));
  };

  const handleShare = (id: string) => {
    console.log(`Share card ${id}`);
    // Implement share functionality
  };

  // Handle card click to show detail view
  const handleCardClick = (card: CardItem) => {
    setSelectedCard(card);
    setShowDetail(true);
  };

  // Handle back button click to return to card view
  const handleBackToCards = () => {
    setShowDetail(false);
    setSelectedCard(null);
  };

  const iconOptions = [
    { value: "dns", label: "Server" },
    { value: "vpn_key", label: "VPN" },
    { value: "security", label: "Security" },
    { value: "people", label: "Users" },
    { value: "settings", label: "Settings" },
    { value: "dashboard", label: "Dashboard" },
    { value: "computer", label: "Computer" },
    { value: "wifi", label: "Network" },
  ];

  const colorOptions = [
    { value: "primary", label: "Primary" },
    { value: "secondary", label: "Secondary" },
    { value: "info", label: "Info" },
    { value: "success", label: "Success" },
    { value: "warning", label: "Warning" },
    { value: "error", label: "Error" },
  ];

  const vsqOptions = [
    { value: "VSQ", label: "VSQ" },
    { value: "VSP", label: "VSP" },
  ];

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
                Yeni Sunucu Eklemek İçin Tıklayınız
              </MDButton>
            </MDBox>

            <Grid container spacing={2}>
              {cards.map((card) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
                  <div onClick={() => handleCardClick(card)}>
                    <LogonLoginSelection
                      title={card.title}
                      description={card.description}
                      onEdit={() => handleEdit(card.id)}
                      onDelete={() => handleDelete(card.id)}
                      onShare={() => handleShare(card.id)}
                      isNew={card.isNew}
                      vsqorvsp={card.vsqorvsp}
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
                  {selectedCard.title} ({selectedCard.vsqorvsp})
                </MDTypography>
              )}
              <div></div>
            </MDBox>
            {selectedCard && <LogonLoginDetail selectedServerId={selectedCard.id} />}
          </div>
        </Fade>
      )}

      {/* Yeni sunucu ekleme dialogu */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Configuration</DialogTitle>
        <DialogContent>
          <MDBox component="form" sx={{ mt: 2 }}>
            <MDInput
              label="Title"
              name="title"
              value={newCard.title}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
              required
            />
            <MDInput
              label="Description"
              name="description"
              value={newCard.description}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
              margin="dense"
              sx={{ mt: 2 }}
              required
            />
           <Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="vsq-select-label">Type</InputLabel>
                  <Select
                    labelId="vsq-select-label"
                    value={newCard.vsqorvsp}
                    label="Type"
                    onChange={(e) => handleSelectChange("vsqorvsp", e.target.value)}
                  >
                    {vsqOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseDialog} color="secondary">
            Cancel
          </MDButton>
          <MDButton
            onClick={handleAddCard}
            color="info"
            variant="contained"
            disabled={!newCard.title || !newCard.description}
          >
            Add
          </MDButton>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}

export default LogonLoginSelectionContainer;
