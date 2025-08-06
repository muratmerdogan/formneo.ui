import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import MDTypography from 'components/MDTypography';
import { CvData } from 'layouts/pages/resumeBuilder';
import React, { useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ExperienceRenderer from './experienceRenderer';

interface ExperienceProps {
  cvDataExperience: CvData["experience"];
  setCvDataExperience: (data: CvData["experience"]) => void;
}

function Experience({ cvDataExperience, setCvDataExperience }: ExperienceProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [maxHeight, setMaxHeight] = useState("0px");
    const contentRef = useRef<HTMLDivElement>(null);
    const [newExperience, setNewExperience] = useState({
        id: 0,
        position: "",
        company: "",
        dateOrDateRange: "",
        location: "",
        website: "",
        description: "",
    });

    useEffect(() => {
        if (isOpen && contentRef.current) {
          setMaxHeight(`${contentRef.current.scrollHeight}px`);
        } else {
          setMaxHeight("0px");
        }
      }, [isOpen, cvDataExperience]);

    const handleSaveNewExperience = () => {
        let newExperienceTemp = {
            ...newExperience,
            id: cvDataExperience.length + 1,
          };
        setCvDataExperience([...cvDataExperience, newExperienceTemp]);
        setOpenDialog(false);
        setIsEdit(false);
        setNewExperience({
            id: 0,
            position: "",
            company: "",
            dateOrDateRange: "",
            location: "",
            website: "",
            description: "",
        });
    }

    const handleUpdateExperience = () => {
        setCvDataExperience(cvDataExperience.map((experience) => experience.id === newExperience.id ? newExperience : experience));
        setOpenDialog(false);
        setIsEdit(false);
        setNewExperience({
            id: 0,
            position: "",
            company: "",
            dateOrDateRange: "",
            location: "",
            website: "",
            description: "",
        });
        setIsEdit(false);
    }

    const handleEditExperience = (id: number) => {
        setOpenDialog(true);
        setIsEdit(true);
        setNewExperience(cvDataExperience.find((experience) => experience.id === id));
    }

    const handleDeleteExperience = (id: number) => {
        setCvDataExperience(cvDataExperience.filter((experience) => experience.id !== id));
    }

  return (
    <MDBox sx={{ padding: "0 24px 24px 24px" }}>
      <MDBox
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          paddingBottom: 2,
          marginBottom: 2,
        }}
      >
        <MDBox sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
          <MenuBookIcon
            sx={{
              fontSize: "32px",
              color: "#1A73E8",

              borderRadius: "8px",
            }}
          />
          <MDTypography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#344767",
              letterSpacing: 0.2,
            }}
          >
            Experience
          </MDTypography>
        </MDBox>
        {isOpen ? (
          <KeyboardArrowDownIcon
            fontSize="medium"
            sx={{
              cursor: "pointer",
              fontSize: "28px",
              color: "#5e72e4",
              borderRadius: "50%",
              padding: "4px",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(94,114,228,0.1)",
              },
            }}
            onClick={() => setIsOpen(!isOpen)}
          />
        ) : (
          <KeyboardArrowLeftIcon
            fontSize="medium"
            sx={{
              cursor: "pointer",
              fontSize: "28px",
              color: "#5e72e4",
              borderRadius: "50%",
              padding: "4px",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(94,114,228,0.1)",
              },
            }}
            onClick={() => setIsOpen(!isOpen)}
          />
        )}
      </MDBox>
      <MDBox
        ref={contentRef}
        sx={{
          maxHeight: maxHeight,
          overflow: "hidden",
          transition: "max-height 0.4s ease-in-out",
        }}
      >
        <ExperienceRenderer
          experienceList={cvDataExperience}
          handleEditExperience={handleEditExperience}
          handleDeleteExperience={handleDeleteExperience}
        />
        <MDButton
          variant="contained"
          color="info"
          fullWidth
          onClick={() => {
            setOpenDialog(true);
            setNewExperience({
              id: 0,
              position: "",
              company: "",
              dateOrDateRange: "",
              location: "",
              website: "",
              description: "",
            });
          }}
          sx={{
            mt: 2,
            borderRadius: "10px",
            fontWeight: "bold",
            py: 1.2,
            boxShadow: "0 4px 10px rgba(26,115,232,0.15)",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 15px rgba(26,115,232,0.25)",
            },
          }}
        >
          <AddIcon sx={{ mr: 1 }} />
          Add Experience
        </MDButton>
      </MDBox>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          },
        }}
        maxWidth="md"
      >
        <DialogTitle>
          <MDBox
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <MDBox sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
              <MenuBookIcon
                sx={{
                  fontSize: "28px",
                  color: "#1A73E8",
                  borderRadius: "8px",
                }}
              />
              <MDTypography variant="h5" sx={{ fontWeight: "bold", color: "#344767" }}>
                {isEdit ? "Edit Selected Experience" : "Add New Experience"}
              </MDTypography>
            </MDBox>
            <CloseIcon
              sx={{
                fontSize: "22px",
                color: "#f5365c",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "scale(1.15)",
                  color: "#ea0b46",
                },
              }}
              onClick={() => {
                setOpenDialog(false);
                setNewExperience({
                  id: 0,
                  position: "",
                  company: "",
                  dateOrDateRange: "",
                  location: "",
                  website: "",
                  description: "",
                });
                setIsEdit(false);
              }}
            />
          </MDBox>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <MDBox mb={2}></MDBox>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <MDInput
                label="Position"
                fullWidth
                value={newExperience.position}
                onChange={(e: any) =>
                  setNewExperience({ ...newExperience, position: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "&:hover fieldset": { borderColor: "#1A73E8" },
                    "&.Mui-focused fieldset": { borderColor: "#1A73E8" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MDInput
                label="Company"
                fullWidth
                value={newExperience.company}
                onChange={(e: any) =>
                  setNewExperience({ ...newExperience, company: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "&:hover fieldset": { borderColor: "#1A73E8" },
                    "&.Mui-focused fieldset": { borderColor: "#1A73E8" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MDInput
                label="Location"
                fullWidth
                value={newExperience.location}
                onChange={(e: any) =>
                  setNewExperience({ ...newExperience, location: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "&:hover fieldset": { borderColor: "#1A73E8" },
                    "&.Mui-focused fieldset": { borderColor: "#1A73E8" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MDInput
                label="Website"
                placeholder="https://www.google.com"
                fullWidth
                value={newExperience.website}
                onChange={(e: any) => setNewExperience({ ...newExperience, website: e.target.value })}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "&:hover fieldset": { borderColor: "#1A73E8" },
                    "&.Mui-focused fieldset": { borderColor: "#1A73E8" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MDInput
                label="Date or Date Range"
                placeholder="2023 March - Today"
                fullWidth
                value={newExperience.dateOrDateRange}
                onChange={(e: any) =>
                  setNewExperience({ ...newExperience, dateOrDateRange: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "&:hover fieldset": { borderColor: "#1A73E8" },
                    "&.Mui-focused fieldset": { borderColor: "#1A73E8" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <MDBox sx={{ mt: 1 }}>
                <MDTypography variant="caption" fontWeight="medium" color="text">
                  Description
                </MDTypography>
                <MDBox sx={{ mt: 0.5, border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px" }}>
                  <ReactQuill
                    theme="snow"
                    className="custom-quill"
                    value={newExperience.description}
                    onChange={(value) => setNewExperience({ ...newExperience, description: value })}
                    placeholder="Describe your experience..."
                  />
                </MDBox>
              </MDBox>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <MDButton
            variant="outlined"
            color="error"
            onClick={() => {
              setOpenDialog(false);
              setNewExperience({
                id: 0,
                position: "",
                company: "",
                dateOrDateRange: "",
                location: "",
                website: "",
                description: "",
              });
              setIsEdit(false);
              console.log("sildir")
            }}

            sx={{ borderRadius: "8px", px: 4, py: 1 }}
          >
            Cancel
          </MDButton>
          <MDButton
            variant="contained"
            color="info"
            onClick={isEdit ? handleUpdateExperience : handleSaveNewExperience}
            sx={{
              borderRadius: "8px",
              px: 4,
              py: 1,
              boxShadow: "0 4px 10px rgba(26,115,232,0.15)",
            }}
          >
            {isEdit ? "Update" : "Save"}
          </MDButton>
        </DialogActions>
      </Dialog>
    </MDBox>
  )
}

export default Experience;