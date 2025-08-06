import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import React, { useEffect, useRef } from "react";
import { CvData } from "../..";
import profile from "../../../../../assets/images/profile-icon.png";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import BoltIcon from "@mui/icons-material/Bolt";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import LanguageIcon from "@mui/icons-material/Language";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import DownloadIcon from "@mui/icons-material/Download";
import MDButton from "components/MDButton";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
interface PaperProps {
  cvData: CvData;
}

// A4 Paper dimensions (in mm)
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

// A4 Paper dimensions (in px at 96 DPI)
const A4_WIDTH_PX = Math.floor(A4_WIDTH_MM * 3.78); // 3.78 px/mm (96 DPI)
const A4_HEIGHT_PX = Math.floor(A4_HEIGHT_MM * 3.78);

const SectionHeader = ({ title, icon }: { title: string; icon: React.ReactNode }) => (
  <MDBox
    sx={{
      display: "flex",
      alignItems: "center",
      marginBottom: "16px",
      paddingBottom: "8px",
      borderBottom: "2px solid #2563eb",
    }}
  >
    <MDBox
      sx={{
        width: "24px",
        height: "24px",
        backgroundColor: "#2563eb",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "12px",
      }}
    >
      <span style={{ color: "white", fontSize: "12px", fontWeight: "bold" }}>{icon}</span>
    </MDBox>
    <MDTypography
      variant="h5"
      color="#2563eb"
      fontWeight="bold"
      sx={{ textTransform: "uppercase", letterSpacing: "1px" }}
    >
      {title}
    </MDTypography>
  </MDBox>
);

function Paper({ cvData }: PaperProps) {
  const cvContentRef = useRef<HTMLDivElement>(null);

  const getLanguageLevelLabel = (level: string) => {
    if (level === "0" || level === "1") {
      return "Başlangıç";
    } else if (level === "2" || level === "3") {
      return "Orta";
    } else if (level === "4" || level === "5") {
      return "İleri";
    }
  };

  const getLanguageLevelColor = (level: string) => {
    if (level === "0" || level === "1") {
      return "#10b981";
    } else if (level === "2" || level === "3") {
      return "#3b82f6";
    } else if (level === "4" || level === "5") {
      return "#f59e0b";
    }
  };

  const handlePDFexport = () => {
    if (!cvContentRef.current) return;

    const contentElement = cvContentRef.current;
    const paperElement = contentElement.querySelector(".a4-paper") as HTMLElement;

    if (!paperElement) return;

    // Clone the paper element to modify for PDF without affecting the UI
    const clonedPaper = paperElement.cloneNode(true) as HTMLElement;

    // Apply white background to ensure proper rendering in PDF
    clonedPaper.style.backgroundColor = "white";

    // Create a temporary container with white background
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.backgroundColor = "white";
    tempContainer.appendChild(clonedPaper);
    document.body.appendChild(tempContainer);

    // Set scale factor for better quality
    const scaleFactor = 3; // Increased for even better quality

    const options = {
      scale: scaleFactor,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "white", // Explicitly set background to white
      windowWidth: A4_WIDTH_PX,
      windowHeight: A4_HEIGHT_PX,
      imageTimeout: 0,
    };

    html2canvas(clonedPaper, options).then((canvas) => {
      try {
        const targetWidth = A4_WIDTH_MM;
        const targetHeight = (canvas.height * targetWidth) / canvas.width;

        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
          compress: false,
        });

        // Set white background for the entire page
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, "F");

        // Add the image with white background
        pdf.addImage(imgData, "JPEG", 0, 0, targetWidth, targetHeight, undefined, "FAST");
        pdf.save("cv.pdf");
      } finally {
        // Clean up - remove temporary elements
        document.body.removeChild(tempContainer);
      }
    });
  };

  return (
    <MDBox>
      <MDBox
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <MDTypography variant="h5">CV Preview</MDTypography>
        <MDButton variant="contained" color="primary" onClick={handlePDFexport}>
          <DownloadIcon sx={{ marginRight: "8px" }} />
          Download PDF
        </MDButton>
      </MDBox>
      <MDBox
        id="cv-content"
        ref={cvContentRef}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        {/* Responsive Paper Container */}
        <MDBox
          className="a4-paper"
          sx={{
            width: `${A4_WIDTH_MM}mm`,
            backgroundColor: "white",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            margin: "0 auto",
            color: "black",
          }}
        >
          {/* Header Section */}
          <MDBox
            sx={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #2563eb 100%)",
              color: "white !important",
              padding: "20px",
              paddingLeft: "40px",
              paddingRight: "40px",
              position: "relative",
            }}
          >
            {/* Decorative Elements */}
            <div
              style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "150px",
                height: "150px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-30px",
                left: "-30px",
                width: "100px",
                height: "100px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "50%",
              }}
            />

            <MDBox
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "32px",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Profile Picture */}
              <MDBox
                sx={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  border: "4px solid rgba(255,255,255,0.3)",
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
              >
                <img
                  src={cvData.basicInformation.profilePicture || profile}
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </MDBox>

              {/* Basic Info */}
              <MDBox sx={{ flex: 1 }}>
                <MDTypography variant="h1" sx={{ color: "white !important", marginBottom: "8px" }}>
                  {cvData.basicInformation.firstName} {cvData.basicInformation.lastName}
                </MDTypography>
                <MDTypography
                  variant="h4"
                  sx={{ color: "white !important", marginBottom: "10px", fontWeight: "400" }}
                >
                  {cvData.basicInformation.headline}
                </MDTypography>

                {/* Contact Info */}
                <MDBox sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <MDBox sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <AlternateEmailIcon sx={{ color: "white !important" }} />
                    <MDTypography variant="body1" sx={{ color: "white !important" }}>
                      {cvData.basicInformation.email}
                    </MDTypography>
                  </MDBox>
                  <MDBox sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <PhoneIcon sx={{ color: "white !important" }} />
                    <MDTypography variant="body1" sx={{ color: "white !important" }}>
                      {cvData.basicInformation.phone}
                    </MDTypography>
                  </MDBox>
                  <MDBox sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <LocationOnIcon sx={{ color: "white !important" }} />
                    <MDTypography variant="body1" sx={{ color: "white !important" }}>
                      {cvData.basicInformation.location}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </MDBox>
            </MDBox>
          </MDBox>

          {/* Main Content */}
          <MDBox
            sx={{
              padding: "20px",
              backgroundColor: "white !important",
            }}
          >
            {/* Summary Section */}
            {cvData.summary?.summary && (
              <MDBox sx={{ marginBottom: "40px" }}>
                <SectionHeader title="Professional Summary" icon={<PersonIcon />} />
                <MDTypography
                  variant="caption"
                  color="#4b5563"
                  sx={{
                    lineHeight: 1.5,
                    fontSize: "0.9rem",
                    "& .ql-size-small": { fontSize: "0.7em" },
                    "& .ql-size-large": { fontSize: "1.1em" },
                    "& .ql-size-huge": { fontSize: "1.3em" },
                    color: "#4b5563 !important",
                  }}
                  dangerouslySetInnerHTML={{ __html: cvData.summary.summary }}
                />
              </MDBox>
            )}

            {/* Two Column Layout */}
            <MDBox sx={{ display: "flex", gap: "40px" }}>
              {/* Left Column */}
              <MDBox sx={{ flex: "1" }}>
                {/* Experience Section */}
                {cvData.experience?.length > 0 && (
                  <MDBox sx={{ marginBottom: "40px" }}>
                    <SectionHeader title="Professional Experience" icon={<WorkIcon />} />
                    {cvData.experience.map((exp, index) => (
                      <MDBox
                        key={exp.id}
                        sx={{
                          marginBottom: "24px",
                          paddingLeft: "16px",
                          borderLeft: index === 0 ? "3px solid #2563eb" : "3px solid #e5e7eb",
                          position: "relative",
                        }}
                      >
                        {/* Timeline dot */}
                        <div
                          style={{
                            position: "absolute",
                            left: "-7px",
                            top: "4px",
                            width: "12px",
                            height: "12px",
                            backgroundColor: index === 0 ? "#2563eb" : "#9ca3af",
                            borderRadius: "50%",
                          }}
                        />

                        <MDTypography
                          variant="h6"
                          sx={{ marginBottom: "4px", color: "#1f2937 !important" }}
                        >
                          {exp.position}
                        </MDTypography>
                        <MDTypography
                          variant="subtitle1"
                          sx={{
                            marginBottom: "4px",
                            fontWeight: "600",
                            color: "#2563eb !important",
                          }}
                        >
                          {exp.company} • {exp.location}
                        </MDTypography>
                        <MDTypography
                          variant="caption"
                          sx={{
                            marginBottom: "8px",
                            display: "block",
                            color: "#6b7280 !important",
                          }}
                        >
                          {exp.dateOrDateRange}
                        </MDTypography>
                        <MDTypography
                          variant="body2"
                          sx={{ lineHeight: 1.6, color: "#4b5563 !important" }}
                        >
                          <div dangerouslySetInnerHTML={{ __html: exp.description }} />
                        </MDTypography>
                      </MDBox>
                    ))}
                  </MDBox>
                )}

                {/* Projects Section */}
                {cvData.projects?.length > 0 && (
                  <MDBox sx={{ marginBottom: "5px" }}>
                    <SectionHeader title="Key Projects" icon={<RocketLaunchIcon />} />
                    {cvData.projects.map((project) => (
                      <MDBox
                        key={project.id}
                        sx={{
                          marginBottom: "20px",
                          padding: "16px",
                          backgroundColor: "#f8fafc",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <MDTypography
                          variant="h6"
                          sx={{ marginBottom: "8px", color: "#1f2937 !important" }}
                        >
                          {project.name}
                        </MDTypography>
                        <MDTypography
                          variant="caption"
                          sx={{ lineHeight: 1.5, fontSize: "0.8rem", color: "#4b5563 !important" }}
                        >
                          <div dangerouslySetInnerHTML={{ __html: project.description }} />
                        </MDTypography>
                      </MDBox>
                    ))}
                  </MDBox>
                )}
              </MDBox>

              {/* Right Column */}
              <MDBox sx={{ width: "300px" }}>
                {/* Education Section */}
                {cvData.education?.length > 0 && (
                  <MDBox sx={{ marginBottom: "20px" }}>
                    <SectionHeader title="Education" icon={<SchoolIcon />} />
                    {cvData.education.map((edu) => (
                      <MDBox
                        key={edu.id}
                        sx={{
                          marginBottom: "20px",
                          padding: "16px",
                          backgroundColor: "#fefefe",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <MDTypography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "600",
                            marginBottom: "4px",
                            color: "#1f2937 !important",
                          }}
                        >
                          {edu.typeOfStudy}
                        </MDTypography>
                        <MDTypography
                          variant="body2"
                          sx={{
                            fontWeight: "500",
                            marginBottom: "4px",
                            color: "#2563eb !important",
                          }}
                        >
                          {edu.areaOfStudy}
                        </MDTypography>
                        <MDTypography
                          variant="body2"
                          sx={{ marginBottom: "4px", color: "#1f2937 !important" }}
                        >
                          {edu.institution}
                        </MDTypography>
                        <MDTypography
                          variant="caption"
                          sx={{
                            marginBottom: "8px",
                            display: "block",
                            color: "#6b7280 !important",
                          }}
                        >
                          {edu.dateOrDateRange} • {edu.score}
                        </MDTypography>
                        {edu.description && (
                          <MDTypography
                            variant="caption"
                            sx={{ lineHeight: 1.5, color: "#4b5563 !important" }}
                            dangerouslySetInnerHTML={{ __html: edu.description }}
                          />
                        )}
                      </MDBox>
                    ))}
                  </MDBox>
                )}

                {/* Languages Section */}
                {cvData.languages?.length > 0 && (
                  <MDBox sx={{ marginBottom: "10px" }}>
                    <SectionHeader title="Languages" icon={<LanguageIcon />} />
                    {cvData.languages.map((lang) => (
                      <MDBox
                        key={lang.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "12px",
                          padding: "8px 0",
                          borderBottom: "1px solid #f1f5f9",
                        }}
                      >
                        <MDTypography
                          variant="body2"
                          sx={{ fontWeight: "500", color: "#1f2937 !important" }}
                        >
                          {lang.language}
                        </MDTypography>
                        <MDBox
                          sx={{
                            backgroundColor: getLanguageLevelColor(lang.level),
                            color: "white !important",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                          }}
                        >
                          {getLanguageLevelLabel(lang.level)}
                        </MDBox>
                      </MDBox>
                    ))}
                  </MDBox>
                )}

                {/* Skills Section */}
                <MDBox sx={{ marginBottom: "0px" }}>
                  <SectionHeader title="Core Skills" icon={<BoltIcon />} />
                  <MDBox sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {["React", "Node.js", "TypeScript", "Python"].map((skill, index) => (
                      <MDBox
                        key={index}
                        sx={{
                          backgroundColor: "#eff6ff",
                          color: "#2563eb !important",
                          padding: "6px 12px",
                          borderRadius: "16px",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          border: "1px solid #dbeafe",
                        }}
                      >
                        {skill}
                      </MDBox>
                    ))}
                  </MDBox>
                </MDBox>
              </MDBox>
            </MDBox>
          </MDBox>
        </MDBox>
      </MDBox>
      {cvData.projects && cvData.projects.length > 0 && (
        <MDBox mt={2}>
           <MDBox>
            <MDTypography variant="h5">Projects</MDTypography>
          </MDBox>
        <MDBox
          id="cv-content"
          
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            backgroundColor: "#f8fafc",
            marginTop: "20px",
          }}
        >
         
          <MDBox
            className="a4-paper"
            sx={{
              width: `${A4_WIDTH_MM}mm`,
              backgroundColor: "white",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              margin: "0 auto",
              color: "black",
            }}
            ></MDBox>
          </MDBox>
        </MDBox>
      )}
    </MDBox>
  );
}

export default Paper;
