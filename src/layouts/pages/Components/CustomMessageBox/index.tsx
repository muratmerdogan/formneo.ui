import React, { useRef, useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Button from "@mui/material/Button";
import "../MessageBox/index.css";

interface MessageBoxProps {
  isQuestionmessageBoxOpen: boolean;
  handleCloseQuestionBox: (action: string, escPressed?: boolean) => void;
  titleText: string;
  contentText: string;
  warningText?: {
    text: string;
    color: string;
  };
  type: "warning" | "question" | "info" | "error";
}

function CustomMessageBox({
  isQuestionmessageBoxOpen,
  handleCloseQuestionBox,
  titleText,
  contentText,
  warningText,
  type = "error",
}: MessageBoxProps) {
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isQuestionmessageBoxOpen) {
      setIsVisible(true);
    }
  }, [isQuestionmessageBoxOpen]);

  const handleConfirm = () => {
    handleCloseQuestionBox("Evet");
  };

  const handleCancel = () => {
    handleCloseQuestionBox("İptal");
  };

  const getIcon = () => {
    const iconStyles = {
      fontSize: 24,
      color: getThemeColor(),
    };

    switch (type) {
      case "warning":
      case "error":
        return <ErrorOutlineIcon style={iconStyles} />;
      case "question":
        return <HelpOutlineIcon style={iconStyles} />;
      case "info":
        return <InfoOutlinedIcon style={iconStyles} />;
      default:
        return <HelpOutlineIcon style={iconStyles} />;
    }
  };

  const getThemeColor = () => {
    switch (type) {
      case "warning":
      case "error":
        return "rgba(244, 67, 54, 0.85)";
      case "question":
      case "info":
        return "rgba(33, 150, 243, 0.85)";
      default:
        return "rgba(33, 150, 243, 0.85)";
    }
  };

  const getAccentColor = () => {
    switch (type) {
      case "warning":
      case "error":
        return "rgba(244, 67, 54, 0.08)";
      case "question":
      case "info":
        return "rgba(33, 150, 243, 0.08)";
      default:
        return "rgba(33, 150, 243, 0.08)";
    }
  };

  return (
    <Dialog
      open={isQuestionmessageBoxOpen}
      onClose={() => handleCloseQuestionBox("Cancel", true)}
      TransitionComponent={Fade}
      TransitionProps={{
        timeout: 250,
        onExited: () => setIsVisible(false),
      }}
      PaperProps={{
        style: {
          borderRadius: "12px",
          minWidth: "480px",
          maxWidth: "480px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          overflow: "visible",
          border: `1px solid rgba(0, 0, 0, 0.06)`,
          transition: "all 0.2s ease-in-out",
          backgroundColor: "#ffffff",
        },
        elevation: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          backgroundColor: getThemeColor(),
          opacity: 0.6,
        }}
      />

      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "24px 24px 16px",
          borderBottom: "none",
        }}
      >
        <MDBox display="flex" alignItems="center" gap={1.5}>
          {getIcon()}
          <MDTypography
            variant="h5"
            fontWeight="medium"
            sx={{ fontSize: "18px", letterSpacing: "-0.01em" }}
          >
            {titleText}
          </MDTypography>
        </MDBox>
        <IconButton
          aria-label="close"
          onClick={() => handleCloseQuestionBox("Cancel")}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "rgba(0, 0, 0, 0.4)",
            padding: "8px",
            transition: "all 0.15s ease",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              color: "rgba(0, 0, 0, 0.6)",
              transform: "scale(1.02)",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          padding: "8px 24px 24px",
          "&:first-of-type": {
            paddingTop: 0,
          },
        }}
      >
        <MDTypography
          variant="body1"
          color="text"
          sx={{
            fontSize: "14px",
            lineHeight: 1.6,
            color: "rgba(0, 0, 0, 0.7)",
          }}
        >
          {contentText}
        </MDTypography>

        {warningText && (
          <MDBox mt={2.5} mb={0.5}>
            <div
              style={{
                color: getThemeColor(),
                padding: "12px 16px",
                backgroundColor: getAccentColor(),
                borderRadius: "8px",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              <ErrorOutlineIcon style={{ fontSize: 18, marginTop: "2px" }} />
              <span>{warningText.text}</span>
            </div>
          </MDBox>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          padding: "16px 24px 24px",
          justifyContent: "flex-end",
          gap: 1.5,
          borderTop: "none",
        }}
      >
        <Button
          onClick={handleCancel}
          sx={{
            color: "rgba(0, 0, 0, 0.6)",
            backgroundColor: "rgba(0, 0, 0, 0.03)",
            fontSize: "14px",
            fontWeight: 500,
            textTransform: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            minWidth: "80px",
            height: "36px",
            transition: "all 0.15s ease",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.06)",
              transform: "translateY(-1px)",
            },
          }}
        >
          İptal
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disableElevation
          sx={{
            minWidth: "80px",
            backgroundColor: getThemeColor(),
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: 500,
            textTransform: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            height: "36px",
            boxShadow: "none",
            transition: "all 0.15s ease",
            "&:hover": {
              backgroundColor: getThemeColor(),
              filter: "brightness(1.05)",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
            },
          }}
        >
          Evet
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomMessageBox;
