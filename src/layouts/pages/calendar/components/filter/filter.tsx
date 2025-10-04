import {
  alpha,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Grid,
  Icon,
  IconButton,
  TextField,
  useTheme,
} from "@mui/material";
import {
  Configuration,
  TicketDepartmensListDto,
  TicketDepartmentsApi,
  TicketTeamApi,
  TicketTeamListDto,
  TicketTeamUserAppInsertDto,
  UserApi,
  UserApp,
  UserCalendarApi,
} from "api/generated";
import MDAvatar from "components/MDAvatar";
import MDBadgeDot from "components/MDBadgeDot";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import getConfiguration from "confiuration";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { useAlert } from "layouts/pages/hooks/useAlert";
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MessageBoxType } from "@ui5/webcomponents-react";
import MDTypography from "components/MDTypography";
import { getDateRangeFromWeek } from "../../utils/utils";
import { string } from "yup";
import { fetchTeamData } from "layouts/pages/queryBuild/controller/custom/apiCalls";

interface FilterCalendarProps {
  initialWeek?: number;
  initialYear?: number;
  onFilterApply?: (filterData: filterData) => void;
}

export interface filterData {
  selectedUsers: UserApp[];
  selectedDepartmentForm: string;
  selectedLevelForm: number;
  week: string;
  year: string;
  selectedDays: number[];
  selectedPercentage: number[];
  showAll: boolean;
}

function FilterCalendar({ initialWeek, initialYear, onFilterApply }: FilterCalendarProps) {
  const navigate = useNavigate();
  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const theme = useTheme();

  // Define custom colors
  const customColors = {
    primary: "#4F46E5", // Indigo primary
    background: {
      paper: "#FFFFFF",
      light: "#F8FAFC",
    },
    text: {
      primary: "#1E293B",
      secondary: "#64748B",
    },
    border: "#E2E8F0",
  };

  const [departmentData, setDepartmentData] = useState<TicketDepartmensListDto[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<TicketDepartmensListDto | null>(
    null
  );
  const [hasPerm, setHasPerm] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [levelData, setLevelData] = useState<any[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<any | null>(null);
  const [teamUsers, setTeamUsers] = useState<UserApp[]>([]);
  const [formData, setFormData] = useState<filterData>({
    selectedUsers: [],
    selectedDepartmentForm: "",
    selectedLevelForm: null,
    week: initialWeek ? initialWeek.toString() : "",
    year: initialYear ? initialYear.toString() : new Date().getFullYear().toString(),
    selectedDays: [],
    selectedPercentage: [],
    showAll: false,
  });
  useEffect(() => {
    const fetchIsManager = async () => {
      let conf = getConfiguration();
      let api1 = new UserCalendarApi(conf);
      const permData = await api1.apiUserCalendarCheckUserIsManagerGet();
      setIsManager(permData.data.perm);
    };
    const fetchHasPerm = async () => {
      let conf = getConfiguration();
      let api1 = new UserCalendarApi(conf);
      const permData = await api1.apiUserCalendarCheckOtherDeptpermGet();
      setHasPerm(permData.data.perm);
    };
    fetchIsManager();
    fetchHasPerm();
  }, []);

  // Calculate date range from week and year
  const dateRange = useMemo(() => {
    if (formData.week && formData.year) {
      const weekNum = parseInt(formData.week as string);
      const yearNum = parseInt(formData.year as string);

      if (!isNaN(weekNum) && !isNaN(yearNum) && weekNum >= 1 && weekNum <= 53) {
        const { startDate, endDate } = getDateRangeFromWeek(weekNum, yearNum);

        // Format dates as DD.MM.YYYY
        const formatDate = (date: Date) => {
          return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}.${date.getFullYear()}`;
        };

        return `${formatDate(new Date(startDate))} - ${formatDate(new Date(endDate))}`;
      }
    }
    return null;
  }, [formData.week, formData.year]);

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Hafta değiştiğinde yeniden istek atılır
  useEffect(() => {
    if (formData.week && formData.week !== "") {
      handleFilterApply();
    }
  }, [formData.week]);

  useEffect(() => {
    // Update form data if initialWeek or initialYear props change
    if (initialWeek) {
      setFormData((prev) => ({ ...prev, week: initialWeek.toString() }));
    }
    if (initialYear) {
      setFormData((prev) => ({ ...prev, year: initialYear.toString() }));
    }
    if (selectedDepartment) {
      setFormData((prev) => ({ ...prev, selectedDepartmentForm: selectedDepartment.id }));
    }
  }, [initialWeek, initialYear, selectedDepartment]);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      let conf = getConfiguration();

      let api3 = new TicketDepartmentsApi(conf);
      let response = await api3.apiTicketDepartmentsAllOnlyNameGet();     
      setDepartmentData(response.data);
      let api1 = new UserCalendarApi(conf);
      const permData = await api1.apiUserCalendarCheckOtherDeptpermGet();

      if (permData.data.perm == false) {
        let api2 = new UserApi(conf);
        let response = await api2.apiUserUserDepartmentGet();
        setSelectedDepartment(response.data);
      }
    };
    const fetchLevelData = async () => {
      let conf = getConfiguration();
      let api = new UserApi(conf);
      let response = await api.apiUserUserLevelsGet();
      setLevelData(response.data as any);
    };
    try {
      dispatchBusy({ isBusy: true });
      fetchDepartmentData();
      fetchLevelData();
    } catch (error) {
      dispatchAlert({ message: "Hata oluştu", type: MessageBoxType.Error });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  }, []);

  useEffect(() => {
    console.log("showAll", formData.showAll);
  }, [formData.showAll]);

  useEffect(() => {
    console.log("formData.selectedUsers", formData.selectedUsers);
    console.log("veriler:", hasPerm, isManager, formData.selectedUsers.length);
    if (hasPerm == false && isManager == false && formData.selectedUsers.length >= 1) {
      console.log("1");
      if (onFilterApply) {
        onFilterApply(formData);
      }
    } else if (
      hasPerm == false &&
      isManager == true &&
      formData.selectedLevelForm == null &&
      formData.selectedUsers.length == 0
    ) {
      console.log("2");
      console.log("null");
      setFormData((prev) => ({ ...prev, selectedUsers: teamUsers }));
    } else if (hasPerm == false && isManager == true && formData.selectedUsers.length >= 0) {
      console.log("3");
      if (onFilterApply) {
        onFilterApply(formData);
      }
    }
  }, [formData.selectedUsers]);

  useEffect(() => {
    const fetchTeamUsers = async () => {
      if (selectedDepartment || selectedLevel) {
        try {
          dispatchBusy({ isBusy: true });
          let conf = getConfiguration();
          let api = new UserCalendarApi(conf);
          let response = await api.apiUserCalendarGetUsersByDepartmentAndLevelGet(
            selectedDepartment?.id,
            selectedLevel?.id
          );

          setTeamUsers(response.data);
          if (hasPerm == false) {
            setFormData((prev) => ({ ...prev, selectedUsers: response.data }));
          }
        } catch (error) {
          dispatchAlert({ message: "Hata oluştu", type: MessageBoxType.Error });
        } finally {
          dispatchBusy({ isBusy: false });
        }
      } else {
        setTeamUsers([]);
      }
    };
    fetchTeamUsers();
  }, [selectedDepartment, selectedLevel]);

  const handleDepartmentChange = (event: any, value: TicketDepartmensListDto | null) => {
    setSelectedDepartment(value);

    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedDepartmentForm: value ? value.id : "",
      selectedUsers: [],
    }));
  };

  const handleLevelChange = (event: any, value: any | null) => {
    setSelectedLevel(value);

    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedLevelForm: value ? value.id : "",
      selectedUsers: [],
    }));
  };

  const handleFilterReset = async () => {
    let conf = getConfiguration();
    setSelectedLevel(null);
    if (hasPerm == false) {
      console.log("filter reset basıldı");

      setFormData({
        selectedLevelForm: null,
        selectedUsers: teamUsers,
        selectedDepartmentForm: selectedDepartment.id,

        week: initialWeek ? initialWeek.toString() : "",
        year: initialYear ? initialYear.toString() : new Date().getFullYear().toString(),
        selectedDays: [],
        selectedPercentage: [],
        showAll: false,
      });

      let ResetFilterData: filterData = {
        selectedLevelForm: null,
        selectedUsers: teamUsers,
        selectedDepartmentForm: selectedDepartment.id,

        week: initialWeek ? initialWeek.toString() : "",
        year: initialYear ? initialYear.toString() : new Date().getFullYear().toString(),
        selectedDays: [] as any,
        selectedPercentage: [] as any,
        showAll: false,
      };
      if (onFilterApply) {
        onFilterApply(ResetFilterData);
      }
    } else {
      setTeamUsers([]);
      setSelectedDepartment(null);
      setFormData({
        selectedUsers: [],
        selectedDepartmentForm: "",
        selectedLevelForm: null,
        week: initialWeek ? initialWeek.toString() : "",
        year: initialYear ? initialYear.toString() : new Date().getFullYear().toString(),
        selectedDays: [],
        selectedPercentage: [],
        showAll: false,
      });

      let ResetFilterData: filterData = {
        selectedUsers: [] as any,
        selectedDepartmentForm: "",
        selectedLevelForm: null,
        week: initialWeek ? initialWeek.toString() : "",
        year: initialYear ? initialYear.toString() : new Date().getFullYear().toString(),
        selectedDays: [] as any,
        selectedPercentage: [] as any,
        showAll: false,
      };
      if (onFilterApply) {
        onFilterApply(ResetFilterData);
      }
    }
  };

  const handleFilterApply = () => {
    // Validate inputs
    if (formData.week && formData.year) {
      if (
        (formData.selectedDays.length > 0 && formData.selectedPercentage.length === 0) ||
        (formData.selectedDays.length === 0 && formData.selectedPercentage.length > 0)
      ) {
        // Optionally show an alert if the conditions are not met
        dispatchAlert({
          message: "Gün ve yoğunluk değerleri birlikte seçilmeli.",
          type: MessageBoxType.Warning,
        });
      } else {
        const weekNum = parseInt(formData.week as string);
        const yearNum = parseInt(formData.year as string);

        if (weekNum >= 1 && weekNum <= 53) {
          const { startDate, endDate } = getDateRangeFromWeek(weekNum, yearNum);

          const updatedFormData = {
            ...formData,
            startDate,
            endDate,
          };

          if (hasPerm == false && updatedFormData.selectedUsers == null) {
            const newupdatedFormData = {
              ...updatedFormData,
              selectedusers: teamUsers,
            };
            if (onFilterApply) {
              onFilterApply(newupdatedFormData);
            }
          }

          if (onFilterApply) {
            onFilterApply(updatedFormData);
          }
        } else {
          dispatchAlert({
            message: "Hafta değeri 1-53 aralığında olmalıdır",
            type: MessageBoxType.Error,
          });
        }
      }
    } else {
      // If week or year is missing, just log what we have

      // Optionally show an alert to the user
      if (!formData.week || !formData.year) {
        dispatchAlert({
          message: "Hafta ve yıl değerleri gereklidir",
          type: MessageBoxType.Warning,
        });
      }
    }
  };

  const dayOptions = [
    { id: 0, description: "Pazartesi" },
    { id: 1, description: "Salı" },
    { id: 2, description: "Çarşamba" },
    { id: 3, description: "Perşembe" },
    { id: 4, description: "Cuma" },
    { id: 5, description: "Cumartesi" },
    { id: 6, description: "Pazar" },
  ];

  const percentageOptions = [
    { id: 1, description: "%25", color: "#10B981" }, // yeşil
    { id: 2, description: "%50", color: "#f4e218" }, // sarı
    { id: 3, description: "%75", color: "#f69c09" }, // turuncu
    { id: 4, description: "%100", color: "#EF4444" }, // kırmızı
  ];

  return (
    <MDBox
      sx={{
        backgroundColor: customColors.background.paper,
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        overflow: "hidden",
        border: `1px solid ${customColors.border}`,
        mb: 3,
      }}
    >
      {/* Tab Bar Header */}
      <MDBox
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${customColors.border}`,
          px: 3,
          py: 2,
          backgroundColor: customColors.background.light,
        }}
      >
        <MDBox display="flex" alignItems="center">
          <MDTypography
            onClick={() => setShowFilter(!showFilter)}
            variant="button"
            fontWeight="bold"
            sx={{
              display: "flex",
              alignItems: "center",
              color: customColors.text.primary,
              px: 2,
              py: 0.75,
              backgroundColor: alpha(customColors.primary, 0.1),
              borderRadius: "8px",
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            <Icon sx={{ mr: 1, fontSize: "1.1rem" }}>filter_list</Icon>
            Filtre Ayarları
          </MDTypography>

          {dateRange && (
            <MDBox
              sx={{
                display: "flex",
                alignItems: "center",
                ml: 2,
                px: 2,
                py: 0.75,
                borderRadius: "8px",
                backgroundColor: alpha(customColors.primary, 0.05),
                border: `1px solid ${alpha(customColors.primary, 0.1)}`,
              }}
            >
              <Icon sx={{ color: customColors.primary, mr: 1, fontSize: "1rem" }}>date_range</Icon>
              <MDTypography
                variant="caption"
                fontWeight="medium"
                color={customColors.text.secondary}
              >
                {dateRange}
              </MDTypography>
            </MDBox>
          )}
        </MDBox>

        <MDButton
          onClick={() => setShowFilter(!showFilter)}
          variant="text"
          sx={{
            minWidth: "auto",
            p: 1,

            backgroundColor: alpha(customColors.primary, 0.1),
            "&:hover": {
              backgroundColor: alpha(customColors.primary, 0.1),
            },
          }}
        >
          <Icon sx={{ color: customColors.text.primary }}>
            {showFilter ? "expand_less" : "expand_more"}
          </Icon>
        </MDButton>
      </MDBox>

      {/* Filter Content - Expandable */}
      <MDBox
        sx={{
          maxHeight: showFilter ? "2000px" : "0px",
          opacity: showFilter ? 1 : 0,
          transition: "all 0.3s ease",
          visibility: showFilter ? "visible" : "hidden",
          overflow: "hidden",
        }}
      >
        <Grid container spacing={3} sx={{ p: 3 }}>
          {/* Left Column - Filters */}
          <Grid item xs={12} md={8} lg={9}>
            {/* Department Selection */}
            <MDBox mb={3}>
              <MDBox
                component="label"
                sx={{
                  display: "block",
                  mb: 1,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: customColors.text.primary,
                }}
              >
                Departman
              </MDBox>
              <Autocomplete
                disabled={!hasPerm}
                fullWidth
                size="small"
                options={departmentData}
                getOptionLabel={(option) => option.departmentText || ""}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <MDInput
                    {...params}
                    placeholder="Departman Seçiniz"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <Icon sx={{ color: customColors.text.secondary, mr: 1 }}>business</Icon>
                      ),
                    }}
                  />
                )}
                onChange={handleDepartmentChange}
                value={selectedDepartment}
              />
            </MDBox>

            {/* Level Selection */}
            <MDBox mb={3}>
              <MDBox
                component="label"
                sx={{
                  display: "block",
                  mb: 1,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: customColors.text.primary,
                }}
              >
                Seviye
              </MDBox>
              <Autocomplete
                fullWidth
                size="small"
                options={levelData}
                getOptionLabel={(option) => option.description || ""}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <MDInput
                    {...params}
                    placeholder="Seviye Seçiniz"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <Icon sx={{ color: customColors.text.secondary, mr: 1 }}>leaderboard</Icon>
                      ),
                    }}
                  />
                )}
                onChange={handleLevelChange}
                value={selectedLevel}
                disabled={hasPerm == false && isManager == false}
              />
            </MDBox>

            {/* Date Range Selection */}
            <MDBox
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 3,
                mb: 3,
              }}
            >
              {/* Week */}
              <MDBox>
                <MDBox
                  component="label"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: customColors.text.primary,
                  }}
                >
                  Hafta
                </MDBox>
                <MDBox display="flex" alignItems="center">
                  <MDInput
                    type="number"
                    fullWidth
                    value={formData.week || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("week", e.target.value)
                    }
                    InputProps={{
                      startAdornment: (
                        <Icon sx={{ color: customColors.text.secondary, mr: 1 }}>date_range</Icon>
                      ),
                      inputProps: { min: 1, max: 53 },
                    }}
                    placeholder="1-53"
                    size="small"
                  />
                  {dateRange && (
                    <MDBox
                      sx={{
                        ml: 2,
                        fontSize: "0.75rem",
                        color: customColors.text.secondary,
                        whiteSpace: "nowrap",
                      }}
                    >
                      ({dateRange})
                    </MDBox>
                  )}
                </MDBox>
              </MDBox>

              {/* Year */}
              <MDBox>
                <MDBox
                  component="label"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: customColors.text.primary,
                  }}
                >
                  Yıl
                </MDBox>
                <MDInput
                  type="number"
                  fullWidth
                  value={formData.year || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("year", e.target.value)
                  }
                  InputProps={{
                    startAdornment: (
                      <Icon sx={{ color: customColors.text.secondary, mr: 1 }}>calendar_today</Icon>
                    ),
                    inputProps: { min: 2020, max: 2100 },
                  }}
                  size="small"
                />
              </MDBox>
            </MDBox>

            {/* Day Percentage Selection */}
            <MDBox
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 3,
                mb: 3,
              }}
            >
              {/* Day */}
              <MDBox>
                <MDBox
                  component="label"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: customColors.text.primary,
                  }}
                >
                  Gün
                </MDBox>
                <Autocomplete
                  fullWidth
                  size="small"
                  options={dayOptions}
                  multiple={true}
                  getOptionLabel={(option) => option.description || ""}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => {
                    const inputProps = {
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <Icon sx={{ color: customColors.text.secondary, mr: 1 }}>date_range</Icon>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    };
                    return (
                      <MDInput {...params} placeholder="Gün Seçiniz" InputProps={inputProps} />
                    );
                  }}
                  onChange={(event, value) =>
                    handleInputChange(
                      "selectedDays",
                      value.map((item) => item.id)
                    )
                  }
                  value={dayOptions.filter((option) => formData.selectedDays.includes(option.id))}
                />
              </MDBox>

              {/* Percantage */}
              <MDBox>
                <MDBox
                  component="label"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: customColors.text.primary,
                  }}
                >
                  Yoğunluk
                </MDBox>
                <Autocomplete
                  multiple
                  fullWidth
                  size="small"
                  options={percentageOptions}
                  getOptionLabel={(option) => option.description || ""}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <span
                        style={{
                          display: "inline-block",
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: option.color,
                          marginRight: 8,
                        }}
                      />
                      {option.description}
                    </li>
                  )}
                  renderInput={(params) => (
                    <MDInput
                      {...params}
                      placeholder="Yoğunluk Seçiniz"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <Icon sx={{ color: customColors.text.secondary, mr: 1 }}>percent</Icon>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  onChange={(event, values) =>
                    handleInputChange(
                      "selectedPercentage",
                      values.map((v) => v.id)
                    )
                  }
                  value={percentageOptions.filter((option) =>
                    formData.selectedPercentage?.includes(option.id)
                  )}
                />
              </MDBox>
            </MDBox>

            {/* Person Selection */}
            <MDBox mb={3}>
              <MDBox
                component="label"
                sx={{
                  display: "block",
                  mb: 1,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: customColors.text.primary,
                }}
              >
                Kişi
              </MDBox>
              <Autocomplete
                fullWidth
                size="small"
                options={teamUsers}
                multiple={true}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => {
                  const inputProps = {
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <Icon sx={{ color: customColors.text.secondary, mr: 1 }}>person</Icon>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  };
                  return <MDInput {...params} placeholder="Kişi Seçiniz" InputProps={inputProps} />;
                }}
                renderOption={(props, option) => {
                  const { key, ...restProps } = props as React.HTMLAttributes<HTMLLIElement> & {
                    key: React.Key;
                  };
                  return (
                    <li
                      key={key}
                      {...restProps}
                      style={{ display: "flex", alignItems: "center", padding: "8px 16px" }}
                    >
                      <MDAvatar
                        src={option.photo ? `data:image/jpeg;base64,${option.photo}` : ""}
                        alt={`${option.firstName} ${option.lastName}`}
                        size="sm"
                        sx={{ mr: 2, width: 28, height: 28 }}
                      />
                      <span>
                        {option.firstName} {option.lastName}
                      </span>
                    </li>
                  );
                }}
                onChange={(event, value) => handleInputChange("selectedUsers", value)}
                value={formData.selectedUsers}
                disabled={
                  (!selectedDepartment && !selectedLevel) ||
                  (hasPerm == false && isManager == false)
                }
              />
              {!selectedDepartment && !selectedLevel && (
                <MDTypography
                  variant="caption"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: customColors.text.secondary,
                    mt: 1,
                  }}
                >
                  <Icon sx={{ fontSize: 16, mr: 0.5 }}>info</Icon>
                  Önce bir departman veya seviye seçmelisiniz
                </MDTypography>
              )}
            </MDBox>
            {hasPerm && (
              <MDBox>
                <FormControlLabel
                  control={<Checkbox checked={formData.showAll} />}
                  label="Herkesi Getir"
                  onChange={() => handleInputChange("showAll", !formData.showAll)}
                />
              </MDBox>
            )}
          </Grid>

          {/* Right Column - Action Buttons */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox
              display="flex"
              flexDirection="column"
              height="100%"
              justifyContent="space-between"
            >
              {/* Stats Card */}
              <MDBox
                sx={{
                  p: 3,
                  width: "100%",
                  backgroundColor: "rgba(59, 130, 246, 0.04)",
                  borderRadius: "12px",
                  border: "1px solid rgba(59, 130, 246, 0.1)",
                  display: { xs: "none", md: "block" },
                }}
              >
                <MDTypography variant="body2" fontWeight="bold" color="text.primary" mb={2}>
                  Filtre Özeti
                </MDTypography>

                <MDBox display="flex" alignItems="center" mb={1.5}>
                  <Icon sx={{ color: "#3b82f6", mr: 1, fontSize: "1.1rem" }}>business</Icon>
                  <MDTypography variant="caption" color="text.secondary">
                    Departman:{" "}
                    <strong>
                      {selectedDepartment ? selectedDepartment.departmentText : "Seçilmedi"}
                    </strong>
                  </MDTypography>
                </MDBox>

                <MDBox display="flex" alignItems="center" mb={1.5}>
                  <Icon sx={{ color: "#3b82f6", mr: 1, fontSize: "1.1rem" }}>leaderboard</Icon>
                  <MDTypography variant="caption" color="text.secondary">
                    Seviye:{" "}
                    <strong>{selectedLevel ? selectedLevel.description : "Seçilmedi"}</strong>
                  </MDTypography>
                </MDBox>

                <MDBox display="flex" alignItems="center" mb={1.5}>
                  <Icon sx={{ color: "#3b82f6", mr: 1, fontSize: "1.1rem" }}>date_range</Icon>
                  <MDTypography variant="caption" color="text.secondary">
                    Hafta/Yıl:{" "}
                    <strong>
                      {formData.week && formData.year
                        ? `${formData.week}. Hafta, ${formData.year}`
                        : "Seçilmedi"}
                    </strong>
                  </MDTypography>
                </MDBox>

                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ color: "#3b82f6", mr: 1, fontSize: "1.1rem" }}>group</Icon>
                  <MDTypography variant="caption" color="text.secondary">
                    Seçili Kişi Sayısı:{" "}
                    <strong>
                      {formData.selectedUsers.length > 0
                        ? `${formData.selectedUsers.length} kişi`
                        : "Seçilmedi"}
                    </strong>
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MDBox>
            {/* <MDBox mb={8}>
             
            </MDBox> */}

            <MDBox
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
                mt: -15,
              }}
            >
              <MDButton
                variant="gradient"
                color="info"
                onClick={() => handleFilterApply()}
                fullWidth
                startIcon={<Icon>filter_list</Icon>}
                sx={{
                  py: 1.5,
                  borderRadius: "12px",
                  boxShadow: "0 4px 10px rgba(59, 130, 246, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 15px rgba(59, 130, 246, 0.4)",
                  },
                }}
              >
                Filtreleri Uygula
              </MDButton>

              <MDButton
                variant="outlined"
                color="info"
                onClick={handleFilterReset}
                startIcon={<Icon>refresh</Icon>}
                sx={{
                  py: 1.25,
                }}
              >
                Filtreleri Sıfırla
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default FilterCalendar;
