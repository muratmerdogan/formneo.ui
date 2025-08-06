import { Autocomplete, Grid, Checkbox, FormControlLabel, Dialog, DialogContentText, DialogContent, DialogTitle, DialogActions, Icon } from "@mui/material";
import {
  TicketDepartmentsApi,
  UserApi,
  UserAppDto,
  WorkCompanyApi,
  WorkCompanyDto,
  TicketProjectsApi,
  TicketProjectsListDto,
  ProjectCategoriesListDto,
  ProjectCategoriesApi,
} from "api/generated";
import MDAvatar from "components/MDAvatar";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import getConfiguration from "confiuration";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useBusy } from "layouts/pages/hooks/useBusy";
import React, { useEffect, useState } from "react";
import { Card } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { MessageBoxType } from "@ui5/webcomponents-react";
import { useTranslation } from "react-i18next";
import FormGroup from "@mui/material/FormGroup";

function CreateTicketProject() {
  const [activeOptions, setActiveOptions] = useState(["Pasif", "Aktif"]);
  const [companies, setCompanies] = useState<WorkCompanyDto[]>([]);
  const [projects, setProjects] = useState<TicketProjectsListDto[]>([]);
  const [categories, setCategories] = useState<ProjectCategoriesListDto[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserAppDto[]>([]);
  const [selectionUserIds, setSelectionUserIds] = useState<string[]>([]);
  const [selectedKullanici, setSelectedKullanici] = useState<UserAppDto>();
  const [selectionKullaniciId, setSelectionKullaniciId] = useState<string>();
  const [namesOfSelected, setNamesOfSelected] = useState<string>();
  const [copyFromAnotherProject, setCopyFromAnotherProject] = useState(null);
  const [copyTaskUser, setCopyTaskUser] = useState(null);
  const [openNavigateDialog, setOpenNavigateDialog] = useState(false);

  const [projectData, setProjectData] = useState<TicketProjectsListDto>({
    name: "",
    description: null,
    isActive: true,
    workCompany: null,
    workCompanyId: null,
    manager: null,
    managerId: null,
    userIds: null,
    projectCategory: null,
    projectCategoryId: null,
    risks: null,
    reportsUrl: null,
    subProjectName: null,
    copiedProjectId: null,
    isUserCopied: null,
  });

  const [searchByName, setSearchByName] = useState<UserAppDto[]>([]);
  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const updateDto = {
    ...projectData,
    id: id,
  };

  const handleOpenNavigateDialog = () => {
    setOpenNavigateDialog(true);
  };
  const handleCloseNavigateDialog = () => {
    setOpenNavigateDialog(false);
  };

  const handleSearchByName = async (value: string) => {
    if (value === "") {
      setSearchByName([]);
    } else {
      try {
        dispatchBusy({ isBusy: true });

        var conf = getConfiguration();
        var api = new UserApi(conf);
        var data = await api.apiUserGetAllUsersAsyncWitNameGet(value);
        var pureData = data.data;
        setSearchByName(pureData);

        dispatchBusy({ isBusy: false });
      } catch (error) {
        console.log("error", error);
      } finally {
        dispatchBusy({ isBusy: false });
      }
    }
  };
  const fetchProjectData = async () => {
    try {
      dispatchBusy({ isBusy: true });

      //Proje bilgilerini getir
      var conf = getConfiguration();
      var api = new TicketProjectsApi(conf);
      var data = await api.apiTicketProjectsIdGet(id);
      setProjectData(data.data as any);

      setSelectedKullanici(data.data.manager);
      setSelectionKullaniciId(data.data.managerId);

      setSelectedUsers(data.data.users);
      setSelectionUserIds(data.data.users.map((user: any) => user.id));

      console.log("proje", data.data);
    } catch (error) {
      dispatchAlert({
        message: "Proje bilgileri getirilirken hata oluştu.",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const fetchCompanyData = async () => {
    try {
      dispatchBusy({ isBusy: true });
      //Tüm şirketler
      var conf = getConfiguration();
      var api = new WorkCompanyApi(conf);
      var data = await api.apiWorkCompanyGetAssingListGet();
      setCompanies(data.data as any);
    } catch (error) {
      dispatchAlert({
        message: "Veriler getirilirken hata oluştu.",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };
  const fetchCategoryData = async () => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new ProjectCategoriesApi(conf);
      var data = await api.apiProjectCategoriesGet();
      setCategories(data.data as any);
    } catch (error) {
      dispatchAlert({
        message: "Kategori verileri getirilirken hata oluştu.",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };
  const fetchProjectsData = async () => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new TicketProjectsApi(conf);
      var data = await api.apiTicketProjectsGetActiveProjectsOnlyNameGet();
      setProjects(data.data as any);
    } catch (error) {
      dispatchAlert({
        message: "Projeler getirilirken hata oluştu.",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  useEffect(() => {
    const initializeCompanies = async () => {
      await fetchCompanyData();
    };
    const initializeCategories = async () => {
      await fetchCategoryData();
    };
    const initializeProjects = async () => {
      await fetchProjectsData();
    };

    initializeCompanies();
    initializeCategories();
    initializeProjects();
  }, []);

  useEffect(() => {
    const initializeProjects = async () => {
      if (id && companies.length > 0) {
        await fetchProjectData();
      }
    };
    initializeProjects();
  }, [id, companies]);

  const handleCreateProject = async () => {
    if (projectData.name === "" || projectData.workCompany === null) {
      dispatchAlert({
        message: "Proje adı ve müşteri alanları zorunludur.",
        type: MessageBoxType.Error,
      });
      return;
    }
    try {
      dispatchBusy({ isBusy: true });

      const editedProjectData = {
        ...projectData,
        manager: selectedKullanici,
        managerId: selectionKullaniciId,
        userIds: selectionUserIds,
      };

      var conf = getConfiguration();
      var api = new TicketProjectsApi(conf);
      await api.apiTicketProjectsPost(editedProjectData);

      //Kopyalanan projeid yi burada gönder

      dispatchAlert({
        message: "Proje eklendi",
        type: MessageBoxType.Success,
      });
      // handleOpenNavigateDialog();
      navigate("/ticketProjects");
      
    } catch (error) {
      dispatchAlert({ message: error?.toString(), type: MessageBoxType.Error });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const handleUpdateProject = async () => {
    if (projectData.name === "" || projectData.workCompany === null) {
      dispatchAlert({
        message: "Proje adı ve müşteri alanları zorunludur.",
        type: MessageBoxType.Error,
      });
      return;
    }
    try {
      const editedProjectData = {
        ...projectData,
        manager: selectedKullanici,
        managerId: selectionKullaniciId,
        userIds: selectionUserIds,
        id: id,
      };
      console.log("editedProjectData", editedProjectData);

      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new TicketProjectsApi(conf);
      await api.apiTicketProjectsPut(editedProjectData);

      dispatchAlert({
        message: "Proje güncellendi",
        type: MessageBoxType.Success,
      });
      navigate("/ticketProjects");
    } catch (error) {
      dispatchAlert({ message: error?.toString(), type: MessageBoxType.Error });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container mt={3} mx={0.4}>
        <Grid item xs={12} lg={12}>
          <Card style={{ border: "none" }}>
            <MDBox p={3}>
              <MDBox p={2}>
                <MDTypography variant="h4" gutterBottom>
                  {id ? "Proje Düzenle" : "Proje Oluştur"}
                </MDTypography>
              </MDBox>
              <MDBox mt={2} p={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} lg={5.75}>
                    <MDInput
                      type="text"
                      sx={{ mb: 3.2 }}
                      value={projectData?.name || ""}
                      label="Proje Tanımı"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setProjectData({ ...projectData, name: e.target.value })
                      }
                      fullWidth
                    />
                    <Autocomplete
                      options={companies}
                      getOptionLabel={(option: any) => option.name}
                      isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                      value={projectData?.workCompany || null}
                      onChange={(event: React.SyntheticEvent, newValue: WorkCompanyDto | null) =>
                        setProjectData({
                          ...projectData,
                          workCompanyId: newValue?.id ?? null,
                          workCompany: newValue,
                        })
                      }
                      renderInput={(params) => (
                        <MDInput {...params} label="Müşteri" fullWidth sx={{ mb: 3.2 }} />
                      )}
                    />
                    <Autocomplete
                      options={categories}
                      getOptionLabel={(option: any) => option.name}
                      isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                      value={projectData?.projectCategory || null}
                      onChange={(
                        event: React.SyntheticEvent,
                        newValue: ProjectCategoriesListDto | null
                      ) => {
                        setProjectData({
                          ...projectData,
                          projectCategoryId: newValue?.id ?? null,
                          projectCategory: newValue,
                        });
                      }}
                      renderInput={(params) => (
                        <MDInput {...params} label="Kategori" fullWidth sx={{ mb: 3.2 }} />
                      )}
                    />

                    <Autocomplete
                      sx={{ mb: 3.2 }}
                      key={selectedKullanici?.id}
                      options={searchByName}
                      getOptionLabel={(option: UserAppDto) => {
                        // Handle both string and object cases
                        if (typeof option === "string") return option;
                        return option?.firstName && option?.lastName
                          ? `${option.firstName} ${option.lastName}`
                          : "";
                      }}
                      // value={projectData.manager || null}
                      value={selectedKullanici}
                      isOptionEqualToValue={(option: UserAppDto, value: UserAppDto) =>
                        option?.id === value?.id
                      }
                      onChange={(event, newValues: UserAppDto | null) => {
                        setSelectedKullanici(newValues);
                        if (newValues) {
                          setSelectionKullaniciId(newValues.id);
                          setNamesOfSelected(`${newValues.firstName} ${newValues.lastName}`);
                        } else {
                          setSelectionKullaniciId(null);
                          setNamesOfSelected("");
                        }
                      }}
                      onInputChange={(event, newInputValue) => {
                        handleSearchByName(newInputValue);
                      }}
                      renderInput={(params) => (
                        <MDInput
                          {...params}
                          size="large"
                          InputLabelProps={{ shrink: true }}
                          placeholder={t("ns1:DepartmentPage.DepartmentDetail.IsimAratin")}
                          label="Proje Sorumlusu"
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props} key={option.id} style={{ listStyle: "none" }}>
                          <MDBox
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
                      )}
                    />
                    <Autocomplete
                      sx={{ mb: 3.2 }}
                      multiple
                      options={searchByName}
                      getOptionLabel={(option: UserAppDto) =>
                        `${option.firstName} ${option.lastName}`
                      }
                      value={selectedUsers}
                      isOptionEqualToValue={(option: UserAppDto, value: UserAppDto) =>
                        option?.id === value?.id
                      }
                      onChange={(event, newValues: UserAppDto[]) => {
                        setSelectedUsers(newValues);
                        setSelectionUserIds(newValues.map((user) => user.id));
                      }}
                      onInputChange={(event, newInputValue) => {
                        handleSearchByName(newInputValue);
                      }}
                      renderInput={(params) => (
                        <MDInput
                          {...params}
                          size="large"
                          InputLabelProps={{ shrink: true }}
                          placeholder={t("ns1:DepartmentPage.DepartmentDetail.IsimAratin")}
                          label="Proje Çalışanları"
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props} key={option.id} style={{ listStyle: "none" }}>
                          <MDBox
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
                      )}
                    />
                  </Grid>
                  <Grid lg={0.5} />
                  <Grid item xs={12} sm={6} lg={5.75}>
                    <MDInput
                      type="text"
                      sx={{ mb: 3.2 }}
                      value={projectData?.subProjectName || ""}
                      label="Proje Alt Tanımı"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setProjectData({ ...projectData, subProjectName: e.target.value })
                      }
                      fullWidth
                    />
                    <MDInput
                      type="text"
                      sx={{ mb: 3.2 }}
                      value={projectData?.description || ""}
                      label="Açıklama"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setProjectData({ ...projectData, description: e.target.value })
                      }
                      fullWidth
                    />
                    <MDInput
                      type="text"
                      sx={{ mb: 3.2 }}
                      value={projectData?.risks || ""}
                      label="Riskler"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setProjectData({ ...projectData, risks: e.target.value })
                      }
                      fullWidth
                    />
                    <MDInput
                      type="text"
                      sx={{ mb: 3.2 }}
                      value={projectData?.reportsUrl || ""}
                      label="Kaynak Ve Raporlar"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setProjectData({ ...projectData, reportsUrl: e.target.value })
                      }
                      fullWidth
                    />
                    <Autocomplete
                      renderInput={(params) => (
                        <MDInput
                          {...params}
                          type="text"
                          label="Durum"
                          value={projectData?.isActive ? "Aktif" : "Pasif"}
                          fullWidth
                        />
                      )}
                      value={projectData?.isActive ? "Aktif" : "Pasif"}
                      options={activeOptions}
                      size="medium"
                      sx={{ mb: 3.2 }}
                      onChange={(event: React.SyntheticEvent, newValue: string | null) =>
                        setProjectData({ ...projectData, isActive: newValue === "Aktif" })
                      }
                    />
                    {!id && (
                      <>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={copyFromAnotherProject ?? false}
                              onChange={(e) => setCopyFromAnotherProject(e.target.checked)}
                            />
                          }
                          label="Proje görevlerini başka bir projeden kopyalamak istiyorum"
                        />

                        {copyFromAnotherProject && (
                          <>
                            <Autocomplete
                              options={projects}
                              getOptionLabel={(option: any) =>
                                `${option.name} - ${option.subProjectName}`
                              }
                              isOptionEqualToValue={(option: any, value: any) =>
                                option.id === value.id
                              }
                              value={projects.find(p => p.id === projectData.copiedProjectId) || null}
                              onChange={(
                                event: React.SyntheticEvent,
                                newValue: TicketProjectsListDto | null
                              ) => {
                                setProjectData({
                                  ...projectData,
                                  copiedProjectId: newValue?.id ?? null,
                                });
                              }}
                              renderInput={(params) => (
                                <MDInput
                                  {...params}
                                  label="Görevlerini kopyalamak istediğiniz projeyi seçin"
                                  fullWidth
                                  sx={{ mb: 2 }}
                                />
                              )}
                            />
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={projectData.isUserCopied ?? false}
                                    onChange={(
                                      event: React.SyntheticEvent<Element, Event>,
                                      newValue: boolean | null
                                    ) => {
                                      setProjectData({
                                        ...projectData,
                                        isUserCopied: newValue ?? null,
                                      });
                                    }}
                                  />
                                }
                                label="Görev çalışanlarını da kopyala."
                              />
                            </FormGroup>
                          </>
                        )}
                      </>
                    )}
                  </Grid>
                </Grid>
              </MDBox>
            </MDBox>
            <MDBox mt={31.5} mb={3} display="flex" justifyContent="flex-end" width="100%">
              <MDButton
                sx={{ mr: 3 }}
                variant="outlined"
                color="primary"
                onClick={() => navigate("/ticketProjects")}
              >
                İptal
              </MDButton>
              <MDButton
                sx={{ mr: 3 }}
                variant="gradient"
                color="info"
                onClick={id ? handleUpdateProject : handleCreateProject}
              >
                {id ? "Güncelle" : "Kaydet"}
              </MDButton>
              {id && (
                <MDButton
                  variant="gradient"
                  color="dark"
                  sx={{ mr: 3 }}
                  onClick={() => navigate("/projectManagement", { state: { projectId: projectData.id, workCompany: projectData.workCompany, showTest: true } })}
                >
                  Proje Yönetimine Git <Icon sx={{ cursor: "pointer", fontSize: "24px" }}>arrow_forward</Icon>
                </MDButton>
              )}
            </MDBox>
          </Card>
        </Grid>
      </Grid>
      <MDBox mt={1} />
      {/* <Dialog open={openNavigateDialog} onClose={handleCloseNavigateDialog}>
        <DialogTitle>Proje Başarıyla Oluşturuldu</DialogTitle>
        <DialogContent>
          <DialogContentText>Proje başarıyla oluşturuldu. Oluşturulan proje ile proje yönetim sayfasına gitmek istiyor musunuz?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton variant="outlined" color="primary" onClick={() => {
            navigate("/ticketProjects");
          }}>
            İptal
          </MDButton>
          <MDButton variant="gradient" color="info" onClick={() => navigate("/projectManagement", { state: { projectId: projectData.id, workCompany: projectData.workCompanyId, showTest: true }})}>
            Evet
            {projectData.workCompanyId}
            {projectData.id}
          </MDButton>
        </DialogActions>
      </Dialog> */}
      <Footer />
    </DashboardLayout>
  );
}

export default CreateTicketProject;
