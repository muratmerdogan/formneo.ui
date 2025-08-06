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
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

import FormField from "layouts/pages/users/new-user/components/FormField";

function NewPaswword({ formData, readOnlyUserName }: any): JSX.Element {

  const { formField, values, errors, touched, isSystemAdmin, vacationMode, isBlocked } = formData;
  const { password, repeatPassword } = formField;
  const { repeatPassword: repeatPasswordV, password: passwordV, isSystemAdmin: isSystemAdminV, vacationMode: vacationModeV, isBlocked: isBlockedV } = values;


  const passwordRequirements = [
    "One special characters",
    "Min 6 characters",
    "One number (2 are recommended)",
    "Change it often",
  ];

  const renderPasswordRequirements = passwordRequirements.map((item, key) => {
    const itemKey = `element-${key}`;

    return (
      <MDBox key={itemKey} component="li" color="text" fontSize="1.25rem" lineHeight={1}>
        <MDTypography variant="button" color="text" fontWeight="regular" verticalAlign="middle">
          {item}
        </MDTypography>
      </MDBox>
    );
  });

  return (
    <Card id="change-password">
      <MDBox p={3}>
        <MDTypography variant="h5">New Password</MDTypography>
      </MDBox>
      <MDBox component="form" pb={3} px={3}>
        <Grid container spacing={3}>

          <Grid item xs={12}>
            <FormField
              type={password.type}
              label={password.label}
              name={password.name}
              value={passwordV}
              placeholder={password.placeholder}
              error={errors.password && touched.password}
              success={Boolean(passwordV) && !errors.password}
              InputProps={{
                readOnly: false,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            {/* <FormField
              type={repeatPassword.type}
              label={repeatPassword.label}
              name={repeatPassword.name}
              value={repeatPasswordV}
              placeholder={repeatPassword.placeholder}
              error={errors.repeatPassword && touched.repeatPassword}
              success={Boolean(repeatPasswordV) && !errors.repeatPassword}
              InputProps={{
                readOnly: false,
              }}
            /> */}
          </Grid>
        </Grid>
        <MDBox mt={6} mb={1}>
          <MDTypography variant="h5">Password requirements</MDTypography>
        </MDBox>
        <MDBox mb={1}>
          <MDTypography variant="body2" color="text">
            Please follow this guide for a strong password
          </MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-end" flexWrap="wrap">
          <MDBox component="ul" m={0} pl={3.25} mb={{ xs: 8, sm: 0 }}>
            {renderPasswordRequirements}
          </MDBox>

        </MDBox>
      </MDBox>
    </Card>
  );
}

export default NewPaswword;
