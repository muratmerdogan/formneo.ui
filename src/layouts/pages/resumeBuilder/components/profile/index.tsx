import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import React from "react";
import Basic from "./components/basic/basic";
import Summery from "./components/summary/summery";
import Education from "./components/education/education";
import { CvData } from "../..";
import Experience from "./components/experience";
import Languages from "./components/languages";
import Projects from "./components/projects";
import { TicketProjectsListDto } from "api/generated";

interface ProfileProps {
  cvData: CvData;
  setCvData: (data: CvData) => void;
}

function Profile({ cvData, setCvData }: ProfileProps) {
  const handleBasicInfoUpdate = (basicInfo: {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
    headline: string;
    phone: string;
    location: string;
  }) => {
    setCvData({ ...cvData, basicInformation: basicInfo });
  };

  const handleSummaryUpdate = (summaryData: { summary: string }) => {
    setCvData({ ...cvData, summary: summaryData });
  };

  const handleEducationUpdate = (
    educationData: {
      id: number;
      institution: string;
      typeOfStudy: string;
      areaOfStudy: string;
      score: string;
      dateOrDateRange: string;
      description: string;
    }[]
  ) => {
    setCvData({ ...cvData, education: educationData });
  };

  const handleExperienceUpdate = (experienceData: {
    id: number;
    position: string;
    company: string;
    dateOrDateRange: string;
    location: string;
    website: string;
    description: string;
  }[]) => {
    setCvData({ ...cvData, experience: experienceData });
  };

  const handleLanguagesUpdate = (languagesData: {
    id: number;
    language: string;
    level: string;
    description: string;
  }[]) => {
    setCvData({ ...cvData, languages: languagesData });
  };

  const handleProjectsUpdate = (projectsData: {

    id: number;
    name: string;
    project: TicketProjectsListDto;
    description: string;
  }[]) => {
    setCvData({ ...cvData, projects: projectsData });
  };
  return (
    <MDBox
      sx={{
        width: "100%",
        maxWidth: "750px",
        margin: "0 auto",
      }}
    >
      <Card
        sx={{
          width: "100%",
          height: "100%",
          overflow: "visible",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <Basic
          cvDataBasicInformation={cvData.basicInformation || {
            firstName: "",
            lastName: "",
            email: "",
            profilePicture: "",
            headline: "",
            phone: "",
            location: "",
          }}
          setCvDataBasicInformation={handleBasicInfoUpdate}
        />
        <Summery cvDataSummary={cvData.summary} setCvDataSummary={handleSummaryUpdate} />
        <Education cvDataEducation={cvData.education} setCvDataEducation={handleEducationUpdate} />
        <Experience cvDataExperience={cvData.experience} setCvDataExperience={handleExperienceUpdate} />
        {/* <Profiles */}
        {/* <Skills */}
        <Languages cvDataLanguages={cvData.languages} setCvDataLanguages={handleLanguagesUpdate} />
        {/* <Awards */}
        {/* <Certifications */}
        {/* <Interest */}
        <Projects cvDataProjects={cvData.projects} setCvDataProjects={handleProjectsUpdate} />
        {/* <Publications */}
        {/* <Volunteering */}
        {/* <References */}
      </Card>
    </MDBox>
  );
}

export default Profile;
