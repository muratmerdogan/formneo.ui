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

import { useEffect, useState } from "react";

// formik components
import { Formik, Form } from "formik";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// NewUser page components
import UserInfo from "layouts/pages/users/new-user/components/UserInfo";
import Address from "layouts/pages/users/new-user/components/Address";
import Socials from "layouts/pages/users/new-user/components/Socials";
import Profile from "layouts/pages/users/new-user/components/Profile";

// NewUser layout schemas for form and form feilds
import validations from "layouts/pages/users/new-user/schemas/validations";
import form from "layouts/pages/users/new-user/schemas/form";
import initialValues from "layouts/pages/users/new-user/schemas/initialValues";
import getConfiguration from "confiuration";
import { CreateUserDto, UpdateUserDto, UserApi } from "api/generated";
import { dA } from "@fullcalendar/core/internal-common";
import { useNavigate, useOutlet } from "react-router-dom";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { AxiosError } from "axios";
import { useAlert } from "layouts/pages/hooks/useAlert";

import { MessageBox, MessageBoxPropTypes, MessageBoxType } from '@ui5/webcomponents-react';
import Organization from "./components/Organization";

function getSteps(): string[] {
  return ["User Info", "Organizasyon", "Teknik CV"];
}
function getStepContent(stepIndex: number, formData: any, id: any): JSX.Element {
  switch (stepIndex) {
    case 0:

      return <UserInfo readOnlyUserName={id!!} showPassword={true} formData={formData} />;
    case 1:
      return <Organization formData={formData} />;

    case 2:
      return <Socials formData={formData} />;
    default:
      return null;
  }
}

function NewUser(): JSX.Element {
  const dispatchBusy = useBusy()
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const { formId, formField } = form;
  const currentValidation = validations[activeStep];
  const isLastStep = activeStep === steps.length - 1;
  const [formValues, setFormValues] = useState(initialValues);
  const [formGudid, setFormId] = useState("");
  const urlParams = new URLSearchParams(window.location.search);
  const navigate = useNavigate(); // Navig
  const dispatchAlert = useAlert()
  // Setting the dir attribute for the body element
  useEffect(() => {
    const id = urlParams.get('id'); // id parametresini alıyoruz

    if (id) {
      fetchDetail(id);
    }

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
      isSystemAdmin: data.data.isSystemAdmin || false,
      vacationMode: data.data.vacationMode || false,
      profileInfo: data.data.profileInfo || "",

    }));



    isLoading = true;
    dispatchBusy({ isBusy: false });
  };

  const sleep = (ms: any) =>
    new Promise((resolve) => {

      setTimeout(resolve, ms);
    });
  const handleBack = () => setActiveStep(activeStep - 1);

  const submitForm = async (values: any, actions: any) => {


    await sleep(1000);

    const id = urlParams.get('id'); // id parametresini alıyoruz
    if (formGudid) {
      var update = values as UpdateUserDto;

      var conf = getConfiguration();
      var api = new UserApi(conf);
      update.id = formGudid;
      update.canSsoLogin = false;



      if (update.isBlocked == null) {


        update.isBlocked = false;
      }
      if (update.isSystemAdmin == null) {
        update.isSystemAdmin = false;
      }
      if (update.vacationMode == null) {
        update.vacationMode = false;
      }

      try {
        var data = await api.apiUserPut(update);
        console.log("Başarılı:", data);
      } catch (error: any) {
        dispatchAlert({ message: error.response.data.errors[0], type: MessageBoxType.Error })
        actions.setSubmitting(false);
        return;

      }
      navigate("/users");
    }
    else {
      var create = values as CreateUserDto;
      var conf = getConfiguration();
      var api = new UserApi(conf);

      create.canSsoLogin = false;


      create.lastLoginIp = "";


      try {
        var data = await api.apiUserPost(false, create);
        console.log("Başarılı:", data);
      } catch (error: any) {
        dispatchAlert({ message: error.response.data.errors[0], type: MessageBoxType.Error })
        actions.setSubmitting(false);
        return;

      }
      navigate("/users");

    }
    // eslint-disable-next-line no-alert
    actions.setSubmitting(false);
    actions.resetForm();
    setActiveStep(0);
  };

  const handleSubmit = (values: any, actions: any) => {
    if (isLastStep) {
      submitForm(values, actions);
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3} mb={20}>

        <Grid item style={{ marginTop: "10px" }} xs={12} lg={8}>
          <Formik
            initialValues={formValues}
            enableReinitialize
            validationSchema={currentValidation}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isSubmitting }) => (
              <Form id={formId} autoComplete="off">
                <Card sx={{ height: "100%" }}>
                  <MDBox mx={2} mt={-3}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                      {steps.map((label) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </MDBox>
                  <MDBox p={3}>
                    <MDBox>
                      {getStepContent(activeStep, {
                        values,
                        touched,
                        formField,
                        errors,
                      }, formGudid)}
                      <MDBox mt={2} width="100%" display="flex" justifyContent="space-between">
                        {activeStep === 0 ? (
                          <MDBox />
                        ) : (
                          <MDButton variant="gradient" color="light" onClick={handleBack}>
                            back
                          </MDButton>
                        )}
                        <MDButton
                          disabled={isSubmitting}
                          type="submit"
                          variant="gradient"
                          color="dark"
                        >
                          {isLastStep ? "send" : "next"}
                        </MDButton>
                      </MDBox>
                    </MDBox>
                  </MDBox>
                </Card>
              </Form>
            )}
          </Formik>

        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default NewUser;
