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

import getConfiguration from "confiuration";
import { MessageBoxType } from "@ui5/webcomponents-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  WorkCompanyApi,
  WorkCompanyDto,
  WorkCompanySystemInfoApi,
  WorkCompanySystemInfoInsertDto,
  WorkCompanySystemInfoListDto,
} from "api/generated";
import "./index.css";
import { useTranslation } from "react-i18next";

function WorkCompanySystemCE() {
  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [companySystemData, setCompanySystemData] = useState<WorkCompanySystemInfoListDto>({
    id: "",
    name: "",
    workCompany: {
      id: "",
      name: "",
    },
    workCompanyId: "",
  });

  const [workCompanyList, setWorkCompanyList] = useState<WorkCompanyDto[]>([]);
  const { id } = useParams();

  const fetchWorkCompanyList = async () => {
    try {
      dispatchBusy({ isBusy: true });
      const conf = getConfiguration();
      const api = new WorkCompanyApi(conf);
      const response = await api.apiWorkCompanyGet();
      setWorkCompanyList(response.data);
    } catch (error) {
      dispatchAlert({
        message: t("ns1:CompanySystemPage.SystemDetail.SirketListesiHata"),
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const fetchWorkCompanySystemInfo = async () => {
    try {
      dispatchBusy({ isBusy: true });
      const conf = getConfiguration();
      const api = new WorkCompanySystemInfoApi(conf);
      const response = await api.apiWorkCompanySystemInfoBySystemIdIdGet(id);
      setCompanySystemData({
        id: response.data.id,
        workCompanyId: response.data.workCompanyId,
        name: response.data.name,
        workCompany: {
          id: response.data.workCompany.id,
          name: response.data.workCompany.name,
        },
      });
    } catch (error) {
      dispatchAlert({
        message: t("ns1:CompanySystemPage.SystemDetail.SirketSistemBilgisiHata"),
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  useEffect(() => {
    const loadWorkCompanyList = async () => {
      await fetchWorkCompanyList();
    };

    loadWorkCompanyList();
  }, []);

  useEffect(() => {
    if (!id) return;

    const loadSystemInfo = async () => {
      await fetchWorkCompanySystemInfo();
    };

    loadSystemInfo();
  }, [id]);

  const handleSave = async () => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new WorkCompanySystemInfoApi(conf);
      if (companySystemData.workCompany.id == null || companySystemData.workCompany.id == "") {
        dispatchAlert({
          message: t("ns1:CompanySystemPage.SystemDetail.SirketSecilmedi"),
          type: MessageBoxType.Warning,
        });
        dispatchBusy({ isBusy: false });
        return;
      }
      if (companySystemData.name == null || companySystemData.name == "") {
        dispatchAlert({
          message: t("ns1:CompanySystemPage.SystemDetail.SistemAdiGirilmedi"),
          type: MessageBoxType.Warning,
        });
        dispatchBusy({ isBusy: false });
        return;
      }
      if (id) {
        await api.apiWorkCompanySystemInfoPut({
          id: companySystemData.id,
          name: companySystemData.name,
          workCompanyId: companySystemData.workCompany.id,
        });
      } else {
        await api.apiWorkCompanySystemInfoPost({
          name: companySystemData.name,
          workCompanyId: companySystemData.workCompany.id,
        });
      }
      dispatchAlert({
        message: t("ns1:CompanySystemPage.SystemDetail.SistemKaydedildi"),
        type: MessageBoxType.Success,
      });
      navigate("/workCompanySystem");
    } catch (error) {
      dispatchAlert({
        message: t("ns1:CompanySystemPage.SystemDetail.SistemKaydedilirkenHata"),
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Card>
        <MDBox p={3}>
          <MDBox p={3}>
            <MDTypography variant="h4" gutterBottom>
              {t("ns1:CompanySystemPage.SystemDetail.SistemTanimlama")}
            </MDTypography>
            <MDBox mt={3} sx={{ paddingTop: "2em" }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6}>
                  <MDInput
                    fullWidth
                    label={t("ns1:CompanySystemPage.SystemDetail.SistemAdi")}
                    value={companySystemData.name}
                    onChange={(e: any) =>
                      setCompanySystemData({ ...companySystemData, name: e.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                  <Autocomplete
                    id="workCompanyIdBox"
                    fullWidth
                    value={companySystemData.workCompany.id ? companySystemData.workCompany : null}
                    options={workCompanyList}
                    getOptionLabel={(option) => option?.name || ""}
                    isOptionEqualToValue={(option, value) => {
                      if (!option || !value) return true;
                      return option.id === value.id;
                    }}
                    renderInput={(params) => (
                      <MDInput
                        {...params}
                        label={t("ns1:CompanySystemPage.SystemDetail.SirketAdi")}
                        inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                      />
                    )}
                    onChange={(e: any, value: WorkCompanyDto | null) => {
                      setCompanySystemData({
                        ...companySystemData,
                        workCompany: value
                          ? { id: value.id, name: value.name }
                          : { id: "", name: "" },
                      });
                    }}
                  />
                </Grid>
              </Grid>
            </MDBox>
          </MDBox>
          <MDBox display="flex" justifyContent="flex-end" gap={2} mt={30}>
            <MDButton
              variant="outlined"
              color="primary"
              onClick={() => navigate("/workCompanySystem")}
            >
              {t("ns1:CompanySystemPage.SystemDetail.Iptal")}
            </MDButton>

            <MDButton variant="contained" color="info" onClick={handleSave}>
              {t("ns1:CompanySystemPage.SystemDetail.Kaydet")}
            </MDButton>
          </MDBox>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}

export default WorkCompanySystemCE;
