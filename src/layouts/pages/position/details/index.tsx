import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { Card, Grid, FormControl, FormControlLabel, Checkbox, Autocomplete } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import Footer from "examples/Footer";
import { useNavigate, useParams } from "react-router-dom";
import getConfiguration from "confiuration";
import { clientData } from "layouts/pages/calendar/controller";
import { PositionListDto, WorkCompanyDto } from "api/generated/api";
import { PositionsApi } from "api/generated";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { MessageBoxType } from "@ui5/webcomponents-react";
interface FormData {
  positionName: string;
  company: WorkCompanyDto | null;
  description: string;
  id?: string;
}

function PositionDetailPage() {
  const navigate = useNavigate();
  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const { id } = useParams();
  const [formData, setFormData] = useState<PositionListDto>({
    name: "",
    customerRefId: "",
    customerName: "",
    description: "",
    id: "",
  });

  const [selectedCompany, setSelectedCompany] = useState<WorkCompanyDto | null>(null);
  const [companyOptions, setCompanyOptions] = useState<WorkCompanyDto[]>([]);
  const [isCompanyDataLoaded, setIsCompanyDataLoaded] = useState(false);

  useEffect(() => {
    const fetchCompanyOptions = async () => {
      try {
        dispatchBusy({ isBusy: true });
        var data = await clientData();
        setCompanyOptions(data);
        setIsCompanyDataLoaded(true);
      } catch (error) {
        dispatchAlert({
          message: "Şirket bilgileri alınamadı",
          type: MessageBoxType.Error,
        });
      }
    };
    fetchCompanyOptions();
  }, []);

  let idCount = useRef(0);
  useEffect(() => {
    if (!isCompanyDataLoaded) return;

    const fetchData = async () => {
      if (!id) {
        dispatchBusy({ isBusy: false });
        return;
      }

      try {
        dispatchBusy({ isBusy: true });
        let conf = getConfiguration();
        let api = new PositionsApi(conf);
        let response = await api.apiPositionsIdGet(id);
        console.log(response.data);
        setFormData((prev) => ({
          ...prev,
          name: response.data.name,
          customerRefId: response.data.customerRefId,
          customerName: response.data.customerName,
          description: response.data.description,
          id: id,
        }));

        // Find the company in options and set it if available
        if (response.data.customerRefId) {
          const company = companyOptions.find((c) => c.id === response.data.customerRefId);
          if (company) {
            setSelectedCompany(company);
          }
        }

        idCount.current++;
      } catch (error) {
        dispatchAlert({
          message: "Pozisyon bilgileri alınamadı",
          type: MessageBoxType.Error,
        });
      } finally {
        dispatchBusy({ isBusy: false });
      }
    };
    fetchData();
  }, [id, isCompanyDataLoaded]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      dispatchBusy({ isBusy: true });
      let conf = getConfiguration();
      let api = new PositionsApi(conf);

      // validation
      if (formData.customerName === "") {
        dispatchAlert({
          message: "Şirket Alanı Boş Bırakılamaz",
          type: MessageBoxType.Error,
        });
        dispatchBusy({ isBusy: false });
        return;
      } else if (formData.name === "") {
        dispatchAlert({
          message: "Pozisyon Adı Alanı Boş Bırakılamaz",
          type: MessageBoxType.Error,
        });
        dispatchBusy({ isBusy: false });
        return;
      } else if (formData.description === "") {
        dispatchAlert({
          message: "Açıklama Alanı Boş Bırakılamaz",
          type: MessageBoxType.Error,
        });
        dispatchBusy({ isBusy: false });
        return;
      }

      // submit
      try {
        if (formData.id) {
          await api.apiPositionsPut(formData);
          dispatchAlert({
            message: "Pozisyon bilgileri başarıyla güncellendi",
            type: MessageBoxType.Success,
          });
        } else {
          await api.apiPositionsPost({
            name: formData.name,
            customerRefId: formData.customerRefId,
            description: formData.description,
          });
          dispatchAlert({
            message: "Pozisyon bilgileri başarıyla oluşturuldu",
            type: MessageBoxType.Success,
          });
        }

        dispatchBusy({ isBusy: false });

        navigate("/position", { replace: true });

        return;
      } catch (innerError) {
        dispatchAlert({
          message: "Pozisyon bilgileri güncellenemedi",
          type: MessageBoxType.Error,
        });
      }
    } catch (error) {
      dispatchAlert({
        message: "Pozisyon bilgileri güncellenemedi",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Grid
        container
        style={{
          height: "100%",
          marginTop: "-15px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.1)",
        }}
      >
        <Grid item xs={12} lg={12}>
          <Card>
            <MDBox p={3}>
              <MDBox p={2}>
                <MDTypography variant="h4" gutterBottom>
                  {id ? "Pozisyon Güncelle" : "Pozisyon Oluştur"}
                </MDTypography>
              </MDBox>
              <MDBox mt={2} p={3}>
                <Grid container spacing={3}>
                  {/* Left Column */}
                  <Grid item xs={12} sm={6} lg={6}>
                    <Autocomplete
                      renderInput={(params) => (
                        <MDInput
                          {...params}
                          type="text"
                          label="Şirket"
                          placeholder="İsim aratınız..."
                          fullWidth
                          inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                        />
                      )}
                      value={selectedCompany}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      options={companyOptions}
                      size="medium"
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
                      onChange={(event, newValue) => {
                        setSelectedCompany(newValue);
                        setFormData((prev) => ({
                          ...prev,
                          customerName: newValue?.name || "",
                          customerRefId: newValue?.id || "",
                        }));
                      }}
                    />
                  </Grid>

                  {/* Right Column */}
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDInput
                      fullWidth
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
                      label="Pozisyon Adı"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} lg={12}>
                    <MDBox mt={4}>
                      <MDInput
                        fullWidth
                        label="Açıklama"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={5}
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
                      />
                    </MDBox>
                  </Grid>
                </Grid>
              </MDBox>
            </MDBox>

            <MDBox p={3} display="flex" justifyContent="flex-end" mt={36} width="100%">
              <MDButton
                sx={{ mr: 3 }}
                variant="outlined"
                color="primary"
                onClick={() => navigate("/position")}
              >
                İptal
              </MDButton>
              <MDButton variant="contained" color="info" type="submit" onClick={handleSubmit}>
                Kaydet
              </MDButton>
            </MDBox>
          </Card>
        </Grid>
      </Grid>
      <MDBox mt={1} />
      <Footer />
    </DashboardLayout>
  );
}

export default PositionDetailPage;
