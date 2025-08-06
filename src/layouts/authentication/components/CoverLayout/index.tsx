/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.2
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { ReactNode } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import { Theme } from "@mui/material/styles";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";

// Material Dashboard 2 PRO React TS examples components
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import PageLayout from "examples/LayoutContainers/PageLayout";

// Authentication layout components


// Material Dashboard 2 PRO React page layout routes
import pageRoutes from "page.routes";
import Footer from "examples/Footer";

// Declaring props types for CoverLayout
interface Props {
  coverHeight?: string;
  image: string;
  children: ReactNode;
}

function CoverLayout({ coverHeight, image, children }: Props): JSX.Element {
  return (
    <PageLayout>
      {/* <DefaultNavbar
        
        routes={pageRoutes}
        
        transparent
        light
      /> */}
      <MDBox
        width="calc(100% - 2rem)"
        minHeight={coverHeight}
        borderRadius="xl"
        mx={2}
        my={2}
        pt={6}
        pb={28}
        sx={{
          backgroundImage: ({
            functions: { linearGradient, rgba },
            palette: { gradients },
          }: Theme) =>
            image &&
            `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center 18%",
          backgroundRepeat: "no-repeat",
        }}
      />
      <MDBox mt={{ xs: -20, lg: -18 }} px={1} width="calc(100% - 2rem)" mx="auto">
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            {children}
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </PageLayout>
  );
}

// Declaring default props for CoverLayout
CoverLayout.defaultProps = {
  coverHeight: "35vh",
};

export default CoverLayout;