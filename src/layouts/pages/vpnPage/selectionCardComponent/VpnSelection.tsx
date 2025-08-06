import React from "react";
import { VpnCardItem } from "./VpnSelectionContainer";
import MDBox from "components/MDBox";
import { Icon, Tooltip } from "@mui/material";
import MDTypography from "components/MDTypography";
import { IconButton } from "@mui/material";
import "./VpnSelection.css";
interface VpnSelectionProps {
  cardItem: VpnCardItem;
  onEdit: () => void;
  onDelete: () => void;
}

function VpnSelection({ cardItem, onEdit, onDelete }: VpnSelectionProps) {
  const handleActionClick = (e: React.MouseEvent, callback?: () => void) => {
    e.stopPropagation();
    if (callback) {
      callback();
    }
  };
  return (
    <MDBox
      display="flex"
      flexDirection="column"
      borderRadius="lg"
      boxShadow="md"
      p={2}
      mb={2}
      className={`selection-card `}
      sx={{
        backgroundColor: "white",
        height: "100%",
        cursor: "pointer",
        border: "1px solid #e0e0e0",
      }}
    >
      <MDBox display="flex" justifyContent="space-between">
        <MDBox display="flex" alignItems="flex-start" mb={1}>
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
            className="icon-container"
          >
            <Icon fontSize="medium">vpn_key</Icon>
          </MDBox>
          <MDBox flexGrow={1}>
            <MDTypography mb={-1} variant="h6" fontWeight="medium" className="card-title">
              {cardItem.title}
            </MDTypography>
            <MDTypography variant="caption" color="text" className="card-subtitle">
              {cardItem.vpnAdrees}
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox display="flex" alignItems="start" justifyContent="center">
          <Tooltip
            title={
              <MDBox p={1}>
                <MDTypography variant="body2" fontWeight="medium" color="white">
                  Dosya Kurulumuna Gitmek İçin Tıklayınız
                </MDTypography>
                <MDTypography
                  variant="caption"
                  color="white"
                  sx={{
                    opacity: 0.8,
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    window.open(cardItem.link, "_blank");
                  }}
                  tabIndex={0}
                  aria-label="Dosya kurulum linki"
                  onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(cardItem.link, "_blank");
                    }
                  }}
                >
                  {cardItem.link || "Link bulunamadı"}
                </MDTypography>
              </MDBox>
            }
            arrow
            placement="top"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              borderRadius: "8px",
              "& .MuiTooltip-arrow": {
                color: "rgba(0, 0, 0, 0.8)",
              },
            }}
            PopperProps={{
              onClick: (e) => e.stopPropagation(),
            }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                window.open(cardItem.link, "_blank");
              }}
              tabIndex={0}
              aria-label="Dosya kurulum linki"
              sx={{
                borderRadius: "8px",
                padding: "8px 12px",
                "&:hover": {
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                },
              }}
            >
              <Icon fontSize="small">link</Icon>
            </IconButton>
          </Tooltip>
        </MDBox>
      </MDBox>

      <MDBox display="flex" flexDirection="column" mb={2}>
        <MDTypography variant="caption" color="text.primary" className="card-description">
          {cardItem.description}
        </MDTypography>
      </MDBox>

      <MDBox display="flex" className="card-actions">
        <MDBox display="flex" justifyContent="center" gap={1}>
          <IconButton
            size="small"
            color="info"
            aria-label="edit"
            onClick={(e) => handleActionClick(e, onEdit)}
            tabIndex={0}
            className="action-button edit-button"
          >
            <Icon fontSize="small">edit</Icon>
          </IconButton>
          <IconButton
            size="small"
            color="error"
            aria-label="delete"
            onClick={(e) => handleActionClick(e, onDelete)}
            tabIndex={0}
            className="action-button delete-button"
          >
            <Icon fontSize="small">delete</Icon>
          </IconButton>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

export default VpnSelection;
