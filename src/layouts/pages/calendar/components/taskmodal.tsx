import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Modal,
  Grid,
  IconButton,
  Autocomplete,
  Input,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { Close } from "@mui/icons-material";
import { Icon } from "@mui/material";
import { TaskEvent } from "../index";
import {
  UserCalendarInsertDto,
  UserCalendarListDto,
  UserApp,
  WorkCompanyDto,
  UserApi,
  WorkLocation,
  UserCalendarApi,
} from "api/generated/api";
import { clientData, getWorkLocationData, IWorkLocation } from "../controller";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { MessageBoxType } from "@ui5/webcomponents-react";
import getConfiguration from "confiuration";
import { fetchUserData } from "layouts/pages/queryBuild/controller/custom/apiCalls";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  selectedDate: {
    start: string;
    end: string;
  };
  selectedUsers: UserApp;
  onAddTask: (task: UserCalendarInsertDto) => void;
}

export default function TaskModal({
  open,
  onClose,
  selectedDate,
  selectedUsers,
  onAddTask,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [clientFetchData, setClientFetchData] = useState<WorkCompanyDto[]>([]);
  const [client, setClient] = useState<WorkCompanyDto>(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [density, setDensity] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [userAppFetchData, setUserAppFetchData] = useState<UserApp[]>([]);
  const [userApp, setUserApp] = useState<UserApp | null>(null);
  const [workLocationData, setWorkLocationData] = useState<IWorkLocation[]>([]);
  const [workLocation, setWorkLocation] = useState<IWorkLocation>(null);
  const dispatchAlert = useAlert();

  useEffect(() => {
    const fetchClientData = async () => {
      const data = await clientData();
      setClientFetchData(data);
    };
    fetchClientData();

    const fetchHasPerm = async () => {
      let conf = getConfiguration();
      let api1 = new UserCalendarApi(conf);
      const permData = await api1.apiUserCalendarCheckOtherDeptpermGet();
      if (permData.data.perm == false) {
        fetchUsersData();
      } else {
        fetchUserAppData();
      }
    };
    fetchHasPerm();

    const fetchUserAppData = async () => {
      let conf = getConfiguration();
      let api = new UserApi(conf);
      let data = await api.apiUserGetAllWithOuthPhotoGet();
      setUserAppFetchData(data.data);
    };

    const fetchUsersData = async () => {
      let conf = getConfiguration();
      let api = new UserCalendarApi(conf);
      let data = await api.apiUserCalendarGetUsersByDepartmentAndLevelGet();
      setUserAppFetchData(data.data);
    };

    const fetchWorkLocationData = async () => {
      getWorkLocationData().then((data) => {
        setWorkLocationData(data);
      });
    };
    fetchWorkLocationData();
  }, []);

  useEffect(() => {
    if (selectedDate && open) {
      setStart(selectedDate.start);
      setEnd(selectedDate.end);
    }
  }, [selectedDate, open]);

  useEffect(() => {
    if (open) {
      if (selectedUsers) {
        setUserApp(selectedUsers);
      }
    } else {
      // When modal closes, reset states (optional)
      // This is now handled by handleClose
    }
  }, [open, selectedUsers]);

  const colorOptions = [
    { value: "primary", label: "Primary" },
    { value: "secondary", label: "Secondary" },
    { value: "info", label: "Info" },
    { value: "success", label: "Success" },
    { value: "warning", label: "Warning" },
    { value: "error", label: "Error" },
  ];

  const handleSubmit = (): void => {
    console.log("tıklandı");
    if (isAvailable == false) {
      if (!client) {
        dispatchAlert({
          message: "Müşteri seçiniz",
          type: MessageBoxType.Error,
        });
        return;
      }
    }
    if (userApp == null) {
      dispatchAlert({
        message: "Personel seçiniz",
        type: MessageBoxType.Error,
      });
      return;
    }
    if (!start) {
      dispatchAlert({
        message: "Başlangıç tarihi giriniz",
        type: MessageBoxType.Error,
      });
      return;
    }
    if (!end) {
      dispatchAlert({
        message: "Bitiş tarihi giriniz",
        type: MessageBoxType.Error,
      });
      return;
    }
    if (start > end) {
      dispatchAlert({
        message: "Başlangıç tarihi bitiş tarihinden büyük olamaz",
        type: MessageBoxType.Error,
      });
      return;
    }

    if (start && end) {
      // Create new task event
      const newTask: UserCalendarInsertDto = {
        name: title,
        startDate: start,
        endDate: end,
        percentage: density.toString(),
        customerRefId: client?.id,
        // customerRef: client,
        // userApp: selectedUsers,
        userAppId: userApp.id,
        description,
        isAvailable: isAvailable,
      };
      if (workLocation?.id) {
        newTask.workLocation = workLocation.id as WorkLocation;
      }
      onAddTask(newTask);
      console.log("newTaskkk", newTask);
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    setTitle("");
    setStart("");
    setEnd("");
    setDensity(0);
    setDescription("");
    setClient(null);
    setUserApp(null);
    setWorkLocation(null);
    setIsAvailable(false);
  };

  interface CopiedData {
    title: any;
    description: any;
    user: any;
    customer: any;
    workLocation: any;
    startDate: any;
    endDate: any;
    density: any;
    isAvailable: any;
  }

  const [storedData, setStoredData] = useState<CopiedData | null>(null);

  useEffect(() => {
    const checkLocalStorage = () => {
      try {
        const storedItem = localStorage.getItem("CopiedData");

        if (storedItem) {
          const parsedData: CopiedData = JSON.parse(storedItem);
          setStoredData(parsedData);
          console.log("storedData", storedData);
        } else {
          setStoredData(null);
        }
      } catch (error) {
        setStoredData(null);
      }
    };
    // Bileşen yüklendiğinde ve her güncellemede kontrol et
    checkLocalStorage();
  }, []);

  const handlePaste = () => {
    const storedItem = localStorage.getItem("CopiedData");
    const parsedData: CopiedData = JSON.parse(storedItem);

    setTitle(parsedData.title);
    setDensity(parsedData.density);
    setDescription(parsedData.description);

    const foundUserApp = userAppFetchData.find(
      (client) => client.id.toString() === parsedData.user.toString()
    );
    const foundClient = clientFetchData.find(
      (client) => client.id.toString() === parsedData.customer.toString()
    );
    const foundWorkLocation = workLocationData.find(
      (location) => location.id.toString() === parsedData.workLocation.toString()
    );

    setUserApp(foundUserApp || null);
    setClient(foundClient ? { ...foundClient } : null);
    setWorkLocation(foundWorkLocation ? { ...foundWorkLocation } : null);

    try {
      console.log("Veriler başarıyla yerleştirildi");
    } catch (error) {
      alert("Veriler yerleştirilirken bir hata oluştu.");
    }
  };
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
  const percentageOptions = [
    { id: 1, description: "%25", color: "#10B981" }, // yeşil
  { id: 2, description: "%50", color: "#f4e218" }, // sarı
    { id: 3, description: "%75", color: "#f69c09" }, // turuncu
    { id: 4, description: "%100", color: "#EF4444" }, // kırmızı
  ];
  return (
    <Modal open={open} onClose={handleClose}>
      <MDBox
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          maxHeight: "90vh",
          overflow: "auto",
          bgcolor: "background.paper",
          borderRadius: "10px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <MDTypography variant="h5">Yeni Görev Ekle</MDTypography>
          <MDBox display="flex" justifyContent="end">
            <MDButton onClick={handlePaste} color="light" sx={{ marginRight: 1 }}>
              <Icon>content_paste</Icon>
            </MDButton>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </MDBox>
        </MDBox>

        <MDBox component="form" role="form">
          <MDBox mb={1} display="flex" justifyContent="flex-end">
            <FormControlLabel
              label="Bugün müsaitim!"
              labelPlacement="start" // label'ı sağa yerleştirir
              control={
                <Checkbox
                  checked={isAvailable}
                  onChange={(event) => {
                    setIsAvailable(event.target.checked);
                  }}
                />
              }
            />
          </MDBox>
          <MDBox mb={1}>
            <MDTypography variant="caption" fontWeight="bold" color="text">
              Görev Başlığı
            </MDTypography>
            <MDInput
              type="text"
              placeholder="Görev Başlığı Giriniz"
              fullWidth
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            />
          </MDBox>
          <MDBox mb={1}>
            <MDTypography variant="caption" fontWeight="bold" color="text">
              Personel
            </MDTypography>
            <Autocomplete
              options={userAppFetchData}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <MDInput
                  placeholder="Personel Seçiniz"
                  {...params}
                  inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                />
              )}
              value={userApp}
              onChange={(event, value) => setUserApp(value)}
            />
          </MDBox>
          <MDBox mb={1}>
            <MDTypography variant="caption" fontWeight="bold" color="text">
              Müşteri
            </MDTypography>
            <Autocomplete
              options={clientFetchData}
              value={client}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <MDInput
                  placeholder="Müşteri Seçiniz"
                  {...params}
                  inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, value) => setClient(value)}
            />
          </MDBox>
          <MDBox mb={1}>
            <MDTypography variant="caption" fontWeight="bold" color="text">
              Çalışma Yerleri
            </MDTypography>
            <Autocomplete
              value={workLocation}
              options={workLocationData}
              getOptionLabel={(option) => option.description}
              renderInput={(params) => (
                <MDInput
                  placeholder="Çalışma Yerleri Seçiniz"
                  {...params}
                  inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, value) => setWorkLocation(value)}
            />
          </MDBox>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <MDBox mb={2}>
                <MDTypography variant="caption" fontWeight="bold" color="text">
                  Başlangıç Tarihi
                </MDTypography>
                <MDInput
                  type="date"
                  variant="outlined"
                  fullWidth
                  value={start}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setStart(e.target.value)}
                />
              </MDBox>
            </Grid>
            <Grid item xs={6}>
              <MDBox mb={2}>
                <MDTypography variant="caption" fontWeight="bold" color="text">
                  Bitiş Tarihi
                </MDTypography>
                <MDInput
                  type="date"
                  fullWidth
                  value={end}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEnd(e.target.value)}
                />
              </MDBox>
            </Grid>
          </Grid>
          <MDBox mb={1}>
            <MDTypography variant="caption" fontWeight="bold" color="text">
              Açıklama
            </MDTypography>
            <MDInput
              type="text"
              placeholder="Açıklama Giriniz"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
            />
          </MDBox>
          <MDBox mb={2}>
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
                  }}
                />
              )}
              onChange={(event, value) => setDensity(value ? value.id : null)}
              value={percentageOptions.find((option) => option.id === density) || null}
            />
          </MDBox>
          <MDBox mt={4} mb={1} display="flex" justifyContent="flex-end">
            <MDButton onClick={handleClose} color="light" sx={{ marginRight: 1 }}>
              İptal
            </MDButton>
            <MDButton onClick={handleSubmit} color="info" variant="gradient">
              Ekle
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    </Modal>
  );
}
