import React from 'react'
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { Chip, Stack, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

export interface Experience {
  id: number;
  position: string;
  company: string;
  dateOrDateRange: string;
  location: string;
  website?: string;
  description: string;
}

function ExperienceRenderer({ experienceList, handleEditExperience, handleDeleteExperience }: { experienceList: Experience[], handleEditExperience: (id: number) => void, handleDeleteExperience: (id: number) => void }) {
  return (
    <MDBox>
      {experienceList.map((experience, index) => (
        <MDBox
          key={index}
          sx={{
            marginBottom: 2,
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: "12px",
            padding: 3,
            boxShadow: "0 4px 12px 0 rgba(0,0,0,0.03)",
            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            "&:hover": {
              boxShadow: "0 8px 20px 0 rgba(0,0,0,0.1)",
              transform: "translateY(-3px)",
            },
            background: "#ffffff",
          }}
        >
          <MDBox
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1.5,
            }}
          >
            <MDBox sx={{display: "flex", flexDirection: "row", gap: 1}}>
            <MDTypography
              variant="h5"
              sx={{
                color: "#344767",
                fontSize: "1.00rem",
           
                letterSpacing: "0.02em",
              }}
            >
              {experience.position}
            </MDTypography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                label={experience.dateOrDateRange}
                size="small"
                sx={{
                  backgroundColor: "rgba(26, 115, 232, 0.1)",
                  color: "#1A73E8",
                  fontWeight: "500",
                  fontSize: "0.75rem",
                  height: "24px",
                  borderRadius: "6px",
                }}
              />
            </Stack>
            </MDBox>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Edit Education" arrow placement="top">
                <EditIcon
                  fontSize="small"
                  sx={{
                    color: "#5e72e4",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.15)",
                    },
                  }}
                  onClick={() => handleEditExperience(experience.id)}
                />
              </Tooltip>
              <Tooltip title="Delete Education" arrow placement="top">
                <CloseIcon
                  fontSize="small"
                  sx={{
                    color: "#f5365c",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.15)",
                    },
                  }}
                  onClick={() => handleDeleteExperience(experience.id)}
                />
              </Tooltip>
            </Stack>
          </MDBox>
          <MDBox sx={{ display: "flex", gap: 1, mb: 1.5 }}>
            <MDTypography variant="subtitle2" fontWeight="medium" sx={{ color: "#5e6e82", fontSize: "0.875rem" }}>
              {experience.company}
            </MDTypography>
            {experience.website && (
              <>
                <MDTypography variant="subtitle2" fontWeight="medium" sx={{ color: "#8392ab", fontSize: "0.875rem" }}>
                  -
                </MDTypography>
                <MDTypography variant="subtitle2" fontWeight="medium" sx={{ color: "#5e6e82", fontSize: "0.875rem" }}>
                  {experience.website}
                </MDTypography>
              </>
            )}
          </MDBox>
        </MDBox>
      ))}
    </MDBox>
  )
}

export default ExperienceRenderer;