import { Autocomplete, Grid, Checkbox, FormControlLabel } from "@mui/material";
import {
  DepartmentUserInsertDto,
  TicketDepartmensListDto,
  TicketDepartmentsApi,
  UserApi,
  UserAppDto,
  WorkCompanyApi,
  WorkCompanyDto,
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

function CreateDepartment() {
  const [departmentCode, setDepartmentCode] = useState("");
  const [departmentText, setDepartmentText] = useState("");
  const [departmentIsActive, setDepartmentIsActive] = useState(false);
  const [departmentManageId, setDepartmentManageId] = useState("");
  const [activeOptions, setActiveOptions] = useState(["Pasif", "Aktif"]);
  const [searchByName, setSearchByName] = useState<UserAppDto[]>([]);
  const [selectedKullanici, setSelectedKullanici] = useState<UserAppDto>();
  const [selectionKullaniciId, setSelectionKullaniciId] = useState<string>();
  const [selectedUsers, setSelectedUsers] = useState<UserAppDto[]>([]);
  const [selectionUserIds, setSelectionUserIds] = useState<string[]>([]);
  const [namesOfSelected, setNamesOfSelected] = useState<string>();
  const [companies, setCompanies] = useState<WorkCompanyDto[]>([]);
  const [myDepertments, setMyDepertments] = useState<TicketDepartmensListDto[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [parentDepartmanId, setParentDepartmanId] = useState(null);
  const [IsVisibleInList, setIsVisibleInList] = useState(false);

  const [nameofSelected, setNameofSelected] = useState("");
  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const fetchIDData = async () => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new TicketDepartmentsApi(conf);
      var response = await api.apiTicketDepartmentsIdGet(id);
      console.log("response", response.data);
      setDepartmentCode(response.data.deparmentCode);
      setDepartmentText(response.data.departmentText);
      setDepartmentIsActive(response.data.isActive);
      setDepartmentManageId(response.data.managerId);
      setIsVisibleInList(response.data.isVisibleInList);
      setSelectedCompany({
        id: response.data.workCompanyId,
        name: companies.find((company: any) => company.id === response.data.workCompanyId)?.name,
      });
      if (response.data.parentDepartmentId) {
        setSelectedDepartment({
          id: response.data.parentDepartmentId,
          departmentText: myDepertments.find(
            (department: any) => department.id === response.data.parentDepartmentId
          )?.departmentText,
        });
      }

      setParentDepartmanId(response.data.parentDepartmentId);
      console.log("response.data.departmentUsers", response.data);

      const managerData = {
        id: response.data.managerId,
        firstName: response.data.manager.firstName,
        lastName: response.data.manager.lastName,
      };

      setSelectedKullanici(managerData);
      setSelectionKullaniciId(response.data.managerId);
      // setNameofSelected(response.data.managerText);

      var deptusers: UserAppDto[] = [];
      response.data.departmentUsers.forEach((item) => {
        deptusers.push(item.user);
      });
      setSelectedUsers(deptusers);

      // setSelectedUsers(response.data.departmentUsers);
    } catch (error) {
      dispatchAlert({
        message: t("ns1:DepartmentPage.DepartmentList.HataOlustu") + ": " + error,
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const fetchCompany = async () => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new WorkCompanyApi(conf);
      var response = await api.apiWorkCompanyGet();
      setCompanies(response.data);
    } catch (error) {
      dispatchAlert({
        message: t("ns1:DepartmentPage.DepartmentList.HataOlustu") + ": " + error,
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const fetchDepartment = async () => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new TicketDepartmentsApi(conf);
      var response = await api.apiTicketDepartmentsGet();
      console.log("sercan departmanları", response);
      setMyDepertments(response.data);
    } catch (error) {
      dispatchAlert({
        message: t("ns1:DepartmentPage.DepartmentList.HataOlustu") + ": " + error,
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  useEffect(() => {
    const initializeCompanies = async () => {
      await fetchCompany();
      await fetchDepartment();
    };

    initializeCompanies();
  }, []);

  useEffect(() => {
    const initializeDepartmentData = async () => {
      if (id && companies.length > 0) {
        await fetchIDData();
      }
    };

    initializeDepartmentData();
  }, [id, companies, myDepertments]);

  const handleCreateDepartment = async () => {
    if (
      departmentCode === "" ||
      departmentText === "" ||
      selectionKullaniciId === null ||
      selectedCompany === null ||
      selectedUsers.length === 0
    ) {
      dispatchAlert({
        message: t("ns1:DepartmentPage.DepartmentDetail.AlanlariDoldur"),
        type: MessageBoxType.Error,
      });
      return;
    }
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new TicketDepartmentsApi(conf);
      await api.apiTicketDepartmentsPost({
        deparmentCode: departmentCode,
        departmentText: departmentText,
        isActive: departmentIsActive,
        managerId: selectionKullaniciId,
        workCompanyId: selectedCompany.id,
        isVisibleInList: IsVisibleInList,
        departmentUsers: selectedUsers.map((user) => ({
          ticketDepartmentId: user.ticketDepartmentId,
          userId: user.id,
        })),
        parentDepartmentId: selectedDepartment ? selectedDepartment.id : null,
      });
      dispatchAlert({
        message: t("ns1:DepartmentPage.DepartmentDetail.DepartmanEklendi"),
        type: MessageBoxType.Success,
      });
      dispatchBusy({ isBusy: false });
      navigate("/departments");
    } catch (error) {
      dispatchAlert({ message: error?.toString(), type: MessageBoxType.Error });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const handleUpdateDepartment = async () => {
    if (
      departmentCode === "" ||
      departmentText === "" ||
      selectionKullaniciId === null ||
      selectedCompany === null ||
      selectedUsers.length === 0
    ) {
      dispatchAlert({
        message: t("ns1:DepartmentPage.DepartmentDetail.AlanlariDoldur"),
        type: MessageBoxType.Error,
      });
      return;
    }
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new TicketDepartmentsApi(conf);
      await api.apiTicketDepartmentsPut({
        id: id,
        deparmentCode: departmentCode,
        departmentText: departmentText,
        isActive: departmentIsActive,
        managerId: selectionKullaniciId,
        workCompanyId: selectedCompany.id,
        isVisibleInList: IsVisibleInList,
        departmentUsers: selectedUsers.map((user) => ({
          ticketDepartmentId: user.ticketDepartmentId,
          userId: user.id,
        })),
        parentDepartmentId: selectedDepartment ? selectedDepartment.id : null,
      });

      dispatchAlert({
        message: t("ns1:DepartmentPage.DepartmentDetail.DepartmanGuncellendi"),
        type: MessageBoxType.Success,
      });
      dispatchBusy({ isBusy: false });
      navigate("/departments");
    } catch (error) {
      dispatchAlert({ message: error?.toString(), type: MessageBoxType.Error });
    } finally {
      dispatchBusy({ isBusy: false });
    }
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

  useEffect(() => {
    console.log("selectedUsers", selectedUsers);
  }, [selectedUsers]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container mt={3} mx={0.4}>
        <Grid item xs={12} lg={12}>
          <Card style={{ border: "none" }}>
            <MDBox p={3}>
              <MDBox p={2}>
                <MDTypography variant="h4" gutterBottom>
                  {id
                    ? t("ns1:DepartmentPage.DepartmentDetail.DepartmanDuzenle")
                    : t("ns1:DepartmentPage.DepartmentDetail.DepartmanOlustur")}
                </MDTypography>
              </MDBox>
              <MDBox mt={2} p={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} lg={5.75}>
                    <MDInput
                      type="text"
                      sx={{ mb: 3.2 }}
                      value={departmentText} // state'den alın
                      label={t("ns1:DepartmentPage.DepartmentDetail.DepartmanAdi")}
                      onChange={(e: any) => setDepartmentText(e.target.value)} // güncelle
                      fullWidth
                    />
                    <Autocomplete
                      renderInput={(params) => (
                        <MDInput
                          {...params}
                          type="text"
                          label={t("ns1:DepartmentPage.DepartmentDetail.Durum")}
                          value={departmentIsActive ? "Aktif" : "Pasif"} // state'den alın
                          fullWidth
                        />
                      )}
                      value={departmentIsActive ? "Aktif" : "Pasif"}
                      options={activeOptions}
                      size="medium"
                      sx={{ mb: 3.2 }}
                      onChange={(event, newValue) => {
                        setDepartmentIsActive(newValue === "Aktif");
                      }}
                    />
                    <Autocomplete
                      options={companies}
                      getOptionLabel={(option: any) => option.name}
                      isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                      value={selectedCompany}
                      onChange={(event, newValue) => {
                        setSelectedCompany(newValue);
                      }}
                      renderInput={(params) => (
                        <MDInput
                          {...params}
                          label={t("ns1:DepartmentPage.DepartmentDetail.SirketAdi")}
                          fullWidth
                          sx={{ mb: 3.2 }}
                        />
                      )}
                    />
                    <Autocomplete
                      options={myDepertments}
                      getOptionLabel={(option: any) => option.departmentText}
                      isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                      value={selectedDepartment}
                      onChange={(event, newValue) => {
                        setSelectedDepartment(newValue || null);
                      }}
                      renderInput={(params) => (
                        <MDInput
                          {...params}
                          label={t("ns1:DepartmentPage.DepartmentDetail.UstDepartman")}
                          fullWidth
                          sx={{ mb: 3.2 }}
                        />
                      )}
                    />
                    <FormControlLabel
                      label={t("ns1:DepartmentPage.DepartmentDetail.TicketGorunsun")}
                      control={
                        <Checkbox
                          checked={IsVisibleInList}
                          onChange={(event, newValue) => {
                            setIsVisibleInList(newValue);
                          }}
                        />
                      }
                    />
                  </Grid>

                  <Grid lg={0.5} />
                  <Grid item xs={12} sm={6} lg={5.75}>
                    <MDInput
                      type="text"
                      value={departmentCode} // state'den alın
                      label={t("ns1:DepartmentPage.DepartmentDetail.DepartmanKodu")}
                      onChange={(e: any) => setDepartmentCode(e.target.value)} // güncelle
                      fullWidth
                      sx={{ mb: 3.2 }}
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
                      value={selectedKullanici}
                      isOptionEqualToValue={(option: UserAppDto, value: UserAppDto) =>
                        option?.id === value?.id
                      }
                      onChange={(event, newValues: UserAppDto) => {
                        setSelectedKullanici(newValues);
                        setSelectionKullaniciId(newValues.id);
                        setNamesOfSelected(`${newValues.firstName} ${newValues.lastName}`);
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
                          label={t("ns1:DepartmentPage.DepartmentDetail.Yoneticiler")}
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
                        // setNamesOfSelected(
                        //   newValues.map((user) => `${user.firstName} ${user.lastName}`)
                        // );
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
                          label={t("ns1:DepartmentPage.DepartmentDetail.Kullanicilar")}
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
                </Grid>
              </MDBox>
            </MDBox>
            <MDBox mt={31.5} mb={3} display="flex" justifyContent="flex-end" width="100%">
              <MDButton
                sx={{ mr: 3 }}
                variant="outlined"
                color="primary"
                onClick={() => navigate("/departments")}
              >
                {t("ns1:DepartmentPage.DepartmentDetail.Iptal")}
              </MDButton>
              <MDButton
                sx={{ mr: 3 }}
                variant="gradient"
                color="info"
                onClick={id ? handleUpdateDepartment : handleCreateDepartment}
              >
                {t("ns1:DepartmentPage.DepartmentDetail.Kaydet")}
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

export default CreateDepartment;
