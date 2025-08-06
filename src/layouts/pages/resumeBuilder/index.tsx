import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState } from "react";
import Profile from "./components/profile";
import Paper from "./components/paper";
import MDBox from "components/MDBox";
import { TicketProjectsListDto } from "api/generated";

export interface CvData {
  basicInformation: {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
    headline: string;
    phone: string;
    location: string;
  };
  summary:{
    summary: string;
  };
  education: {
    id: number;
    institution: string;
    typeOfStudy: string;
    areaOfStudy: string;
    score: string;
    dateOrDateRange: string;
    description: string;
      
  }[];
  experience: {
    id: number;
    position: string;
    company: string;
    dateOrDateRange: string;
    location: string;
    website: string;
    description: string;
  }[];
  languages:{
    id: number;
    language: string;
    description: string;
    level: string;
  }[];
  projects:{
    id: number;
    name: string;
    project: TicketProjectsListDto;
    description: string;
  }[];
}

function ResumeBuild() {
  const [cvData, setCvData] = useState<CvData>({
    basicInformation: {
      firstName: "",
      lastName: "",
      email: "",
      profilePicture: "",
      headline: "",
      phone: "",
      location: "",
    },
    summary: {
      summary: "",
    },
    education: [],
    experience: [],
    languages: [],
    projects: [],
  });
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "start",
          gap: 2,
        }}
      >
        <Profile cvData={cvData} setCvData={setCvData} />
        <Paper cvData={cvData} />
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default ResumeBuild;
