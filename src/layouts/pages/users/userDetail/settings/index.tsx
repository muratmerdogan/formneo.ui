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

// Settings page components
import BaseLayout from "layouts/pages/account/components/BaseLayout";
import Sidenav from "layouts/pages/account/settings/components/Sidenav";

import BasicInfo from "./components/BasicInfo";
import ChangePassword from "./components/ChangePassword";
import Authentication from "./components/Authentication";
import Accounts from "./components/Accounts";
import Notifications from "./components/Notifications";
import Sessions from "./components/Sessions";
import DeleteAccount from "./components/DeleteAccount";
import initialValues from "layouts/pages/users/new-user/schemas/initialValues";
import { Formik, Form } from "formik";
import { useEffect, useState } from "react";

import form from "layouts/pages/users/new-user/schemas/form";
import Header from "./components/Header";
import getConfiguration from "confiuration";
import { CreateUserDto, UpdateUserDto, UserApi } from "api/generated";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { useNavigate } from "react-router-dom";
import { MessageBoxType } from "@ui5/webcomponents-react";
import { useAlert } from "layouts/pages/hooks/useAlert";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import NewPaswword from "./components/ChangePassword/newpassord";

import validations from "layouts/pages/users/new-user/schemas/validations";
import RequestManagement from "./components/TicketManagement";
import TicketManagement from "./components/TicketManagement";

function Settings(): JSX.Element {
  const currentValidation = validations[0];
  const dispatchAlert = useAlert();
  const [formValues, setFormValues] = useState(initialValues);
  const { formId, formField } = form;

  const handleSubmit = async (values: any, actions: any) => {
    console.log("isMailSender Geliyor mu", values.isMailSender);
    const id = urlParams.get("id"); // id parametresini alıyoruz
    if (formGudid) {
      dispatchBusy({ isBusy: true });
      var update = values as UpdateUserDto;
      var conf = getConfiguration();
      var api = new UserApi(conf);

      update.id = formGudid;

      if (update.isBlocked == null) {
        update.isBlocked = false;
      }
      if (update.isTestData == null) {
        update.isTestData = false;
      }
      if (update.isSystemAdmin == null) {
        update.isSystemAdmin = false;
      }
      if (update.vacationMode == null) {
        update.vacationMode = false;
      }
      if (update.workCompanyId == null) {
        dispatchAlert({ message: "Şirket Alanı Boş Bırakılamaz", type: MessageBoxType.Error });
        dispatchBusy({ isBusy: false });
        return;
      }
      if (update.ticketDepartmentId == null) {
        dispatchAlert({ message: "Departman Alanı Boş Bırakılamaz", type: MessageBoxType.Error });
        dispatchBusy({ isBusy: false });
        return;
      }

      if (update.roleIds.length == 0) {
        dispatchAlert({ message: "Rol Alanı Boş Bırakılamaz", type: MessageBoxType.Error });
        dispatchBusy({ isBusy: false });
        return;
      }

      if (update.userLevel == null || update.userLevel == undefined) {
        dispatchAlert({ message: "Seviye Alanı Boş Bırakılamaz", type: MessageBoxType.Error });
        dispatchBusy({ isBusy: false });
        return;
      }

      try {
        console.log(update);

        var data = await api.apiUserPut(update);
        console.log("Başarılı:", data);
      } catch (error: any) {
        dispatchBusy({ isBusy: false });
        dispatchAlert({ message: error.response.data.errors[0], type: MessageBoxType.Error });
        actions.setSubmitting(false);
        return;
      }
      dispatchBusy({ isBusy: false });
      navigate("/users");
    } else {
      dispatchBusy({ isBusy: true });
      var create = values as CreateUserDto;
      var conf = getConfiguration();
      var api = new UserApi(conf);
      create.lastLoginIp = "";

      try {
        var data = await api.apiUserPost(values.isMailSender, create);
        console.log("Başarılı:", data);
      } catch (error: any) {
        dispatchBusy({ isBusy: false });
        dispatchAlert({ message: error.response.data.errors[0], type: MessageBoxType.Error });
        actions.setSubmitting(false);
        return;
      }
      dispatchBusy({ isBusy: false });
      navigate("/users");
    }
    // eslint-disable-next-line no-alert
    actions.setSubmitting(false);
    actions.resetForm();
  };

  const dispatchBusy = useBusy();
  const [activeStep, setActiveStep] = useState(0);

  const [formGudid, setFormId] = useState("");
  const urlParams = new URLSearchParams(window.location.search);
  const navigate = useNavigate(); // Navig

  useEffect(() => {
    const id = urlParams.get("id"); // id parametresini alıyoruz
    // const id = urlParams.get('id'); // id parametresini alıyoruz

    if (id) {
      fetchDetail(id);
    }

    // if (id) {
    //   fetchDetail(id);
    // }
  }, []);

  const fetchDetail = async (id: any) => {
    dispatchBusy({ isBusy: true });
    let isLoading: boolean;
    isLoading = false;
    var conf = getConfiguration();
    var api = new UserApi(conf);
    var data = await api.apiUserGet(id);
    var resultData = data.data;
    setFormId(resultData.id);
    console.log(data.data);
    setFormValues((prevValues) => ({
      ...prevValues,

      manager1: data.data.manager1 || "",
      manager2: data.data.manager2 || "",
      userName: data.data.userName || "",
      firstName: data.data.firstName || "", // Sadece firstName'i günceller
      lastName: data.data.lastName || "", // Sadece firstName'i günceller
      department: data.data.departmentId || "", // Sadece firstName'i günceller
      title: data.data.title || "", // Sadece firstName'i günceller
      email: data.data.email || "", // Sadece firstName'i günceller
      linkedinUrl: data.data.linkedinUrl || "",
      isBlocked: data.data.isBlocked || false,
      isTestData: data.data.isTestData || false,
      isSystemAdmin: data.data.isSystemAdmin || false,
      canSsoLogin: data.data.canSsoLogin || false,
      vacationMode: data.data.vacationMode || false,
      profileInfo: data.data.profileInfo || "",
      photo: data.data.photo || "",
      sapDepartmentText: data.data.sapDepartmentText || "",
      sapPositionText: data.data.sapPositionText || "",
      // authorizationTicketLevel: data.data.authorizationTicketLevel || "",
      ticketDepartmentId: data.data.ticketDepartmentId || "",
      roleIds: data.data.roles || [],
      workCompanyId: data.data.workCompanyId || "",
      hasTicketPermission: data.data.hasTicketPermission || false,
      hasDepartmentPermission: data.data.hasDepartmentPermission || false,
      hasOtherCompanyPermission: data.data.hasOtherCompanyPermission || false,
      hasOtherDeptCalendarPerm: data.data.hasOtherDeptCalendarPerm || false,
      canEditTicket: data.data.canEditTicket || false,
      dontApplyDefaultFilters: data.data.dontApplyDefaultFilters || false,
      positionId: data.data.positionId || null,
      userLevel: data.data.userLevel || null,
      mainManagerUserAppId: data.data.mainManagerUserAppId || null,
      pCname: data.data.pCname || "",
    }));

    isLoading = true;
    dispatchBusy({ isBusy: false });
  };
  return (
    <BaseLayout>
      <DashboardNavbar />

      <MDBox mt={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3}>
            <Sidenav />
          </Grid>
          <Grid item xs={12} lg={9}>
            <MDBox mb={3}>
              <Formik
                initialValues={formValues}
                enableReinitialize
                validationSchema={currentValidation}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, isSubmitting }) => (
                  <Form>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <DeleteAccount />
                      </Grid>
                      <Grid item xs={12}>
                        <Header
                          formData={{
                            values,
                            touched,
                            formField,
                            errors,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <BasicInfo
                          readOnlyUserName={formGudid!!}
                          formData={{
                            values,
                            touched,
                            formField,
                            errors,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        {formGudid ? (
                          <ChangePassword
                            formData={{
                              values,
                              touched,
                              formField,
                              errors,
                            }}
                          />
                        ) : (
                          <NewPaswword
                            formData={{
                              values,
                              touched,
                              formField,
                              errors,
                            }}
                          />
                        )}
                      </Grid>
                      {/* <Grid item xs={12}>
                        <Authentication />
                      </Grid> */}
                      <Grid item xs={12}>
                        <Accounts
                          formData={{
                            values,
                            touched,
                            formField,
                            errors,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TicketManagement
                          formData={{
                            values,
                            touched,
                            formField,
                            errors,
                          }}
                        />
                      </Grid>
                      {/* <Grid item xs={12}>
                        <Notifications />
                      </Grid> */}
                      {/* <Grid item xs={12}>
                        <Sessions />
                      </Grid> */}
                    </Grid>
                  </Form>
                )}
              </Formik>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </BaseLayout>
  );
}

export default Settings;
