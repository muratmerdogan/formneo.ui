import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import React, { useRef, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AssignmentIcon from "@mui/icons-material/Assignment";
import "./summary.css";
import { CvData } from "layouts/pages/resumeBuilder";

interface SummeryProps {
  cvDataSummary: CvData["summary"];
  setCvDataSummary: (data: CvData["summary"]) => void;
}

function Summery({ cvDataSummary, setCvDataSummary }: SummeryProps) {
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ color: [] as string[] }, { background: [] as string[] }],
        [{ font: [] as string[] }],
        [{ align: [] as string[] }],
        ["clean"],
        ["link", "image"],
      ] as const,
    },
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "direction",
    "color",
    "background",
    "font",
    "size",
    "script",
  ];

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [isOpen]);

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
          <AssignmentIcon
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
            Summary
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
          overflow: "hidden",
          transition: "max-height 0.4s ease-in-out",
          maxHeight: maxHeight,
        }}
      >
        <MDBox
          sx={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            padding: "8px 0",
          }}
        >
          <ReactQuill
            theme="snow"
            className="custom-quill"
            style={{
              minHeight: "220px",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
       
            modules={modules}
            placeholder="Write a professional summary that highlights your experience and skills..."
            value={cvDataSummary.summary}
            onChange={(value) => setCvDataSummary({ summary: value })}
          />
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

export default Summery;
