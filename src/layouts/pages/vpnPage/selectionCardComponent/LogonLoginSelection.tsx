import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import "./LogonLoginSelection.css";

interface LogonLoginSelectionProps {
  title?: string;
  description?: string;
  icon?: string;
  vsqorvsp: string;
  iconColor?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark" | "light";
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  isNew?: boolean;
}

function LogonLoginSelection({
  title = "TEST",
  description = "great description",
  icon = "dashboard",
  iconColor = "info",
  onEdit,
  onDelete,
  onShare,
  isNew = false,
  vsqorvsp,
}: LogonLoginSelectionProps) {

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
      className={`selection-card ${isNew ? "new-card" : ""}`}
      sx={{
        backgroundColor: "white",
        height: "100%",
        cursor: "pointer",
      }}
    >
      <MDBox display="flex" alignItems="flex-start" mb={1}>
        <MDBox
          width="3rem"
          height="3rem"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="md"
          color="white"
          bgColor="success"
          mr={2}
          className="icon-container"
        >
          <Icon fontSize="medium">security</Icon>
        </MDBox>
        <MDBox flexGrow={1}>
          <MDTypography mb={-1} variant="h6" fontWeight="medium" className="card-title">
            {title}
          </MDTypography>
          <MDTypography variant="caption" color="text" className="card-subtitle">
            {vsqorvsp}
          </MDTypography>
        </MDBox>
      </MDBox>

      <MDBox mb={2}>
        <MDTypography variant="body2" color="text" className="card-description">
          {description}
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
        <IconButton
          size="small"
          color="default"
          aria-label="share"
          onClick={(e) => handleActionClick(e, onShare)}
          tabIndex={0}
          className="action-button share-button"
        >
            <Icon fontSize="small">share</Icon>
          </IconButton>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

export default LogonLoginSelection;
