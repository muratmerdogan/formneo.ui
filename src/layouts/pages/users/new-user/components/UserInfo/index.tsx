import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import FormField from "layouts/pages/users/new-user/components/FormField";
import { useEffect } from "react";
import FormCheckbox from "../FormCheckBox";

function UserInfo({ formData, showPassword, readOnlyUserName }: { formData: any; showPassword: boolean; readOnlyUserName: boolean }): JSX.Element {
  const { formField, values, errors, touched, isSystemAdmin, vacationMode, isBlocked } = formData;
  const { userName, firstName, lastName, email, password } = formField;
  const { userName: userNameV, firstName: firstNameV, lastName: lastNameV, email: emailV, password: passwordV, isSystemAdmin: isSystemAdminV, vacationMode: vacationModeV, isBlocked: isBlockedV } = values;

  useEffect(() => { }, []);

  return (
    <MDBox>
      <MDBox lineHeight={0}>
        <MDTypography variant="h5">Kullanıcı</MDTypography>
      </MDBox>
      <MDBox mt={1.625}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField
              type={userName.type}
              disabled={readOnlyUserName}
              label={userName.label}
              name={userName.name}
              value={userNameV}
              placeholder={userName.placeholder}
              error={errors.userName && touched.userName}
              success={userNameV.length > 0 && !errors.userName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type={email.type}
              disabled={readOnlyUserName}
              label={email.label}
              name={email.name}
              value={emailV}
              placeholder={email.placeholder}
              error={errors.email && touched.email}
              success={emailV.length > 0 && !errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type={firstName.type}
              label={firstName.label}
              name={firstName.name}
              value={firstNameV}
              placeholder={firstName.placeholder}
              error={errors.firstName && touched.firstName}
              success={firstNameV.length > 0 && !errors.firstName}
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
        </Grid>

        {showPassword && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormField
                type={password.type}
                label={password.label}
                name={password.name}
                value={passwordV}
                placeholder={password.placeholder}
                error={errors.password && touched.password}
                success={passwordV.length > 0 && !errors.password}
                inputProps={{ autoComplete: "", required: false }}
              />
            </Grid>
          </Grid>
        )}
      </MDBox>
      <Grid container spacing={3}>
        {/* Kullanıcı blokeli mi? */}
        <Grid item xs={12} sm={6}>
          <FormCheckbox
            type="checkbox"
            label="Kullanıcı blokeli mi?"
            name="isBlocked"
            value={isBlockedV}
            error={errors.isBlocked && touched.isBlocked}
          />
        </Grid>

        {/* Yetki seviyesi */}
        <Grid item xs={12} sm={6}>
          <FormCheckbox
            type="checkbox"
            label="Sistem Yöneticisi mi?"
            name="isSystemAdmin"
            value={isSystemAdminV}
            error={errors.isSystemAdmin && touched.isSystemAdmin}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormCheckbox
            type="checkbox"
            label="Tatilde mi?"
            name="vacationMode"
            value={vacationModeV}
            error={errors.vacationMode && touched.vacationMode}
          />
        </Grid>
      </Grid>
    </MDBox>
  );
}
export default UserInfo;
