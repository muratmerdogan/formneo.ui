import React, { useState } from "react";
import { Dialog, DialogContent, Typography, Grid, Box, Button, Paper } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DescriptionIcon from "@mui/icons-material/Description";

const options = [
  {
    key: "scheduled",
    title: "Scheduled Workflow",
    icon: <AccessTimeIcon />,
    desc: "Start the flow on a specified schedule",
  },
  {
    key: "form",
    title: "Form Workflow",
    icon: <DescriptionIcon />,
    desc: "Start the flow using a user-submitted form",
  },
];

export default function WorkflowWizard({ open, onClose, onConfirm }) {
  const [selected, setSelected] = useState("scheduled");

  const handleConfirm = () => {
    onConfirm(selected);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 5 }}>
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Select a Workflow Type
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 4 }} color="text.secondary">
          Please choose a workflow type to start designing your flow.
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {options.map((item) => (
            <Grid item xs={12} sm={6} key={item.key}>
              <Paper
                elevation={0}
                onClick={() => setSelected(item.key)}
                sx={{
                  borderRadius: 2,
                  p: 3,
                  minHeight: 220,
                  border: selected === item.key ? "2px solid #2563EB" : "1px solid #E0E0E0",
                  cursor: "pointer",
                  transition: "0.5s",
                  textAlign: "center",
                }}
              >
                {/* İkon kısmı */}
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: selected === item.key ? "#E8F0FE" : "#F0F0F0",
                      borderRadius: "50%",
                      padding: 2.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {React.cloneElement(item.icon, {
                      sx: {
                        fontSize: 40,
                        color: selected === item.key ? "#2563EB" : "#9E9E9E",
                      },
                    })}
                  </Box>
                </Box>

                {/* Başlık ve açıklama */}
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box textAlign="right" mt={4}>
          <Button
            variant="contained"
            onClick={handleConfirm}
            sx={{
              px: 4,
              py: 1.2,
              fontWeight: "bold",
              borderRadius: 2,
              backgroundColor: "#2563EB", // Mavi zemin
              color: "#FFFFFF", // Beyaz yazı
              "&:hover": {
                backgroundColor: "#1e40af", // Hover için daha koyu mavi
              },
            }}
          >
            Next
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
