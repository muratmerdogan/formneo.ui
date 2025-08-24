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

import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Images
import burceMars from "assets/images/bruce-mars.jpg";
import { useFormikContext } from "formik";
import getConfiguration from "confiuration";
import { SAPReportsApi } from "api/generated";

function Header({ formData }: any): JSX.Element {
  const [visible, setVisible] = useState<boolean>(true);
  const { formField, values, errors, touched, isSystemAdmin, vacationMode, isBlocked } = formData;
  const { userName, firstName, lastName, email, password, photo } = formField;
  const {
    userName: userNameV,
    firstName: firstNameV,
    lastName: lastNameV,
    email: emailV,
    password: passwordV,
    isSystemAdmin: isSystemAdminV,
    vacationMode: vacationModeV,
    isBlocked: isBlockedV,
    isTestData: isTestDataV,
    photo: photoV,
  } = values;

  const { setFieldValue } = useFormikContext();

  function handleIsLocked() {
    setFieldValue("isBlocked", !values.isBlocked);
  }
  function handleIsTestData() {
    setFieldValue("isTestData", !values.isTestData);
  }
  return (
    <Card
      id="profile"
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
        boxShadow: (t) => t.palette.mode === 'dark' ? '0 6px 20px rgba(0,0,0,.45)' : '0 6px 20px rgba(0,0,0,.12)',
        backgroundColor: (t) => t.palette.mode === 'dark' ? '#111827' : '#eff6ff',
      }}
    >
      {/* Banner */}
      <MDBox sx={{ height: 140 }} />

      {/* Content */}
      <MDBox sx={{ px: 2, pb: 2, mt: -8 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <MDBox display="flex" flexDirection="column" alignItems="center">
              <MDBox sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                overflow: 'hidden',
                border: (t) => `3px solid ${t.palette.background.paper}`,
                boxShadow: (t) => t.palette.mode === 'dark' ? '0 6px 18px rgba(0,0,0,.6)' : '0 6px 18px rgba(0,0,0,.15)'
              }}>
                {values.photo && (
                  <img
                    src={values.photo.startsWith('data:image') ? values.photo : `data:image/png;base64,${values.photo}`}
                    alt="profile-image"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </MDBox>

              <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        setFieldValue("photo", event.target.result);
                      }
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
              <label htmlFor="raised-button-file">
                <MDTypography variant="caption" color="text" fontWeight="medium" style={{ cursor: "pointer", marginTop: 8 }}>
                  Fotoğraf Yükle
                </MDTypography>
              </label>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <MDBox lineHeight={1} sx={{ textAlign: { xs: 'center', md: 'left' }, mt: 1.5 }}>
              <MDTypography variant="h5" fontWeight="medium" color={(t: any) => t.palette.mode === 'dark' ? 'white' : 'text.primary'}>
                {values.firstName} {values.lastName}
              </MDTypography>
              <MDBox mt={0.5} display="flex" alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }} gap={1} flexWrap="wrap">
                <Chip size="small" label={values.email} variant="outlined" />
                {!values.isBlocked && <Chip size="small" label="Aktif" color="success" variant="outlined" />}
                {values.isBlocked && <Chip size="small" label="Pasif" color="warning" variant="outlined" />}
                {values.isSystemAdmin && <Chip size="small" label="System Admin" color="info" variant="outlined" />}
                {values.isTestData && <Chip size="small" label="Test" color="default" variant="outlined" />}
              </MDBox>
              {(values.sapPositionText || values.SAPDepartmentText) && (
                <MDBox mt={0.5}>
                  <MDTypography variant="caption" color="text">
                    {values.SAPDepartmentText} {values.sapPositionText ? `• ${values.sapPositionText}` : ''}
                  </MDTypography>
                </MDBox>
              )}
            </MDBox>
          </Grid>
          <Grid item xs={12} md={3}>
            <MDBox display="flex" flexDirection="column" alignItems={{ xs: 'center', md: 'flex-end' }}>
              <MDBox display="flex" alignItems="center">
                <MDTypography variant="caption" fontWeight="regular">
                  Kullanıcı {values.isBlocked ? "Pasif" : "Aktif"}
                </MDTypography>
                <MDBox ml={1}>
                  <Switch checked={!values.isBlocked} onChange={handleIsLocked} />
                </MDBox>
              </MDBox>
              <MDBox display="flex" alignItems="center" mt={1}>
                <MDTypography variant="caption" fontWeight="regular">
                  Test Verisi mi?
                </MDTypography>
                <MDBox ml={1}>
                  <Switch checked={values.isTestData} onChange={handleIsTestData} />
                </MDBox>
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
}

export default Header;
