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
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { TabContainer, Tab } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/key.js";
import "@ui5/webcomponents-icons/dist/employee.js";
import "@ui5/webcomponents-icons/dist/contacts.js";
import "@ui5/webcomponents-icons/dist/task.js";
import "@ui5/webcomponents-icons/dist/shield.js";
import "@ui5/webcomponents-icons/dist/delete.js";
import "@ui5/webcomponents-icons/dist/group.js";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";

// Settings page components
import BaseLayout from "layouts/pages/account/components/BaseLayout";

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
import { CreateUserDto, UpdateUserDto, UserApi, WorkCompanyApi, WorkCompanyDto } from "api/generated";
import UserTenantRoles from "./components/UserTenantRoles";
import UserTenantAdmin from "./components/UserTenantAdmin";
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
  const [activeTab, setActiveTab] = useState<string>("profile");
  const isTenantMode = Boolean(localStorage.getItem("selectedTenantId"));
  const [isGlobalAdmin, setIsGlobalAdmin] = useState<boolean>(localStorage.getItem("isGlobalAdmin") === "true");
  const items = [
    { label: "Profil", icon: "pi pi-user", key: "profile" },
    { label: "Şifre", icon: "pi pi-lock", key: "password" },
    ...(isGlobalAdmin ? [{ label: "Hesaplar", icon: "pi pi-id-card", key: "accounts" }] : []),
    ...(isGlobalAdmin ? [{ label: "Tenantlar", icon: "pi pi-users", key: "userTenants" }] : []),
    ...(isTenantMode ? [{ label: "Ticket Yetkileri", icon: "pi pi-ticket", key: "ticket" }] : []),
    ...(isTenantMode && !isGlobalAdmin ? [{ label: "Tenant Rolleri", icon: "pi pi-users", key: "tenantRoles" }] : []),
    { label: "Hesabı Sil", icon: "pi pi-trash", key: "danger" },
  ];

  // items değiştiğinde activeTab listedeyse koru, değilse ilk elemana al
  useEffect(() => {
    const exists = items.some((i: any) => i.key === activeTab);
    if (!exists && items.length > 0) {
      setActiveTab(items[0].key as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGlobalAdmin, isTenantMode]);

  const activeIndex = Math.max(0, items.findIndex((i: any) => i.key === activeTab));

  const [formGudid, setFormId] = useState("");
  const urlParams = new URLSearchParams(window.location.search);
  const navigate = useNavigate(); // Navig
  const [companies, setCompanies] = useState<WorkCompanyDto[]>([]);

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

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const conf = getConfiguration();
        const api = new WorkCompanyApi(conf);
        const res = await api.apiWorkCompanyGet();
        setCompanies(res.data as any);
      } catch (e) {
        // sessiz geç
      }
    };
    if (isGlobalAdmin) fetchCompanies();
  }, [isGlobalAdmin]);

  // Global admin kontrolü (güvenilir sekme görünürlüğü için)
  useEffect(() => {
    const checkGlobalAdmin = async () => {
      try {
        const conf = getConfiguration();
        const api = new UserApi(conf);
        const me = await api.apiUserGetLoginUserDetailGet();
        const userId = String((me as any)?.data?.id || (me as any)?.data?.userId || "");
        if (!userId) {
          setIsGlobalAdmin(false);
          localStorage.removeItem("isGlobalAdmin");
          return;
        }
        const res = await api.apiUserIsGlobalAdminGet(userId);
        const val = Boolean((res as any)?.data);
        setIsGlobalAdmin(val);
        if (val) localStorage.setItem("isGlobalAdmin", "true"); else localStorage.removeItem("isGlobalAdmin");
      } catch {
        setIsGlobalAdmin(false);
        localStorage.removeItem("isGlobalAdmin");
      }
    };
    checkGlobalAdmin();
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
      roleIds: data.data.roles || [],
      positionId: data.data.positionId || null,
      userLevel: data.data.userLevel || null,
    }));

    isLoading = true;
    dispatchBusy({ isBusy: false });
  };
  return (
    <BaseLayout>
      <DashboardNavbar />

      <MDBox mt={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MDBox mb={3}>
              <Formik
                initialValues={formValues}
                enableReinitialize
                validationSchema={currentValidation}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, isSubmitting }) => (
                  <Form>
                    {/* Üst bilgi (Fotoğraf + İsim) – Tab bar'ın üstünde */}
                    <Grid container spacing={3} sx={{ mb: 1, mt: -3 }}>
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
                    </Grid>

                    {/* Üst aksiyonlar */}
                    <MDBox mb={1} sx={{ position: "sticky", top: 48, zIndex: 5, bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider", backdropFilter: 'blur(6px)', boxShadow: (theme) => `0 2px 8px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,.35)' : 'rgba(0,0,0,.06)'}` }}>
                      <MDBox display="flex" alignItems="center" justifyContent="flex-end" sx={{ gap: 1, flexWrap: "wrap", py: 1 }}>
                        <MDButton variant="outlined" color="secondary" onClick={() => navigate(-1)} startIcon={<Icon>close</Icon>}>
                          İptal
                        </MDButton>
                        <MDButton type="submit" variant="gradient" color="info" startIcon={<Icon>save</Icon>}>
                          {formGudid ? "Kullanıcıyı Güncelle" : "Kullanıcı Oluştur"}
                        </MDButton>
                      </MDBox>
                    </MDBox>

                    {/* UI5 TabContainer */}
                    <TabContainer
                      collapsed={false}
                      onTabSelect={(e: any) => setActiveTab(String(e.detail?.tab?.dataset?.key || items[0]?.key))}
                      style={{ width: '100%' }}
                    >
                      {items.map((it: any) => {
                        const ui5Icon = ({
                          profile: 'sap-icon://employee',
                          password: 'sap-icon://key',
                          accounts: 'sap-icon://contacts',
                          ticket: 'sap-icon://task',
                          userTenants: 'sap-icon://group',
                          tenantRoles: 'sap-icon://shield',
                          danger: 'sap-icon://delete',
                        } as any)[it.key];
                        return (
                          <Tab key={it.key} data-key={it.key} text={it.label} selected={activeTab === it.key} icon={ui5Icon}>
                            {it.key === "profile" && (
                              <MDBox sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, bgcolor: 'background.paper' }}>
                                <Grid container spacing={3}>
                                  <Grid item xs={12}>
                                    <BasicInfo
                                      readOnlyUserName={formGudid!!}
                                      formData={{ values, touched, formField, errors }}
                                    />
                                  </Grid>
                                </Grid>
                              </MDBox>
                            )}

                            {it.key === "password" && (
                              <MDBox sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, bgcolor: 'background.paper' }}>
                                <Grid container spacing={3}>
                                  <Grid item xs={12}>
                                    {formGudid ? (
                                      <ChangePassword formData={{ values, touched, formField, errors }} />
                                    ) : (
                                      <NewPaswword formData={{ values, touched, formField, errors }} />
                                    )}
                                  </Grid>
                                </Grid>
                              </MDBox>
                            )}

                            {it.key === "accounts" && isGlobalAdmin && (
                              <MDBox sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, bgcolor: 'background.paper' }}>
                                <Grid container spacing={3}>
                                  <Grid item xs={12}>
                                    {/* Accounts içeriği burada eklenebilir */}
                                  </Grid>
                                </Grid>
                              </MDBox>
                            )}

                            {it.key === "userTenants" && isGlobalAdmin && (
                              <MDBox sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, bgcolor: 'background.paper' }}>
                                <Grid container spacing={3}>
                                  <Grid item xs={12}>
                                    <UserTenantAdmin userId={formGudid || undefined} />
                                  </Grid>
                                </Grid>
                              </MDBox>
                            )}

                            {it.key === "ticket" && isTenantMode && (
                              <MDBox sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, bgcolor: 'background.paper' }}>
                                <Grid container spacing={3}>
                                  <Grid item xs={12}>
                                    <TicketManagement formData={{ values, touched, formField, errors }} />
                                  </Grid>
                                </Grid>
                              </MDBox>
                            )}

                            {it.key === "tenantRoles" && isTenantMode && !isGlobalAdmin && (
                              <MDBox sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, bgcolor: 'background.paper' }}>
                                <Grid container spacing={3}>
                                  <Grid item xs={12}>
                                    <UserTenantRoles userId={formGudid || undefined} />
                                  </Grid>
                                </Grid>
                              </MDBox>
                            )}

                            {it.key === "danger" && (
                              <MDBox sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, bgcolor: 'background.paper' }}>
                                <Grid container spacing={3}>
                                  <Grid item xs={12}>
                                    <DeleteAccount />
                                  </Grid>
                                </Grid>
                              </MDBox>
                            )}
                          </Tab>
                        );
                      })}
                    </TabContainer>
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
