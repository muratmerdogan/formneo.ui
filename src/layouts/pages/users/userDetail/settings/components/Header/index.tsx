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
    <Card id="profile">
      <MDBox p={2}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6} lg={3}>
            <MDBox display="flex" flexDirection="column" alignItems="center">
              {values.photo && (
                <img
                  src={
                    values.photo
                      ? values.photo.startsWith("data:image")
                        ? values.photo
                        : `data:image/png;base64,${values.photo}`
                      : null
                  }
                  alt="profile-image"
                  style={{
                    width: "150px", // Genişlik
                    height: "150px", // Yükseklik
                    borderRadius: "50%", // Yuvarlak görünüm
                    objectFit: "cover", // Görüntüyü kesmeden sığdır
                    objectPosition: "center", // Görüntüyü ortala
                    border: "2px solid #fff", // Şık bir beyaz kenarlık
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Hafif gölge efekti
                  }}
                  onError={(e) => {
                    // Hata kontrolü: Görsel yüklenemezse varsayılan resme geçiş yapar
                  }}
                />
              )}

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
                        // Update the avatar URL in your form values
                        console.log(event.target.result);
                        setFieldValue("photo", event.target.result);
                      }
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
              <label htmlFor="raised-button-file">
                <MDTypography
                  variant="button"
                  color="blue"
                  fontWeight="medium"
                  style={{ cursor: "pointer" }}
                >
                  Fotoğraf Yükle
                </MDTypography>
              </label>
              <MDBox mt={1}>
                <MDTypography
                  variant="button"
                  color="secondary"
                  fontWeight="medium"
                  onClick={async () => {
                    var conf = getConfiguration();
                    var api = new SAPReportsApi(conf);
                    var data = await api.apiSAPReportsGetSapInfoGet(values.email);
                    console.log(data.data);
                    setFieldValue("photo", data.data.photo);
                    setFieldValue("sapPositionText", data.data.stext);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  SAP Bilgileriden Getir
                </MDTypography>
              </MDBox>
            </MDBox>
          </Grid>

          <Grid item>
            <MDBox style={{ marginTop: "1px" }} height="100%" mt={0.5} lineHeight={1}>
              <MDBox display="flex" flexDirection="column">
                <MDTypography variant="h5" fontWeight="medium">
                  {values.firstName} {values.lastName}
                </MDTypography>
                <MDTypography variant="button" color="text" fontWeight="medium">
                  {values.email}
                </MDTypography>
                <MDTypography variant="button" color="text" fontWeight="medium">
                  {values.SAPDepartmentText}
                </MDTypography>
                <MDTypography variant="button" color="orange" fontWeight="medium">
                  {values.sapPositionText}
                </MDTypography>
              </MDBox>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3} sx={{ ml: "auto" }}>
            <MDBox
              display="flex"
              flexDirection="column"
              justifyContent={{ md: "flex-end" }}
              alignItems="flex-end"
              lineHeight={1}
            >
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
