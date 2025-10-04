import MDBox from "components/MDBox";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Modal, Grid, IconButton, Autocomplete, FormControlLabel, Checkbox } from "@mui/material";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { Close } from "@mui/icons-material";
import { TaskEvent } from "../index";
import { clientData, getWorkLocationData, IWorkLocation } from "../controller";
import { Icon } from "@mui/material";
import {
  UserCalendarListDto,
  UserApi,
  UserApp,
  WorkCompanyDto,
  WorkLocation,
  UserCalendarApi,
} from "api/generated/api";
import { formatDate } from "../utils/utils";
import getConfiguration from "confiuration";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { MessageBoxType } from "@ui5/webcomponents-react";

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  selectedDate: {
    start: string;
    end: string;
  };
  selectedEvent: UserCalendarListDto | null;
  onEditEvent: (event: UserCalendarListDto) => void;
}

export default function EventModal({
  open,
  onClose,
  selectedDate,
  selectedEvent,
  onEditEvent,
}: EventModalProps) {
  const [title, setTitle] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [clientFetchData, setClientFetchData] = useState<WorkCompanyDto[]>([]);
  const [client, setClient] = useState<WorkCompanyDto>(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [description, setDescription] = useState("");
  const [className, setClassName] = useState("");
  const [eventId, setEventId] = useState<string | number | undefined>("");
  const [userApp, setUserApp] = useState<UserApp | null>(null);
  const [userAppId, setUserAppId] = useState<string | number | undefined>("");
  const [userAppFetchData, setUserAppFetchData] = useState<UserApp[]>([]);
  const [density, setDensity] = useState<number>(0);
  const [workLocationData, setWorkLocationData] = useState<IWorkLocation[]>([]);
  const [workLocation, setWorkLocation] = useState<IWorkLocation>(null);
  const dispatchAlert = useAlert();
  useEffect(() => {
    const fetchClientData = async () => {
      const data = await clientData();
      setClientFetchData(data);
    };
    fetchClientData();

    const fetchWorkLocationData = async () => {
      getWorkLocationData().then((data) => {
        setWorkLocationData(data);
      });
    };
    fetchWorkLocationData();

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
  }, []);

  const colorOptions = [
    { value: "primary", label: "Primary" },
    { value: "secondary", label: "Secondary" },
    { value: "info", label: "Info" },
    { value: "success", label: "Success" },
    { value: "warning", label: "Warning" },
    { value: "error", label: "Error" },
  ];

  useEffect(() => {
    if (open && selectedEvent) {
      console.log("selectedevent", selectedEvent);
      const formattedStartDate = formatDate(selectedEvent.startDate);
      const formattedEndDate = formatDate(selectedEvent.endDate);
      setTitle(selectedEvent.name || "");
      setStart(formattedStartDate || "");
      setEnd(formattedEndDate || "");
      setClassName(selectedEvent.color || "info");
      setClient(selectedEvent.customerRef);
      setEventId(selectedEvent.id);
      setDescription(selectedEvent.description || "");
      setUserApp(selectedEvent.userAppDto ?? selectedEvent.userAppDtoWithoutPhoto);
      setUserAppId(selectedEvent.userAppId);

      //Percantage comobox olması için
      if (Number(selectedEvent.percentage) == 0) {
        setDensity(0);
      } else if (Number(selectedEvent.percentage) > 0 && Number(selectedEvent.percentage) <= 25) {
        setDensity(1);
      } else if (Number(selectedEvent.percentage) >25 && Number(selectedEvent.percentage) <= 50) {
        setDensity(2);
      } else if (Number(selectedEvent.percentage) > 50 && Number(selectedEvent.percentage) <= 99) {
        setDensity(3);
      } else if (Number(selectedEvent.percentage) > 99) {
        setDensity(4);
      }  else {
        setDensity(0); // Beklenmeyen bir değer için fallback
      }

      // setDensity(Number(selectedEvent.percentage));
      console.log("setDensity", Number(selectedEvent.percentage));
      const workLocationFinded = workLocationData.find(
        (workLocation) => workLocation.id === selectedEvent.workLocation
      );
      setWorkLocation(workLocationFinded);
      setIsAvailable(selectedEvent.isAvailable);
      console.log(selectedEvent.isAvailable);
    }
  }, [selectedEvent, open, workLocationData]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
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

    const updatedEvent: UserCalendarListDto = {
      id: eventId.toString(),
      name: title,
      startDate: start,
      endDate: end,
      color: className || "info",
      customerRefId: client?.id,
      description,
      userAppId: userApp?.id,
      customerRef: client,
      userAppDto: userApp,
      percentage: density.toString(),
      isAvailable: isAvailable,
    };
    if (workLocation?.id) {
      updatedEvent.workLocation = workLocation.id as WorkLocation;
    }
    onEditEvent(updatedEvent);
    handleClose();
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

  const handleCopy = () => {

    const data: CopiedData = {
      title: selectedEvent.name,
      description: selectedEvent.description,
      user: selectedEvent.userAppId,
      customer: selectedEvent.customerRef.id,
      workLocation: workLocation.id,
      startDate: start,
      endDate: end,
      density: density,
      isAvailable: selectedEvent.isAvailable,
    };

    try {
      localStorage.setItem("CopiedData", JSON.stringify(data));
    } catch (error) {
      console.error("localStorage'a veri kaydederken hata oluştu:", error);
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
          <MDTypography variant="h5">Görevi Düzenle</MDTypography>
          <MDBox display="flex" justifyContent="end">
            <MDButton onClick={handleCopy} color="light" sx={{ marginRight: 1 }}>
              <Icon>content_copy</Icon>
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
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <MDInput
                  placeholder="Müşteri Seçiniz"
                  {...params}
                  inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={client}
              onChange={(event, value) => setClient(value)}
            />
          </MDBox>
          <MDBox mb={1}>
            <MDTypography variant="caption" fontWeight="bold" color="text">
              Çalışma Yerleri
            </MDTypography>
            <Autocomplete
              options={workLocationData}
              getOptionLabel={(option) => option.description}
              renderInput={(params) => (
                <MDInput
                  placeholder="Çalışma Yerleri Seçiniz"
                  {...params}
                  inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                />
              )}
              //isOptionEqualToValue={(option, value) => option.id === value.id}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              value={workLocation} // seleted value
              onChange={(event, value) => setWorkLocation(value)}
            />
          </MDBox>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <MDBox mb={1}>
                <MDTypography variant="caption" fontWeight="bold" color="text">
                  Başlangıç Tarihi
                </MDTypography>
                <MDInput
                  type="date"
                  variant="outlined"
                  fullWidth
                  placeholder=""
                  value={start}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setStart(e.target.value)}
                />
              </MDBox>
            </Grid>
            <Grid item xs={6}>
              <MDBox mb={1}>
                <MDTypography variant="caption" fontWeight="bold" color="text">
                  Bitiş Tarihi
                </MDTypography>
                <MDInput
                  type="date"
                  variant="outlined"
                  fullWidth
                  placeholder=""
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
          {/* <MDBox mb={2}>
            <MDTypography variant="caption" fontWeight="bold" color="text">
              Yoğunluk Giriniz
            </MDTypography>
            <MDInput
              type="number"
              placeholder="Yoğunluk Giriniz"
              fullWidth
              value={density}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDensity(Number(e.target.value))}
            />
          </MDBox> */}
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
              Güncelle
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    </Modal>
  );
}
