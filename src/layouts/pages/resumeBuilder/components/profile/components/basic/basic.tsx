import { UserApi, UserAppDto } from "api/generated";
import getConfiguration from "confiuration";
import profile from "../../../../../../../assets/images/profile-icon.png";
import React, { useEffect, useState } from "react";
import { Avatar, Grid, Stack, Divider, Box } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { CvData } from "layouts/pages/resumeBuilder";
import { AddAPhoto } from "@mui/icons-material";
import "./basic.css";
interface BasicProps {
  cvDataBasicInformation: CvData["basicInformation"];
  setCvDataBasicInformation: (data: CvData["basicInformation"]) => void;
}

function Basic({ cvDataBasicInformation, setCvDataBasicInformation }: BasicProps) {
  useEffect(() => {
    const fetchUserData = async () => {
      var conf = getConfiguration();
      var api = new UserApi(conf);
      var data = await api.apiUserGetLoginUserDetailGet();
      setCvDataBasicInformation({
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        email: data.data.email,
        profilePicture: data.data.photo,
        headline: "",
        phone: data.data.phoneNumber,
        location: data.data.location,
      });
    };
    fetchUserData();
  }, []);
  const handleImageUpload = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    fileInput.onchange = function (e: any) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e: any) {
          setCvDataBasicInformation({
            ...cvDataBasicInformation,
            profilePicture: e.target.result,
          });
        };
        reader.readAsDataURL(file);
      }
    };

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };
  return (
    <MDBox p={4} sx={{ borderRadius: "10px 10px 0 0" }}>
      <MDBox
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          mb: 4,
        }}
      >
        <div className="avatar-container" onClick={handleImageUpload}>
          <div className="avatar">
            <img
              src={cvDataBasicInformation?.profilePicture || profile}
              alt="user"
              id="avatarImage"
            />
          </div>

          <div className="overlay">
            <div className="add-photo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 2h6l1 2h4a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1h4l1-2zm3 3a6 6 0 100 12 6 6 0 000-12zm0 2a4 4 0 110 8 4 4 0 010-8z" />
              </svg>
            </div>
          </div>

          <div className="upload-text">Click to change photo</div>
        </div>

        <div>
          <div
            style={{
              opacity: 1,
              transform: "translateY(0)",
              transition: "all 0.6s ease 0.2s",
            }}
          >
            <MDTypography
              variant="h3"
              fontWeight="bold"
              letterSpacing={0.5}
              color="#2d3748"
              sx={{
                background: "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "8px",
              }}
            >
              {cvDataBasicInformation?.firstName} {cvDataBasicInformation?.lastName}
            </MDTypography>
          </div>
          <div
            style={{
              opacity: 1,
              transform: "translateY(0)",
              transition: "all 0.6s ease 0.3s",
            }}
          >
            <MDTypography
              variant="body1"
              fontSize="1.1rem"
              letterSpacing={0.3}
              sx={{
                opacity: 0.8,
                color: "#4a5568",
                fontWeight: "500",
              }}
            >
              {cvDataBasicInformation?.email}
            </MDTypography>
          </div>
        </div>
      </MDBox>

      <div
        style={{
          margin: "32px 0",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent)",
          position: "relative",
          zIndex: 1,
        }}
      />

      <MDBox mt={4} sx={{ position: "relative", zIndex: 1 }}>
        <MDTypography
          variant="h5"
          fontWeight="bold"
          mb={3}
          color="#2d3748"
          letterSpacing={0.5}
          sx={{
            position: "relative",
            paddingBottom: "8px",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "60px",
              height: "3px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              borderRadius: "2px",
            },
          }}
        >
          Kişisel Bilgiler
        </MDTypography>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
          <div
            style={{
              transform: "translateY(0)",
              opacity: 1,
              transition: "all 0.6s ease 0.4s",
            }}
          >
            <MDInput
              fullWidth
              label="Professional Headline"
              value={cvDataBasicInformation?.headline || ""}
              onChange={(e: any) =>
                setCvDataBasicInformation({ ...cvDataBasicInformation, headline: e.target.value })
              }
              placeholder="Örnek: Frontend Developer | React Specialist"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            <div
              style={{
                transform: "translateY(0)",
                opacity: 1,
                transition: "all 0.6s ease 0.5s",
              }}
            >
              <MDInput
                fullWidth
                label="Telefon Numarası"
                value={cvDataBasicInformation?.phone || ""}
                onChange={(e: any) =>
                  setCvDataBasicInformation({ ...cvDataBasicInformation, phone: e.target.value })
                }
                placeholder="+90 (555) 123-4567"
              />
            </div>

            <div
              style={{
                transform: "translateY(0)",
                opacity: 1,
                transition: "all 0.6s ease 0.6s",
              }}
            >
              <MDInput
                fullWidth
                label="Konum"
                value={cvDataBasicInformation?.location || ""}
                onChange={(e: any) =>
                  setCvDataBasicInformation({ ...cvDataBasicInformation, location: e.target.value })
                }
                placeholder="İstanbul, Türkiye"
              />
            </div>
          </div>
        </div>
      </MDBox>
    </MDBox>
  );
}

export default Basic;
