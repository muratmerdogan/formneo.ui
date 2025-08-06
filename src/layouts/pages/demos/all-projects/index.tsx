import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 PRO React TS examples components
import PageLayout from "examples/LayoutContainers/PageLayout";
import Footer from "examples/Footer";
import ComplexProjectCard from "examples/Cards/ProjectCards/ComplexProjectCard";

// Project page components


// Images
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import btplogo from "assets/images/btplogo.jpg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import Header from "../header";

function AllDemos(): JSX.Element {
  const [menuAnchor, setMenuAnchor] = useState<Record<number, HTMLElement | null>>({});

  const projects = [
    {
      image: btplogo,
      title: "Norm Kadro Projesi",
      description: "Başarılı Şekilde proje hayata geçirilmiştir",
      dateTime: "01.01.24",
    },
    {
      image: btplogo,
      title: "Ekip Takvimi Projesi",
      description: "Başarılı Şekilde proje hayata geçirilmiştir",
      dateTime: "01.01.24",
      members: [team1, team3],
    },
    {
      image: btplogo,
      title: "E-İmza Zaman Damgası Projesi",
      description: "Başarılı Şekilde proje hayata geçirilmiştir",
      dateTime: "01.01.24",
      members: [team1, team3],
    },
    {
      image: btplogo,
      title: "Yıllık İzin Mutabakatı Projesi",
      description: "Başarılı Şekilde proje hayata geçirilmiştir",
      dateTime: "01.01.24",
      members: [team1, team3],
    },


    {
      image: btplogo,
      title: "Seyahat / Masraf Yönetim Projesi",
      description: "Başarılı Şekilde proje hayata geçirilmiştir",
      dateTime: "22.11.21",
      members: [team1, team3],
    },
    {
      image: btplogo,
      title: "Onay Sistemi ve WorkFlow Yönetim Projesi",
      description: "Başarılı Şekilde proje hayata geçirilmiştir",
      dateTime: "22.11.21",
      members: [team1, team3],
    },

  ];

  const openMenu = (index: number, event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor((prev) => ({ ...prev, [index]: event.currentTarget }));
  };

  const closeMenu = (index: number) => {
    setMenuAnchor((prev) => ({ ...prev, [index]: null }));
  };

  const renderMenu = (index: number) => (
    <Menu
      anchorEl={menuAnchor[index] || null}
      open={Boolean(menuAnchor[index])}
      onClose={() => closeMenu(index)}
      keepMounted
    >
      <MenuItem onClick={() => closeMenu(index)}>Action</MenuItem>
      <MenuItem onClick={() => closeMenu(index)}>Another Action</MenuItem>
      <MenuItem onClick={() => closeMenu(index)}>Something else here</MenuItem>
    </Menu>
  );

  return (
    <PageLayout>
      <div style={{ marginLeft: "50px", marginRight: "50px" }}>
        <MDBox pb={3}>
          <Header />
          <MDBox>
            <Grid container spacing={3}>
              {projects.map((project, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <MDBox mb={1.5} mt={1.5}>
                    <ComplexProjectCard
                      image={project.image}
                      title={project.title}
                      description={project.description}
                      dateTime={project.dateTime}
                      color="light"
                      dropdown={{
                        action: (event: React.MouseEvent<HTMLElement>) => openMenu(index, event),
                        menu: renderMenu(index),
                      }}
                    />
                  </MDBox>
                </Grid>
              ))}
            </Grid>
          </MDBox>
          <Footer />
        </MDBox>
      </div>
    </PageLayout >
  );
}

export default AllDemos;
