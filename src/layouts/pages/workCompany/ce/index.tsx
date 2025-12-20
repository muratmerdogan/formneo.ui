import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Autocomplete, Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Footer from "examples/Footer";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { useAlert } from "layouts/pages/hooks/useAlert";
import {
  ApproveWorkDesign,
  UserApi,
  UserAppDto,
  WorkCompanyApi,
  WorkCompanyInsertDto,
  WorkCompanyUpdateDto,
  WorkFlowDefinationApi,
  WorkFlowDefinationListDto,
} from "api/generated/api";
import getConfiguration from "confiuration";
import { MessageBoxType } from "@ui5/webcomponents-react";
import { useNavigate, useParams } from "react-router-dom";
import MDAvatar from "components/MDAvatar";
import { useTranslation } from "react-i18next";

interface approveWorkDesign {
  id: ApproveWorkDesign;
  name: string;
  description: string;
}

function WorkCompanyCE() {
  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [companyData, setCompanyData] = useState<WorkCompanyUpdateDto>({
    id: "",
    name: "",
    approveWorkDesign: null,
    userAppId: "",
    workFlowDefinationId: null,
    isActive: null,
  });
  const [status, setStatus] = useState(null);
  const { id } = useParams();

  const [searchByName, setSearchByName] = useState<UserAppDto[]>([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectionPerson, setSelectionPerson] = useState(null);

  const [approveDesign, setApproveDesign] = useState<approveWorkDesign[]>([]);
  const [selectedAprDesign, setSelectedAprDesign] = useState<approveWorkDesign>(null);

  const [workFlows, setWorkFlows] = useState<WorkFlowDefinationListDto[]>([]);
  const [selectedworkFlow, setSelectedWorkFlow] = useState<WorkFlowDefinationListDto>(null);

  useEffect(() => {
    const fetchData = async () => {
      var conf = getConfiguration();
      var api = new WorkCompanyApi(conf);
      const response = await api.apiWorkCompanyIdGet(id);
      setCompanyData(response.data);

      console.log(response.data);

      if (response.data.userApp) {
        setSelectedPerson({
          userAppId: response.data.userAppId,
          userAppName: `${response.data.userApp.firstName} ${response.data.userApp.lastName}`,
        });
      }
      if (response.data.workFlowDefination) {
        setSelectedWorkFlow(response.data.workFlowDefination);
      }
      if (response.data.isActive !== null && response.data.isActive !== undefined) {
  console.log("eşleşti");
  const matchedStatus = statusOptions.find((opt) => opt.value === response.data.isActive);
  setStatus(matchedStatus);
} else {
  console.log("null");
  // null gelirse setStatus çağrılmaz, ya da:
  setStatus(null); // Eğer combobox'ı boş göstermek istiyorsan
}
    };

    if (id) {
      fetchData();
    }

    getAprDesigns();

    getWorkFlows();
  }, [id]);

  useEffect(() => {
    if (approveDesign.length > 0 && companyData) {
      setSelectedAprDesign({
        id: companyData.approveWorkDesign,
        name: approveDesign.find((e) => e.id == companyData.approveWorkDesign)?.name || "",
        description:
          approveDesign.find((e) => e.id == companyData.approveWorkDesign)?.description || "",
      });
    }
  }, [approveDesign, companyData]);

  const getAprDesigns = async () => {
    var conf = getConfiguration();
    var api = new WorkCompanyApi(conf);
    var aprDesigndata = await api.apiWorkCompanyGetApproveWorkDesignGet();
    setApproveDesign(aprDesigndata.data as any);
  };

  const handleSave = async () => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new WorkCompanyApi(conf);

      if (!companyData.name || companyData.name.trim() == "") {
        dispatchAlert({
          message: t("ns1:CompanyPage.CompanyDetail.SirketAdiBos"),
          type: MessageBoxType.Warning,
        });
        return;
      }
      if (companyData.approveWorkDesign == null) {
        dispatchAlert({
          message: t("ns1:CompanyPage.CompanyDetail.OnaySecenegiBos"),
          type: MessageBoxType.Warning,
        });
        return;
      }

      // if (companyData.workFlowDefinationId == null || companyData.workFlowDefinationId == "") {
      //   dispatchAlert({ message: "Onay Akışı Alanı Boş Bırakılamaz..!", type: MessageBoxType.Warning });
      //   return;
      // }

      // if (id != null && (!companyData.userAppId || companyData.userAppId == "")) {
      //   dispatchAlert({ message: "Onaycı Alanı Boş Bırakılamaz..!", type: MessageBoxType.Warning });
      //   return;
      // }
      const sanitizedWorkFlowId =
        companyData.workFlowDefinationId == "" ? null : companyData.workFlowDefinationId;
      console.log("murat", sanitizedWorkFlowId);
      if (id) {
        await api.apiWorkCompanyPut({
          ...companyData,
          workFlowDefinationId: sanitizedWorkFlowId,
        });
      } else {
        await api.apiWorkCompanyPost({
          name: companyData.name,
          approveWorkDesign: companyData.approveWorkDesign,
          userAppId: null,
          workFlowDefinationId: sanitizedWorkFlowId,
          isActive: companyData.isActive,
        });
      }

      dispatchAlert({
        message: t("ns1:CompanyPage.CompanyDetail.SirketBasarili"),
        type: MessageBoxType.Success,
      });
      navigate("/workCompany");
    } catch (error) {
      dispatchAlert({
        message: t("ns1:CompanyPage.CompanyDetail.SirketHata"),
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const parseUserName = (name: string) => {
    if (!name) return { firstName: "", lastName: "" };
    const nameParts = name.split(" ");
    return {
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(" "),
    };
  };

  const handleSearchByName = async (value: string) => {
    if (value === "") {
      setSearchByName([]);
    } else {
      dispatchBusy({ isBusy: true });

      var conf = getConfiguration();
      var api = new UserApi(conf);
      var data = await api.apiUserGetAllUsersAsyncWitNameGet(value);
      var pureData = data.data;
      setSearchByName(pureData);

      dispatchBusy({ isBusy: false });
    }
  };

  const getWorkFlows = async () => {
    var conf = getConfiguration();
    var api = new WorkFlowDefinationApi(conf);
    var res = await api.apiWorkFlowDefinationGet();
    setWorkFlows(res.data);
  };
  const statusOptions = [
    { label: "Aktif", value: true },
    { label: "Pasif", value: false },
  ];
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Card>
        <MDBox p={3}>
          <MDBox p={3}>
            <MDTypography variant="h4" gutterBottom>
              {t("ns1:CompanyPage.CompanyDetail.SirketTanimlama")}
            </MDTypography>
            <MDBox mt={3} sx={{ paddingTop: "2em" }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <MDInput
                    fullWidth
                    label={t("ns1:CompanyPage.CompanyDetail.SirketAdi")}
                    value={companyData.name}
                    onChange={(e: any) => setCompanyData({ ...companyData, name: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={approveDesign}
                    value={selectedAprDesign}
                    getOptionLabel={(option) => option.description}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(event, newValue) => {
                      setSelectedAprDesign(newValue);
                      setCompanyData({
                        ...companyData,
                        approveWorkDesign: newValue ? newValue.id : null,
                      });
                    }}
                    renderInput={(params) => (
                      <MDInput
                        {...params}
                        variant="outlined"
                        label={t("ns1:CompanyPage.CompanyDetail.OnaySecenegi")}
                        inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={workFlows}
                    value={selectedworkFlow}
                    getOptionLabel={(option) => option.workflowName}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(event, newValue) => {
                      setSelectedWorkFlow(newValue);
                      setCompanyData({
                        ...companyData,
                        workFlowDefinationId: newValue ? newValue.id : null,
                      });
                    }}
                    renderInput={(params) => (
                      <MDInput
                        {...params}
                        variant="outlined"
                        label={t("ns1:CompanyPage.CompanyDetail.OnayAkisi")}
                        inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={statusOptions}
                    value={status}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    onChange={(event, newValue) => {
                      setStatus(newValue);
                      setCompanyData({
                        ...companyData,
                        isActive: newValue ? newValue.value : null,
                      });
                    }}
                    renderInput={(params) => (
                      <MDInput
                        {...params}
                        variant="outlined"
                        label="Durum"
                        inputProps={{
                          ...params.inputProps,
                          sx: { height: "12px" },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* {id && (
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      sx={{ mb: 3.2 }}
                      fullWidth
                      options={searchByName}
                      getOptionLabel={(option) => {
                        if (option.firstName && option.lastName) {
                          return `${option.firstName} ${option.lastName}`;
                        }
                        return option.userAppName || "";
                      }}
                      value={selectedPerson}
                      isOptionEqualToValue={(option, value) => {
                        if (!option || !value) return false;
                        return option.id === value.id || option.id === value.userAppId;
                      }}
                      onChange={(event, newValue) => {
                        if (newValue !== null) {
                          if (newValue.userAppName) {
                            const { firstName, lastName } = parseUserName(newValue.userAppName);

                            setSelectionPerson(newValue.userAppName);
                          } else {
                            setSelectionPerson(`${newValue.firstName} ${newValue.lastName}`);
                          }
                        }
                        setSelectedPerson(newValue);
                        setCompanyData({ ...companyData, userAppId: newValue.id })
                      }}
                      onInputChange={(event, newInputValue) => {
                        handleSearchByName(newInputValue);
                      }}
                      renderInput={(params) => (
                        <MDInput
                          {...params}
                          size="large"
                          placeholder="Kullanıcıya Ata"
                          label="Onaycı"
                          inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                        />
                      )}
                      renderOption={(props, option) => {
                        return (
                          <li {...props} key={option.id} style={{ listStyle: "none" }}>
                            {" "}
                            <MDBox
                              onClick={() => setSelectedPerson(option)}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                py: 1,
                                mb: 1,
                                mx: 1,
                                cursor: "pointer",
                              }}
                            >
                              <MDBox mr={2}>
                                <MDAvatar
                                  src={`data:image/png;base64,${option.photo}`}
                                  alt={option.firstName}
                                  shadow="md"
                                />
                              </MDBox>
                              <MDBox
                                display="flex"
                                flexDirection="column"
                                alignItems="flex-start"
                                justifyContent="center"
                              >
                                <MDTypography variant="button" fontWeight="medium">
                                  {option.firstName} {option.lastName}
                                </MDTypography>
                                <MDTypography variant="caption" color="text">
                                  {option.email}
                                </MDTypography>
                              </MDBox>
                            </MDBox>
                          </li>
                        );
                      }}
                    />
                  </Grid>
                )} */}
              </Grid>
            </MDBox>
          </MDBox>
          <MDBox display="flex" justifyContent="flex-end" gap={2} mt={30}>
            <MDButton variant="outlined" color="primary" onClick={() => navigate("/workCompany")}>
              {t("ns1:CompanyPage.CompanyDetail.Iptal")}
            </MDButton>

            <MDButton variant="contained" color="info" onClick={handleSave}>
              {t("ns1:CompanyPage.CompanyDetail.Kaydet")}
            </MDButton>
          </MDBox>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}

export default WorkCompanyCE;
