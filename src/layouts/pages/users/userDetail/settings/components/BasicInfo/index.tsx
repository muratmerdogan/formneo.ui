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

// @material-ui core components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Settings page components

import FormField from "layouts/pages/users/new-user/components/FormField";

// Data
import selectData from "layouts/pages/account/settings/components/BasicInfo/data/selectData";
import { an } from "@fullcalendar/core/internal-common";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import getConfiguration from "confiuration";

import MDInput from "components/MDInput";


function BasicInfo({ formData, readOnlyUserName }: any): JSX.Element {
  const { formField, values, errors, touched, isSystemAdmin, vacationMode, isBlocked } = formData;
  const { userName, firstName, lastName, email, password, pCname } = formField;
  const { userName: userNameV, firstName: firstNameV, lastName: lastNameV, email: emailV, password: passwordV, isSystemAdmin: isSystemAdminV, vacationMode: vacationModeV, isBlocked: isBlockedV, pCname: pCnameV } = values;
  const { setFieldValue } = useFormikContext();




  return (
    <Card id="basic-info" sx={{ overflow: "visible" }}>
      <MDBox p={3}>
        <MDTypography variant="h5">Genel Bilgiler</MDTypography>
      </MDBox>
      <MDBox component="form" pb={3} px={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField
              type={firstName.type}
              label={firstName.label}
              name={firstName.name}
              value={firstNameV}
              placeholder={firstName.placeholder}
              error={errors.firstName && touched.firstName}
              success={Boolean(firstNameV) && !errors.firstName}
              InputProps={{
                readOnly: false,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type={lastName.type}
              label={lastName.label}
              name={lastName.name}
              value={lastNameV}
              placeholder={lastName.placeholder}
              error={errors.lastName && touched.lastName}
              success={lastNameV.length > 0 && !errors.lastName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type={userName.type}
              label={userName.label}
              name={userName.name}
              value={userNameV}
              disabled={readOnlyUserName}
              placeholder={userName.placeholder}
              error={errors.userName && touched.userName}
              success={Boolean(userNameV) && !errors.userName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type={email.type}
              label={email.label}
              name={email.name}
              value={emailV}
              disabled={readOnlyUserName}
              placeholder={email.placeholder}
              error={errors.email && touched.email}
              success={emailV.length > 0 && !errors.email}
            />
          </Grid>

          <Grid item xs={12} sm={6}>

          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                {/* <FormField
              name="computerName"
              label="Phone Number"
              placeholder="+40 735 631 620"
              inputProps={{ type: "number" }}
            /> */}
              </Grid>
              <Grid item xs={12} sm={6}>

              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={6}>
            {/* <FormField label="your location" placeholder="Sydney, A" /> */}
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* <FormField
              name="computerName"
              label="Phone Number"
              placeholder="+40 735 631 620"
              inputProps={{ type: "number" }}
            /> */}
          </Grid>
          <Grid item xs={12} md={6}>
            {/* <FormField label="Language" placeholder="English" /> */}
          </Grid>
          <Grid item xs={12} md={6}>
            {/* <Autocomplete
              multiple
              defaultValue={["react", "angular"]}
              options={selectData.skills}
              renderInput={(params) => <FormField {...params} InputLabelProps={{ shrink: true }} />}
            /> */}
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
}

export default BasicInfo;
