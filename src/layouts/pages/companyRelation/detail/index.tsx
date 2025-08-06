import { Autocomplete, Card, Grid, Icon } from "@mui/material";
import { MessageBoxType } from "@ui5/webcomponents-react";
import {
  WorkCompanyApi,
  WorkCompanyDto,
  WorkCompanyTicketMatrisApi,
  WorkCompanyTicketMatrisInsertDto,
  WorkCompanyTicketMatrisUpdateDto,
} from "api/generated/api";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import getConfiguration from "confiuration";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { PickList } from "primereact/picklist";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function CompanyRelationDetail() {
  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);
  const [companyName, setCompanyName] = useState<WorkCompanyDto | null>(null);
  const [companyNameOptions, setCompanyNameOptions] = useState<WorkCompanyDto[]>([]);
  const [companyNameError, setCompanyNameError] = useState(false);
  const [targetError, setTargetError] = useState(false);
  const dispatchAlert = useAlert();
  const dispatchBusy = useBusy();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchRelationData();
    }
  }, [id]);

  const fetchRelationData = async () => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new WorkCompanyTicketMatrisApi(conf);
      var response = await api.apiWorkCompanyTicketMatrisIdGet(id);
      setCompanyName(response.data.fromCompany);
      setTarget(response.data.toCompanies);
    } catch (error) {
      dispatchAlert({
        message: "Hata Oluştu",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const fetchData = async () => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new WorkCompanyApi(conf);
      var response = await api.apiWorkCompanyGet();
      var data = response.data;
      setSource(data);
      setCompanyNameOptions(data);
    } catch (error) {
      dispatchAlert({
        message: "Hata Oluştu",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onChange = (event: any) => {
    setSource(event.source);
    setTarget(event.target);
  };

  const itemTemplate = (item: WorkCompanyDto) => {
    return (
      <div className="flex align-items-center p-3 w-full">
        <div className="flex flex-column">
          <Grid container>
            <Grid item xs={12} lg={0.7}>
              <i
                className="pi pi-building"
                style={{ marginTop: "0.3rem", marginRight: "0.5rem", fontSize: "1.5rem" }}
              ></i>
            </Grid>

            <Grid container lg={11.3}>
              <Grid item xs={12}>
                <span className="font-bold text-lg">{item.name}</span>

                {/* <div className="flex align-items-center gap-2">
                  <MDTypography variant="subtitle2" color="text" className="text-sm">
                    {item.}
                  </MDTypography>
                </div> */}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  };

  const handleSave = async () => {
    let hasError = false;
    if (!companyName) {
      setCompanyNameError(true);
      hasError = true;
    }
    if (hasError) return;

    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new WorkCompanyTicketMatrisApi(conf);

      const dto: WorkCompanyTicketMatrisInsertDto = {
        fromCompanyId: companyName.id,
        toCompaniesIds: target.map((item: WorkCompanyDto) => item.id),
      };

      await api.apiWorkCompanyTicketMatrisPost(dto);
      console.log(dto);
      navigate("/companyRelation");
      dispatchAlert({
        message: "Şirket ilişkisi eklendi.",
        type: MessageBoxType.Success,
      });
    } catch (error) {
      dispatchAlert({
        message: "Hata Oluştu",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const handleUpdate = async () => {
    let hasError = false;
    if (!companyName) {
      setCompanyNameError(true);
      hasError = true;
    }
    if (hasError) return;

    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new WorkCompanyTicketMatrisApi(conf);

      const dto: WorkCompanyTicketMatrisUpdateDto = {
        fromCompanyId: companyName.id,
        toCompaniesIds: target.map((item: WorkCompanyDto) => item.id),
      };

      await api.apiWorkCompanyTicketMatrisPut(dto);
      console.log(dto);
      navigate("/companyRelation");

      dispatchAlert({
        message: "Şirket ilişkisi düzenlendi.",
        type: MessageBoxType.Success,
      });
    } catch (error) {
      console.log(error);
      dispatchAlert({
        message: "Hata Oluştu",
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
              Şirket İlişkisi Tanımlama
            </MDTypography>
          </MDBox>
          <Grid container>
            <Grid item xs={12} lg={6}>
              <MDBox mt={3} p={3} mb={-3}>
                <Autocomplete
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "#cbd5e1",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                      },
                      "&.Mui-focused": {
                        borderColor: "#3b82f6",
                        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                      },
                    },
                  }}
                  options={companyNameOptions}
                  getOptionLabel={(option) => option?.name || ""}
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  value={companyName || null}
                  onChange={(event, value) => {
                    setCompanyName(value);
                    setCompanyNameError(false);
                  }}
                  disabled={!!id}
                  renderInput={(params) => (
                    <MDInput
                      {...params}
                      placeholder="Şirket Seçiniz"
                      fullWidth
                      error={companyNameError}
                      inputProps={{
                        ...params.inputProps,
                        sx: { height: "12px" },
                        startAdornment: <Icon sx={{ mr: 1 }}>business</Icon>,
                      }}
                    />
                  )}
                />
                {companyNameError && (
                  <MDTypography variant="caption" color="error" style={{ marginLeft: "8px" }}>
                    {"Şirket Seçiniz"}
                  </MDTypography>
                )}
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        <div className="surface-card shadow-2 border-round p-4 m-4">
          <PickList
            dataKey=""
            source={source}
            target={target}
            onChange={(event) => {
              onChange(event);
              setTargetError(false);
            }}
            itemTemplate={itemTemplate}
            sourceItemTemplate={itemTemplate}
            targetItemTemplate={itemTemplate}
            filter
            filterBy="name,menuCode"
            breakpoint="1280px"
            sourceHeader={
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MDTypography style={{ color: "#757ce8" }}>{"Tüm Şirketler"}</MDTypography>
              </div>
            }
            targetHeader={
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MDTypography style={{ color: "#757ce8" }}>{"Atanan Şirketler"}</MDTypography>
                {targetError && (
                  <MDTypography variant="subtitle2" color="error" style={{ marginLeft: "8px" }}>
                    {"Şirket Atanmali Error"}
                  </MDTypography>
                )}
              </div>
            }
            sourceStyle={{
              height: "24rem",
              width: "100%",
            }}
            targetStyle={{
              height: "24rem",
              width: "100%",
            }}
            sourceFilterPlaceholder={"Şirket Ara"}
            targetFilterPlaceholder={"Şirket Ara"}
            showSourceControls={false}
            showTargetControls={false}
            className="picklist-custom"
          />
        </div>
        <MDBox p={3}>
          <MDBox p={2}>
            <MDBox display="flex" justifyContent="flex-end">
              <MDBox mr={2}>
                <MDButton
                  onClick={() => navigate("/companyRelation")}
                  variant="outlined"
                  color="error"
                >
                  İptal
                </MDButton>
              </MDBox>
              <MDButton onClick={id ? handleUpdate : handleSave} variant="gradient" color="info">
                Kaydet
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}

export default CompanyRelationDetail;
