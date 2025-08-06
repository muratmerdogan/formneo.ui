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

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import getConfiguration from "confiuration";
import { ProjectsApi } from "api/generated";
import ProductImage from "./components/ProductImage";
import ProductInfo from "./components/ProductInfo";
import Socials from "./components/Socials";
import Pricing from "./components/Pricing";
import { useTranslation } from "react-i18next";

function EditProject(): JSX.Element {
  const params = useParams();
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pl={3}>
        <MDBox mb={6}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} lg={6} sx={{ zIndex: 12 }}>
              <MDTypography variant="h4" fontWeight="medium">
                {t("ns1:ProfilePage.EditProject.ProjeDetaylari")}
              </MDTypography>
              <MDBox mt={1} mb={2}>
                <MDTypography variant="body2" color="text"></MDTypography>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <ProductInfo params={params} />
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default EditProject;
