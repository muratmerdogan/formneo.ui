import React, { useEffect } from "react";
import { MessageBox as UI5MessageBox, MessageBoxAction, Title } from "@ui5/webcomponents-react";
import { ThemingParameters } from "@ui5/webcomponents-react-base";
import "./index.css";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
interface MessageBoxProps {
  isQuestionmessageBoxOpen: boolean;
  handleCloseQuestionBox: (action: string, escPressed?: boolean) => void;
  type?: string;
  description?: string;
  setDescription?: (description: string) => void;
  numberManDay?: number;
  setNumberManDay?: (numberManDay: number) => void;
  canEditManDay?: boolean;
  lastnumberManDay?: number
}

function MessageBox({
  isQuestionmessageBoxOpen,
  handleCloseQuestionBox,
  type,
  description,
  setDescription,
  numberManDay,
  setNumberManDay,
  canEditManDay,
  lastnumberManDay
}: MessageBoxProps) {
  useEffect(() => {
    if (numberManDay == null || numberManDay == 0) {
      numberManDay = lastnumberManDay;
    }
  }, []);
  return (
    <UI5MessageBox
      open={isQuestionmessageBoxOpen}
      onClose={handleCloseQuestionBox}
      actions={[MessageBoxAction.Cancel, MessageBoxAction.Yes]}
      header={
        <>
          {type ? (
            <Title style={headerStyle}>
              Kayıt {type === "approve" ? "Onaylanacaktır" : "Reddedilecektir"}{" "}
            </Title>
          ) : (
            <Title style={headerStyle}>Kayıt Silinecektir</Title>
          )}
          <span style={closeIconStyle} onClick={() => handleCloseQuestionBox("Cancel")}>
            ×
          </span>
        </>
      }
      style={messageBoxStyle}
    >
      {type ? (
        <MDBox>
          {type == "approve" ? (
            <>
              <span style={contentStyle}>Adam/Gün</span>
              <MDInput
                disabled={canEditManDay}
                value={numberManDay}
                onChange={(e: any) => setNumberManDay(e.target.value)}
                style={{ marginTop: "5px", marginBottom: "15px" }}
                type="number"
                placeholder="Adam/Gün giriniz"
                fullWidth
                onKeyDown={(e: any) => {
                  if (e.key === "e" || e.key === "E") {
                    e.preventDefault();
                  }
                }}
              />
            </>
          ) : null}

          <span style={contentStyle}>
            {type === "approve"
              ? "Onay Açıklaması "
              : "Reddedilme Nedenini "}
          </span>
          <MDInput
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
            style={{ marginTop: "5px", marginBottom: "15px" }}
            multiline
            rows={3}
            type="text"
            placeholder={type === "approve" ? "Onay Açıklaması giriniz" : "Reddedilme Nedeni giriniz"}
            fullWidth
          />
        </MDBox>
      ) : null}
      {type ? (
        <span style={{ ...contentStyle, color: "red" }}>
          Kayıt {type === "approve" ? "Onaylandıktan sonra" : "Reddedildikten sonra"} işlem geri
          alınamaz.
        </span>
      ) : (
        <span style={contentStyle}>Bu işlem geri alınamaz.</span>
      )}
    </UI5MessageBox>
  );
}

// Styles
const messageBoxStyle = {
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
  borderRadius: "12px",
  minWidth: "400px",
  position: "relative" as const,
};

const headerStyle = {
  color: "black",
  fontSize: "1.25rem",
  fontWeight: 600,
  padding: "0.35rem 0",
  marginRight: "24px", // Make space for close icon
};

const closeIconStyle = {
  position: "absolute" as const,
  right: "12px",
  top: "14px",
  fontSize: "20px",
  cursor: "pointer",
  color: ThemingParameters.sapContent_IconColor,
  width: "20px",
  height: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  transition: "background-color 0.2s",
  ":hover": {
    backgroundColor: ThemingParameters.sapButton_Lite_Hover_Background,
  },
};

const contentStyle = {
  display: "block",
  padding: "0.5rem 0",
  fontSize: "1rem",
  color: ThemingParameters.sapTextColor,
};

// Add this to your component's style overrides or global CSS

export default MessageBox;
