import {
  Autocomplete,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Button,
  Divider,
  FormControl,
  Chip,
  Typography,
  Tooltip,
} from "@mui/material";
import { CheckBox, MessageBoxType } from "@ui5/webcomponents-react";
import MDBox from "components/MDBox";
import MDEditor from "components/MDEditor";
import MDEditorRoot from "components/MDEditor/MDEditorRoot";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import FormField from "layouts/applications/wizard/components/FormField";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import React, { useEffect, useState, useRef } from "react";
import MDAvatar from "components/MDAvatar";
import htmr from "htmr";
import {
  TicketApi,
  TicketDepartmentsApi,
  TicketInsertDto,
  TicketUpdateDto,
  TicketPriority,
  TicketSLA,
  TicketCommentDto,
  TicketSubject,
  TicketTeamApi,
  TicketTeamListDto,
  TicketProjectsApi,
  TicketType,
  UserApi,
  UserAppDto,
  WorkCompanyApi,
  WorkCompanyDto,
  WorkCompanySystemInfoApi,
  WorkCompanySystemInfoListDto,
  TicketCommentInsertDto,
  TicketDepartmensListDto,
  TicketStatus,
  TicketAssigneDto,
  TicketManagerUpdateDto,
  WorkFlowStartApiDto,
  WorkFlowApi,
  TicketNotificationsListDto,
  UserApp,
  TicketProjectsListDto,
} from "api/generated";
import { useBusy } from "layouts/pages/hooks/useBusy";
import getConfiguration from "confiuration";
import MDButton from "components/MDButton";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import "./index.css";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Footer from "examples/Footer";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import GetAppIcon from "@mui/icons-material/GetApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { encode as htmlEntitiesEncode, decode as htmlEntitiesDecode } from "html-entities";
import { TabMenu } from "primereact/tabmenu";
import TimelineComponent from "layouts/pages/Components/MessageBox/timeline";
import { selectError } from "@formio/react";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { title } from "process";
import { useTranslation } from "react-i18next";

interface subjectHelp {
  id: TicketSubject;
  name: string;
  description: string;
}
interface slaPlan {
  id: TicketSLA;
  name: string;
  description: string;
}
interface ticketType {
  id: TicketType;
  name: string;
  description: string;
}
interface ticketPriority {
  id: TicketPriority;
  name: string;
  description: string;
}
interface createTicketProps {
  idSolveTicket?: string;
  isSolveTicket?: boolean;
}
interface statusData {
  id: TicketStatus;
  name: string;
  description: string;
}

function CreateRequest({ ...rest }: createTicketProps) {
  const [searchByName, setSearchByName] = useState<UserAppDto[]>([]);
  // const { id } = useParams();
  const { ticketId } = useParams(); // URL'den ID
  const { fromApr } = useParams(); // URL'den ID

  // const location = useLocation();
  // const { review } = location.state || {};
  // const id = ticketId || location.state?.ticketId; // ID varsa kullan
  // const checkApr = fromApr || location.state?.fromApr;
  // const { idSolveTicket, isSolveTicket } = rest;
  // const dispatchAlert = useAlert();
  // const navigate = useNavigate();
  // const { t } = useTranslation();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const storedTicketId = sessionStorage.getItem("ticketId");
  const id = storedTicketId;
  const { review } = location.state || {};
  const checkApr = fromApr || location.state?.fromApr;
  const { idSolveTicket, isSolveTicket } = rest;
  const dispatchAlert = useAlert();
  const navigate = useNavigate();
  // navigate("",op)
  const { t } = useTranslation();

  const [selectedKullanici, setSelectedKullanici] = useState(null);
  const [slaPlan, setSlaPlan] = useState<slaPlan[]>([]);
  const [subjectHelp, setsubjectHelp] = useState<subjectHelp[]>([]);
  const [ticketType, setTicketType] = useState<ticketType[]>([]);
  const [ticketPriority, setTicketPriority] = useState<ticketPriority[]>([]);

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectionPerson, setSelectionPerson] = useState(null);
  const [checkBox, setCheckBox] = useState(false);

  const [companyData, setCompanyData] = useState<WorkCompanyDto[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<WorkCompanyDto>(null);
  const [selectedToCompany, setselectedToCompany] = useState<WorkCompanyDto>(null);
  const [encodedHtml, setEncodedHtml] = useState("");
  const [systemData, setSystemData] = useState<WorkCompanySystemInfoListDto[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<WorkCompanySystemInfoListDto>(null);
  const [ticketForm, setTicketForm] = useState<TicketInsertDto>({
    title: "",
    description: "",
    workCompanyId: "",
    workCompanySystemInfoId: "",
    userAppId: "",
    type: null,
    ticketSLA: null,
    ticketSubject: null,
    priority: null,
    isSend: false,
    ticketComment: [],
    ticketCode: "",
    customerRefId: "",
  });
  const [updatedTicketForm, setUpdatedTicketForm] = useState<TicketUpdateDto>(null);
  const [selectedTicketPriority, setSelectedTicketPriority] = useState<ticketPriority>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<ticketType>(null);
  const [selectedTicketSLA, setSelectedTicketSLA] = useState<slaPlan>(null);
  const [selectedSubject, setSelectedSubject] = useState<subjectHelp>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatchBusy = useBusy();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [newSelectedFiles, setNewSelectedFiles] = useState<File[]>([]);
  const [newCommentBody, setNewCommentBody] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const items = [
    {
      label: t("ns1:TicketDetailPage.TicketDetailPage.TicketDetailNavBarProps.MevcutTalep"),
      icon: "pi pi-check",
    },
    {
      label: t("ns1:TicketDetailPage.TicketDetailPage.TicketDetailNavBarProps.YonlendirmeGecmisi"),
      icon: "pi pi-history",
    },
    isSolveTicket && !review
      ? {
          label: t("ns1:TicketDetailPage.TicketDetailPage.TicketDetailNavBarProps.TalepGuncelleme"),
          icon: "pi pi-cog",
        }
      : null,
  ].filter(Boolean);

  const [teamData, setTeamData] = useState<TicketTeamListDto[]>([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [departmentData, setDepartmentData] = useState<TicketDepartmensListDto[]>([]);
  const [projectData, setProjectData] = useState<TicketProjectsListDto[]>([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [statusData, setStatusData] = useState<statusData[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<statusData>(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hasPerm, setHasPerm] = useState(false);
  const [nameOfAssigned, setNameOfAssigned] = useState("");
  const [selectedTicketNo, setSelectedTicketNo] = useState("");
  const [assingDesc, setassingDesc] = useState("");
  const [flagBoolean, setFlagBoolean] = useState(true);
  const [ticketTitleText, setTicketTitleText] = useState("");
  const [selectedIlgiliPerson, setSelectedIlgiliPerson] = useState<UserAppDto[]>([]);
  const [selectionIlgiliPerson, setSelectionIlgiliPerson] = useState<string[]>([]);
  // Add loading state
  const [isLoading, setIsLoading] = useState(true);
  const [assignHistory, setAssignHistory] = useState<any[]>([]);

  const [canEdit, setCanEdit] = useState(true);
  const { source } = useParams<{ source: "gelen" | "olusturdugum" }>();

  const [canEditTicket, setCanEditTicket] = useState(false);

  useEffect(() => {
    console.log(source);
    // oluşturduğum taleplerden gelindi
  }, [source]);
  const fetchFlagBoolean = async () => {
    try {
      const conf = getConfiguration();
      const api = new TicketApi(conf);
      // const data = await api.apiTicketFlagBooleanGet();
      // setFlagBoolean(data.data.flagBoolean);
    } catch (error) {
      dispatchAlert({ message: "Hata oluştu " + error, type: MessageBoxType.Error });
    }
  };

  useEffect(() => {
    const fetchUserAppName = async () => {
      if (!id) {
        const conf = getConfiguration();
        const api = new TicketApi(conf);
        const data = await api.apiTicketCheckPermGet();

        setHasPerm(data.data.perm);

        setSelectedKullanici({
          userAppId: data.data.id,
          userAppName: data.data.name,
        });

        setTicketForm((prevForm) => ({
          ...prevForm,
          userAppId: data.data.id,
        }));
      }
      if (id != null) {
        await getAssignHistory();
      }
    };
    fetchUserAppName();
  }, []);

  const handleAssignTicket = async () => {
    try {
      dispatchBusy({ isBusy: true });
      ticketForm.ticketComment = [];
      var conf = getConfiguration();
      var api = new TicketApi(conf);
      var assignDataDTO: TicketManagerUpdateDto;
      if (!assingDesc || assingDesc.trim() == "") {
        dispatchAlert({
          message: "Lütfen güncelleme nedenini yazınız.",
          type: MessageBoxType.Warning,
        });
        dispatchBusy({ isBusy: false });
        return;
      }
      if (selectedStatus.id != 10) {
        if (nameOfAssigned == "" || nameOfAssigned == "Atama Yok") {
          if (selectedPerson == null && !checkBox) {
            dispatchAlert({
              message: "Lütfen atanılan kişi veya talep seçiniz.",
              type: MessageBoxType.Warning,
            });
            dispatchBusy({ isBusy: false });
            return;
          }
        }
      }
      if (checkBox && selectedTeam) {
        assignDataDTO = {
          managerDto: {
            ...ticketForm,
            id: id,
            ticketDepartmentId: selectedDepartment.id,
            status: selectedStatus.id,
            estimatedDeadline: selectedDate,
            ticketProjectId: selectedProject?.id ? selectedProject.id : null,
          },
          assigngDto: {
            ticketsId: id,
            isActive: true,
            description: assingDesc,
            ticketTeamID: selectedTeam.id,
          },
          notificationsInsertDtos: selectedIlgiliPerson?.length
            ? selectedIlgiliPerson.map((item) => ({
                ticketId: id,
                userAppId: item.id,
              }))
            : [],
        };
      } else if (!checkBox && selectedPerson) {
        assignDataDTO = {
          managerDto: {
            ...ticketForm,
            id: id,
            ticketDepartmentId: selectedDepartment.id,
            status: selectedStatus.id,
            estimatedDeadline: selectedDate,
            ticketProjectId: selectedProject?.id ? selectedProject.id : null,
          },
          assigngDto: {
            ticketsId: id,
            isActive: true,
            userAppId: selectedPerson.id,
            description: assingDesc,
          },
          notificationsInsertDtos: selectedIlgiliPerson?.length
            ? selectedIlgiliPerson.map((item) => ({
                ticketId: id,
                userAppId: item.id,
              }))
            : [],
        };
      } else {
        assignDataDTO = {
          managerDto: {
            ...ticketForm,
            id: id,
            ticketDepartmentId: selectedDepartment.id,
            status: selectedStatus.id,
            estimatedDeadline: selectedDate,
            ticketProjectId: selectedProject?.id ? selectedProject.id : null,
          },
          assigngDto: {
            ticketsId: id,
            isActive: true,
            description: assingDesc,
          },
          notificationsInsertDtos: selectedIlgiliPerson?.length
            ? selectedIlgiliPerson.map((item) => ({
                ticketId: id,
                userAppId: item.id,
              }))
            : [],
        };
      }

      console.log("assignDataDTO", assignDataDTO);
      await api.apiTicketAssignPost(assignDataDTO);
      dispatchAlert({ message: "Talep başarıyla güncellendi", type: MessageBoxType.Success });
      navigate("/solveAllTicket/");
      dispatchBusy({ isBusy: false });
    } catch (error) {
      dispatchAlert({
        message: "Talep atanırken bir hata oluştu " + error,
        type: MessageBoxType.Error,
      });
      console.log("error", error);
      dispatchBusy({ isBusy: false });
    }
  };

  useEffect(() => {}, [ticketForm]);

  const fetchStatusData = async () => {
    dispatchBusy({ isBusy: true });
    var conf = getConfiguration();
    var api = new TicketApi(conf);
    var data = await api.apiTicketTicketStatusGet();
    var statData = data.data as any;
    setStatusData(statData.filter((item: any) => item.id !== 2 && item.id !== 1));
    // setStatusData(data.data as any);
    dispatchBusy({ isBusy: false });
  };

  const fetchDepartmentData = async () => {
    dispatchBusy({ isBusy: true });
    var conf = getConfiguration();
    var api = new TicketDepartmentsApi(conf);
    var data = await api.apiTicketDepartmentsAllOnlyNameGet();
    setDepartmentData(data.data as any);
    dispatchBusy({ isBusy: false });
  };

  // const fetchTicketProjectsData = async () => {
  //   dispatchBusy({ isBusy: true });
  //   var conf = getConfiguration();
  //   var api = new TicketProjectsApi(conf);
  //   var data = await api.apiTicketProjectsGet();
  //   setProjectData(data.data as any);
  //   dispatchBusy({ isBusy: false });
  // };

  const fetchTeamData = async () => {
    try {
      dispatchBusy({ isBusy: true });
      const conf = getConfiguration();
      const api = new TicketTeamApi(conf);
      const data = await api.apiTicketTeamWithoutTeamGet();

      setTeamData(data.data);
      dispatchBusy({ isBusy: false });
    } catch (error) {
      dispatchAlert({ message: "Hata oluştu " + error, type: MessageBoxType.Error });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const fetchTicketAndCompanyData = async () => {
    setIsLoading(true); // Set loading at start
    dispatchBusy({ isBusy: true });
    try {
      const conf = getConfiguration();
      const companyApi = new WorkCompanyApi(conf);
      const ticketApi = new TicketApi(conf);

      // Fetch company data
      const companyData = await companyApi.apiWorkCompanyGetAssingListGet();
      setCompanyData(companyData.data);

      if (id) {
        const dataTicket = await ticketApi.apiTicketCheckPermGet();
        setCanEditTicket(dataTicket.data.canEditTicket);

        // Get ticket data once
        const ticketResponse = await ticketApi.apiTicketIdGet(id);
        const ticketData = ticketResponse.data;
        console.log("ticketData", ticketData);

        if (
          ticketData.status == 1 ||
          ticketData.status == 9 ||
          ticketData.status == 10 ||
          ticketData.status == 11 ||
          ticketData.status == 12
        ) {
          setCanEditTicket(false);
        }

        setSelectedTicketNo(ticketData.ticketNumber.toString());
        setTicketTitleText(ticketData.title);
        // Set company related data
        const selectedCompanyData = companyData.data.find((c) => c.id === ticketData.workCompanyId);
        setSelectedCompany({
          id: ticketData.workCompanyId,
          name: selectedCompanyData?.name,
        });

        if (ticketData.addedMailAddresses != null && ticketData.addedMailAddresses != "") {
          setCcEmails(ticketData.addedMailAddresses.split(";"));
        }

        var relUsers: UserApp[] = [];
        if (ticketData.ticketNotificationsListDto) {
          ticketData.ticketNotificationsListDto.forEach((item) => {
            relUsers.push(item.user);
          });
        }
        setSelectedIlgiliPerson(relUsers);

        if (ticketData.customerRefId != "" && ticketData.customerRefId != null) {
          const selectedCustCompanyData = companyData.data.find(
            (c) => c.id === ticketData.customerRefId
          );
          setselectedToCompany({
            id: ticketData.customerRefId,
            name: selectedCustCompanyData?.name,
          });

          // BURADA PROJELER DATASINI GETİR VE SEÇİLİ YAP
          var api = new TicketProjectsApi(conf);
          var data = await api.apiTicketProjectsGetActiveProjectsGet(ticketData.customerRefId);
          setProjectData(data.data as any);
          setSelectedProject(ticketData.ticketProjectId);

          // Fetch system data for the selected company
          const systemApi = new WorkCompanySystemInfoApi(conf);
          const systemResponse = await systemApi.apiWorkCompanySystemInfoByCompanyIdIdGet(
            ticketData.customerRefId
          );
          setSystemData(systemResponse.data);

          if (
            ticketData.workCompanySystemInfoId != "" &&
            ticketData.workCompanySystemInfoId != null
          ) {
            setSelectedSystem({
              id: ticketData.workCompanySystemInfoId,
              name: systemResponse.data.find((s) => s.id === ticketData.workCompanySystemInfoId)
                ?.name,
            });
          }

          setTicketForm((prevForm) => ({
            ...prevForm,
            customerRefId: ticketData.customerRefId,
          }));
        }

        // setassingDesc(ticketData.assigneDescription);

        setCanEdit(ticketData.canEdit);
        console.log("edit", ticketData.canEdit);
        if (checkApr) {
          setCanEdit(false);
        }

        // Set all ticket-related data
        setIsOpen(ticketData.status > 1);

        if (ticketData.userAppId && ticketData.userAppName) {
          setSelectedKullanici({
            userAppId: ticketData.userAppId,
            userAppName: ticketData.userAppName,
          });
        }

        setSelectedTicketType({
          id: ticketData.type,
          name: ticketData.typeText,
          description: ticketData.typeText,
        });

        setSelectedSubject({
          id: ticketData.ticketSubject,
          name: ticketData.ticketSubjectText,
          description: ticketData.ticketSubjectText,
        });

        setSelectedTicketSLA({
          id: ticketData.ticketSLA,
          name: ticketData.ticketSLAText,
          description: ticketData.ticketSLAText,
        });

        setSelectedTicketPriority({
          id: ticketData.priority,
          name: ticketData.priorityText,
          description: ticketData.priorityText,
        });

        setTicketForm((prevForm) => ({
          ...prevForm,
          priority: ticketData.priority,
          type: ticketData.type,
          ticketSLA: ticketData.ticketSLA,
          ticketSubject: ticketData.ticketSubject,
          userAppId: ticketData.userAppId,
          workCompanyId: ticketData.workCompanyId,
          workCompanySystemInfoId: ticketData.workCompanySystemInfoId,
          ticketComment: ticketData.ticketComment || [],
          ticketCode: ticketData.ticketCode,
          title: ticketData.title,
        }));

        //ticketAssigneText
        setSelectedStatus({
          id: ticketData.status,
          name: ticketData.statusText,
          description: ticketData.statusText,
        });

        setSelectedDate(ticketData.estimatedDeadline);
        if (ticketData.ticketProjectId != null && ticketData.ticketProjectId != "") {
          setSelectedProject({
            id: ticketData.ticketProjectId,
            name: ticketData.ticketprojectName,
          });
        }

        setSelectedDepartment({
          id: ticketData.ticketDepartmentId,
          departmentText: ticketData.ticketDepartmentText,
        });

        setNameOfAssigned(ticketData.ticketAssigneText);

        setEncodedHtml("");
        setSelectedFiles([]);
      } else {
        // Handle new ticket case

        var userApi = new UserApi(conf);
        var userCompany = await userApi.apiUserUserCompanyGet();

        setSelectedCompany(companyData.data.find((e) => e.id == userCompany.data.workCompanyId));
        setTicketForm((prevForm) => ({
          ...prevForm,
          workCompanyId: companyData.data.find((e) => e.id == userCompany.data.workCompanyId).id,
        }));

        // Fetch system data for default company
        const systemApi = new WorkCompanySystemInfoApi(conf);
        const systemResponse = await systemApi.apiWorkCompanySystemInfoByCompanyIdIdGet(
          companyData.data[0].id
        );
        // setSystemData(systemResponse.data);
        // setSelectedSystem(systemResponse.data[0]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      dispatchBusy({ isBusy: false });
      setIsLoading(false); // Set loading complete
    }
  };
  const formatDateForInput = (dateString: string) => {
    return dateString ? dateString.split("T")[0] : "";
  };
  const fetchSystemData = async () => {
    if (!id) {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new WorkCompanySystemInfoApi(conf);
      var data = await api.apiWorkCompanySystemInfoByCompanyIdIdGet(selectedToCompany.id);
      setSystemData(data.data as any); // boş olsa bile boş gösteriyoruz
      if (data.data.length > 0) {
        setSelectedSystem(data.data[0]); // default olarak ilk sistem seçiliyor
        setTicketForm((prevForm) => ({
          ...prevForm,
          workCompanySystemInfoId: data.data[0].id,
        }));
      } else {
        setSelectedSystem(null);
        ticketForm.workCompanySystemInfoId = ""; // boş olursa null set ediyoruz
      }

      dispatchBusy({ isBusy: false });
    }
  };

  const handleSearchByName = async (value: string) => {
    if (value === "") {
      setSearchByName([]);
    } else {
      dispatchBusy({ isBusy: true });

      var conf = getConfiguration();
      var api = new UserApi(conf);
      var data = await api.apiUserGetAllUsersWitNameAssignGet(value);
      var pureData = data.data;
      setSearchByName(pureData);

      dispatchBusy({ isBusy: false });
    }
  };

  const fetchDetail = async () => {
    var conf = getConfiguration();
    var api = new TicketApi(conf);
    var data = await api.apiTicketTicketSubjectGet();
    setsubjectHelp(data.data as any);
    data = await api.apiTicketTicketSLAGet();
    setSlaPlan(data.data as any);
    data = await api.apiTicketTicketTypeGet();
    setTicketType(data.data as any);
    data = await api.apiTicketTicketPrioritiesGet();
    setTicketPriority(data.data as any);
  };

  useEffect(() => {
    const initializeSolutionData = async () => {
      if (isSolveTicket && teamData.length === 0) {
        try {
          const promises = [
            fetchTeamData(),
            fetchDepartmentData(),
            fetchStatusData(),
            fetchFlagBoolean(),
          ];
          await Promise.all(promises);
        } catch (error) {
          console.error("Error initializing data:", error);
          // Handle error appropriately
        }
      }
    };

    if (activeIndex === 1 || activeIndex === 2) {
      initializeSolutionData();
    }
  }, [activeIndex]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const promises = [fetchTicketAndCompanyData(), fetchDetail()];
        await Promise.all(promises);
      } catch (error) {
        console.error("Error initializing data:", error);
        // Handle error appropriately
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      const loadSystemData = async () => {
        try {
          await fetchSystemData();
        } catch (error) {
          console.error("Error loading system data:", error);
          // Handle error appropriately
        }
      };
      loadSystemData();
    }
  }, [selectedCompany]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleCreateTicket = async (isSend: boolean) => {
    try {
      dispatchBusy({ isBusy: true });
      setLoading(true);
      setIsSubmitting(true);
      if (!ticketForm.ticketSubject) {
        dispatchAlert({
          message: "Yardım Konusu Alanı Boş Bırakılamaz..!",
          type: MessageBoxType.Warning,
        });
        return;
      }
      if (!ticketForm.ticketSLA) {
        dispatchAlert({
          message: "SLA Planı Alanı Boş Bırakılamaz..!",
          type: MessageBoxType.Warning,
        });
        return;
      }
      if (!ticketForm.type) {
        dispatchAlert({
          message: "Talep Tipi Alanı Boş Bırakılamaz..!",
          type: MessageBoxType.Warning,
        });
        return;
      }
      if (!ticketForm.priority) {
        dispatchAlert({
          message: "Talep Önceliği Alanı Boş Bırakılamaz..!",
          type: MessageBoxType.Warning,
        });
        return;
      }
      if (!ticketForm.customerRefId) {
        dispatchAlert({
          message: "Müşteri Alanı Boş Bırakılamaz..!",
          type: MessageBoxType.Warning,
        });
        return;
      }
      if (!ticketForm.userAppId) {
        dispatchAlert({
          message: "Talep Atanacak Kullanıcı Seçilmedi..!",
          type: MessageBoxType.Warning,
        });
        return;
      }
      if (!ticketForm.workCompanyId) {
        dispatchAlert({
          message: "Şirket Seçilmedi..!",
          type: MessageBoxType.Warning,
        });
        return;
      }
      if (!ticketForm.title) {
        dispatchAlert({
          message: "Talep Başlığı Alanı Boş Bırakılmaz..!",
          type: MessageBoxType.Warning,
        });
        return;
      }

      const spaceCheck = encodedHtml
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/&nbsp;/g, "")
        .trim();
      if (!encodedHtml || spaceCheck == "") {
        dispatchAlert({
          message: "Lütfen taleple ilgili açıklama ekleyiniz..!",
          type: MessageBoxType.Warning,
        });
        return;
      }

      // Only proceed with comment creation if there's content or files
      if (encodedHtml || newSelectedFiles.length > 0) {
        // Convert all files to base64
        const filePromises: Promise<any>[] = newSelectedFiles.map(async (file) => ({
          fileName: file.name,
          base64: await fileToBase64(file),
          fileType: file.type,
        }));

        const fileDataArray = await Promise.all(filePromises);

        // Create new comment
        const newComment = {
          body: encodedHtml,
          files: fileDataArray,
        };

        // Combine existing comments with new comment
        const updatedTicketComments = [...ticketForm.ticketComment, newComment];

        var conf = getConfiguration();
        var api = new TicketApi(conf);
        await api.apiTicketPost(1, null, {
          ...ticketForm,
          isFromEmail: false,
          isSend: isSend,
          ticketComment: updatedTicketComments,
          addedMailAddresses: ccEmails.join(";"),
        });
      } else {
        // If no comment content or files, just send the ticket without comments
        var conf = getConfiguration();
        var api = new TicketApi(conf);
        await api.apiTicketPost(1, null, {
          ...ticketForm,
          isFromEmail: false,
          isSend: isSend,
          ticketComment: [],
          addedMailAddresses: ccEmails.join(";"),
        });
      }

      dispatchAlert({ message: "Talep başarıyla oluşturuldu", type: MessageBoxType.Success });
      isSolveTicket ? navigate("/solveAllTicket/") : navigate("/tickets");
    } catch (error) {
      dispatchAlert({
        message: "Talep oluşturulurken bir hata oluştu " + error,
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setUpdatedTicketForm({
      id: id,
      description: ticketForm.description,
      title: ticketForm.title,
      type: ticketForm.type,
      ticketSLA: ticketForm.ticketSLA,
      ticketSubject: ticketForm.ticketSubject,
      priority: ticketForm.priority,
      userAppId: ticketForm.userAppId,
      isSend: ticketForm.isSend,
      workCompanyId: ticketForm.workCompanyId,
      ticketCode: ticketForm.ticketCode,
      workCompanySystemInfoId: ticketForm.workCompanySystemInfoId,
      customerRefId: ticketForm.customerRefId,
    });
  }, [ticketForm]);

  const handleUpdateTicket = async (isSend?: boolean, isEdit?: boolean) => {
    try {
      dispatchBusy({ isBusy: true });

      if (!ticketForm.ticketSubject) {
        dispatchAlert({
          message: "Yardım Konusu Alanı Boş Bırakılamaz..!",
          type: MessageBoxType.Warning,
        });
        return;
      }
      if (!ticketForm.ticketSLA) {
        dispatchAlert({
          message: "SLA Planı Alanı Boş Bırakılamaz..!",
          type: MessageBoxType.Warning,
        });
        return;
      }
      if (!ticketForm.type) {
        dispatchAlert({
          message: "Talep Tipi Alanı Boş Bırakılamaz..!",
          type: MessageBoxType.Warning,
        });
        return;
      }
      if (!ticketForm.priority) {
        dispatchAlert({
          message: "Talep Önceliği Alanı Boş Bırakılamaz..!",
          type: MessageBoxType.Warning,
        });
        return;
      }
      if (!ticketForm.userAppId) {
        dispatchAlert({
          message: "Talep Atanacak Kullanıcı Seçilmedi..!",
          type: MessageBoxType.Warning,
        });
        return;
      }
      if (!ticketForm.workCompanyId) {
        dispatchAlert({
          message: "Şirket Seçilmedi..!",
          type: MessageBoxType.Warning,
        });
        return;
      }
      if (!ticketForm.title) {
        dispatchAlert({
          message: "Talep Başlığı Alanı Boş Bırakılmaz..!",
          type: MessageBoxType.Warning,
        });
        return;
      }

      var conf = getConfiguration();
      var api = new TicketApi(conf);

      if (isOpen == false && isSend == true) {
        //talep taslak ise
        await api.apiTicketUpdateStartTicketPost(1, false, {
          ...updatedTicketForm,
          isSend: isSend,
          ticketDepartmentId: selectedDepartment.id,
          addedMailAddresses: ccEmails.join(";"),
        });
        dispatchAlert({ message: "Talep başarıyla güncellendi", type: MessageBoxType.Success });
        isSolveTicket ? navigate("/solveAllTicket/") : navigate("/tickets");
      } else if (isOpen == true && isSend == true && isEdit == true) {
        // edit secenegi isaretli ise
        await api.apiTicketUpdateStartTicketPost(1, true, {
          ...updatedTicketForm,
          isSend: isSend,
          ticketDepartmentId: selectedDepartment.id,
          addedMailAddresses: ccEmails.join(";"),
        });
        dispatchAlert({ message: "Talep başarıyla güncellendi", type: MessageBoxType.Success });
        isSolveTicket ? navigate("/solveAllTicket/") : navigate("/tickets");
      } else if (isSend == false) {
        await api.apiTicketPut({
          ...updatedTicketForm,
          isSend: isSend,
          ticketDepartmentId: selectedDepartment.id,
          addedMailAddresses: ccEmails.join(";"),
        });
        dispatchAlert({ message: "Talep başarıyla güncellendi", type: MessageBoxType.Success });
        isSolveTicket ? navigate("/solveAllTicket/") : navigate("/tickets");
      }
    } catch (error) {
      dispatchAlert({
        message: "Talep güncellenirken bir hata oluştu " + error,
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const handleChangeText = (value: string) => {
    setEncodedHtml(value);
    setNewCommentBody(value);
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ color: [] as string[] }, { background: [] as string[] }],
        [{ font: [] as string[] }],
        [{ align: [] as string[] }],
        ["clean"],
        ["link", "image"],
      ] as const,
    },
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "direction",
    "color",
    "background",
    "font",
    "size",
    "script",
  ];

  const quillRef = useRef(null);

  const parseUserName = (name: string) => {
    if (!name) return { firstName: "", lastName: "" };
    const nameParts = name.split(" ");
    return {
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(" "),
    };
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const maxFileSize = 10 * 1024 * 1024; //10mb

      const validFiles: any[] = [];
      const oversizedFiles = [];

      Array.from(files).forEach((file) => {
        if (file.size <= maxFileSize) {
          validFiles.push(file);
        } else {
          oversizedFiles.push(file);
        }
      });

      if (oversizedFiles.length > 0) {
        dispatchAlert({
          message: "Dosya boyutu çok büyük. Maksimum izin verilen boyut 10MB.",
          type: MessageBoxType.Warning,
        });
      }

      if (validFiles.length > 0) {
        setNewSelectedFiles((prev) => [...prev, ...validFiles]);
      }
    }

    event.target.value = "";
  };

  const handleDownload = async (file: any) => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new TicketApi(conf);
      var base64response = await api.apiTicketGetFileGet(file.id);

      const byteCharacters = atob(base64response.data.base64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: file.fileType || "application/octet-stream" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.fileName || "download";
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      dispatchBusy({ isBusy: false });
    } catch (error) {
      dispatchAlert({
        message: "Dosya indirilirken bir hata oluştu " + error,
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const handleDeleteFile = (file: File) => {
    setNewSelectedFiles(newSelectedFiles.filter((f) => f !== file));
  };

  const sendComment = async () => {
    try {
      dispatchBusy({ isBusy: true });

      const filePromises: Promise<any>[] = newSelectedFiles.map(async (file) => ({
        fileName: file.name,
        base64: await fileToBase64(file),
        fileType: file.type,
      }));

      const fileDataArray = await Promise.all(filePromises);

      const newComment: TicketCommentInsertDto = {
        body: encodedHtml,
        files: fileDataArray,
      };
      var conf = getConfiguration();
      var api = new TicketApi(conf);
      await api.apiTicketAddCommentPost(id, newComment);
      dispatchAlert({
        message: "Açıklama gönderildi",
        type: MessageBoxType.Success,
      });

      setNewCommentBody("");
      await fetchTicketAndCompanyData();
      renderOldTextAndFiles();
      // isSolveTicket ? navigate("/solveAllTicket/") : navigate("/tickets");
    } catch (error) {
      dispatchAlert({
        message: "Açıklama gönderirken bir hata oluştu " + error,
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const onChangeToCompany = async (id: any) => {
    const conf = getConfiguration();
    const systemApi = new WorkCompanySystemInfoApi(conf);
    const systemResponse = await systemApi.apiWorkCompanySystemInfoByCompanyIdIdGet(id);
    setSystemData(systemResponse.data);
    setSelectedSystem(null);
    setTicketForm({ ...ticketForm, workCompanySystemInfoId: null, customerRefId: id });
  };

  const renderOldTextAndFiles = () => {
    return (
      <MDBox>
        <TimelineComponent
          ticketFormComment={ticketForm.ticketComment}
          handleDownload={handleDownload}
        />
      </MDBox>
    );
  };

  const getAssignHistory = async () => {
    const conf = getConfiguration();
    const ticketApi = new TicketApi(conf);

    var res = await ticketApi.apiTicketGetAssingListGet(id);
    res.data.forEach((item) => {
      item.createDate = format(new Date(item.createDate), "dd.MM.yyyy HH:mm:ss", { locale: tr });
    });
    setAssignHistory(res.data.reverse());
  };
  const getStatusColor = (value: any) => {
    const colors = [
      "#607D8B", // blue grey
      "#4CAF50", // green
      "#3F51B5", // indigo
      "#2196F3", // blue
      "#9C27B0", // purple
      "#00BCD4", // cyan
      "#795548", // brown
      "#ffaa00", // orange
      "#009688", // teal
      "#E91E63", // pink
      "#df1c1a", // deep orange
    ];
    return colors[value - 1];
  };
  const createAssignTimeLine = () => {
    if (assignHistory.length == 0) {
      return (
        <Typography style={{ marginBottom: "24px" }} variant="body1" align="center">
          {t("ns1:TicketDetailPage.TimeLine.TalepGeçmişiBulunmamaktadır")}
        </Typography>
      );
    } else {
      return (
        <Timeline>
          {assignHistory.map((event, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent style={{ fontSize: "16px" }}>
                <span style={{ fontSize: "14px", color: "#888" }}>
                  {t("ns1:TicketDetailPage.TimeLine.İşlemZamani")}:
                </span>{" "}
                {event.createDate}
                <div style={{ fontSize: "14px", color: "#888" }}>
                  {t("ns1:TicketDetailPage.TimeLine.İşlemYapan")} ({event.createdBy})
                </div>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <Tooltip title={event.status}>
                  <TimelineDot style={{ backgroundColor: getStatusColor(event.statusId) }} />
                </Tooltip>
                {index !== assignHistory.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent style={{ fontSize: "16px" }}>
                <span style={{ fontSize: "14px", color: "#888" }}>
                  {t("ns1:TicketDetailPage.TimeLine.AtananKisiTakim")}:
                </span>{" "}
                {event.name}
                <div style={{ fontSize: "14px", color: "#888" }}>
                  {t("ns1:TicketDetailPage.TimeLine.Durum")} ({event.status})
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    fontStyle: "italic",
                    color: "#90d4fd",
                  }}
                >
                  {t("ns1:TicketDetailPage.TimeLine.Aciklama")}: {event.description}
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      );
    }
  };

  const getMimeTypeFromBase64 = (base64: string): string | null => {
    const result = /^data:(.*);base64,/.exec(base64);
    return result ? result[1] : null;
  };

  const getExtensionFromMimeType = (mimeType: string): string => {
    const map: { [key: string]: string } = {
      "application/pdf": "pdf",
      "image/png": "png",
      "image/jpeg": "jpg",
    };
    return map[mimeType] || "bin";
  };

  const downloadBase64File = (base64Data: string) => {
    const mimeType = "application/pdf"; // Manuel olarak PDF olduğunu belirtiyoruz
    const fileExtension = "pdf"; // Aynı şekilde uzantı da sabitleniyor
    const fileName = `Talep#${selectedTicketNo}.${fileExtension}`;

    const base64String = base64Data.includes(",") ? base64Data.split(",")[1] : base64Data;
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      byteArrays.push(new Uint8Array(byteNumbers));
    }

    const blob = new Blob(byteArrays, { type: mimeType });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    window.URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    dispatchBusy({ isBusy: true });
    var conf = getConfiguration();
    var api = new TicketApi(conf);
    var data = await api.apiTicketGetTicketPdfIdGet(id);
    var pdfData = data.data as any;

    downloadBase64File(pdfData);
    dispatchBusy({ isBusy: false });
  };

  const [ccEmails, setCcEmails] = useState<string[]>([]);
  const [ccInputValue, setCcInputValue] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleAddCcEmail = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const trimmed = ccInputValue.trim();

      if (!validateEmail(trimmed)) {
        dispatchAlert({
          message: `Lütfen geçerli bir e-posta adresi girin.`,
          type: MessageBoxType.Error,
        });
        return;
      }

      if (ccEmails.includes(trimmed)) {
        dispatchAlert({
          message: `Girdiğiniz e-posta adresi zaten listede var.`,
          type: MessageBoxType.Error,
        });
        return;
      }

      setCcEmails((prev) => [...prev, trimmed]);
      setCcInputValue("");
    }
  };

  const removeCcEmail = (indexToRemove: number) => {
    setCcEmails((prev) => prev.filter((_, index) => index !== indexToRemove));
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid xs={12} lg={6} sx={{ paddingLeft: "3px" }} mt={3}>
        <Card>
          <MDBox p={2}>
            <MDBox mt={2}>
              {isSolveTicket ? (
                <MDBox ml={3}>
                  <MDTypography variant="h4">
                    {" "}
                    {t("ns1:TicketDetailPage.TicketDetailPage.TicketDetailPageNo")}:{" "}
                    {selectedTicketNo}
                  </MDTypography>
                  <TabMenu
                    model={items}
                    className="custom-tab-menu"
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      borderRadius: "8px",
                    }}
                    activeIndex={activeIndex}
                    onTabChange={(e) => setActiveIndex(e.index)}
                  />
                  <Divider sx={{ opacity: 1 }} />
                </MDBox>
              ) : (
                <>
                  <MDTypography variant="h4">
                    {" "}
                    {id === null || id === "" || id === undefined
                      ? t("ns1:TicketDetailPage.TicketDetailPage.TicketDetailNewTalep")
                      : ` ${t(
                          "ns1:TicketDetailPage.TicketDetailPage.TicketDetailPageNo"
                        )}: ${selectedTicketNo}`}
                  </MDTypography>
                  {id === null || id === "" || id === undefined ? null : (
                    <MDBox ml={3}>
                      <TabMenu
                        model={items}
                        className="custom-tab-menu"
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                          borderRadius: "8px",
                        }}
                        activeIndex={activeIndex}
                        onTabChange={(e) => setActiveIndex(e.index)}
                      />
                      <Divider sx={{ opacity: 1 }} />
                    </MDBox>
                  )}
                </>
              )}
            </MDBox>
          </MDBox>
          {activeIndex == 0 && (
            <MDBox p={3}>
              {" "}
              {id === null || id === "" || id === undefined ? (
                ""
              ) : (
                <MDBox px={3} display="flex" justifyContent="flex-end">
                  <MDButton variant="contained" color="primary" onClick={handleDownloadPdf}>
                    {t("ns1:TicketDetailPage.TicketDetailPage.TicketDetailPdf")}
                  </MDButton>
                </MDBox>
              )}
              <MDBox mt={2} p={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} lg={4}>
                    <MDBox mb={3}>
                      <MDTypography variant="h5" color="text">
                        {t(
                          "ns1:TicketDetailPage.TicketDetailPage.TicketDetailHeaderProps.KullaniciVeIsOrtaklari"
                        )}
                      </MDTypography>
                    </MDBox>
                    <Autocomplete
                      options={companyData}
                      disabled={isOpen || !hasPerm}
                      getOptionLabel={(option) => option.name}
                      sx={{ mb: 3.2 }}
                      value={selectedCompany}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      onChange={(event, newValue) => {
                        if (!newValue) return;
                        setTicketForm({ ...ticketForm, workCompanyId: newValue.id });
                        setSelectedCompany(newValue);
                      }}
                      renderInput={(params) => (
                        <MDInput
                          {...params}
                          size="large"
                          placeholder={t(
                            "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.Sirket"
                          )}
                          label={t(
                            "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.Sirket"
                          )}
                          inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                        />
                      )}
                    />
                    <Autocomplete
                      sx={{ mb: 3.2 }}
                      options={searchByName}
                      disabled={isOpen || !hasPerm}
                      getOptionLabel={(option) => {
                        if (option.firstName && option.lastName) {
                          return `${option.firstName} ${option.lastName}`;
                        }
                        return option.userAppName || "";
                      }}
                      value={selectedKullanici}
                      isOptionEqualToValue={(option, value) => {
                        if (!option || !value) return false;
                        return (
                          option.id === value.id ||
                          option.userAppId === value.id ||
                          option.id === value.userAppId
                        );
                      }}
                      onChange={(event, newValue) => {
                        if (newValue !== null) {
                          if (newValue.userAppName) {
                            setTicketForm({ ...ticketForm, userAppId: newValue.userAppId });
                            setSelectedKullanici(newValue);
                          } else {
                            setTicketForm({ ...ticketForm, userAppId: newValue.id });
                            setSelectedKullanici(newValue);
                          }
                        } else {
                          setTicketForm((prevForm) => ({
                            ...prevForm,
                            userAppId: null,
                          }));
                          setSelectedKullanici(null);
                        }
                      }}
                      onInputChange={(event, newInputValue) => {
                        handleSearchByName(newInputValue);
                      }}
                      renderInput={(params) => (
                        <MDInput
                          {...params}
                          size="large"
                          placeholder={t(
                            "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.Kullanici"
                          )}
                          label={t(
                            "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.Kullanici"
                          )}
                          inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                        />
                      )}
                      renderOption={(props, option) => {
                        return (
                          <li {...props} key={option.id} style={{ listStyle: "none" }}>
                            {" "}
                            <MDBox
                              onClick={() => setSelectedKullanici(option)}
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

                    {/* <Autocomplete
                    options={systemData}
                    disabled={isOpen}
                    sx={{ mb: 3.2 }}
                    getOptionLabel={(option) => option.name}
                    value={selectedSystem}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(event, newValue) => {
                      if (!newValue) return;
                      setTicketForm({ ...ticketForm, workCompanySystemInfoId: newValue.id });
                      setSelectedSystem(newValue);
                    }}
                    noOptionsText="Sistem bilgileri bulunmamaktadır"
                    renderInput={(params) => (
                      <MDInput
                        {...params}
                        size="large"
                        placeholder="Sistem Bilgileri"
                        label="Sistem Bilgileri"
                        inputProps={{ ...params.inputProps, sx: { height: "12px" } }}

                      />
                    )}
                  /> */}
                  </Grid>

                  <Grid lg={0.5} />
                  <Grid item xs={12} sm={6} lg={7.5}>
                    <MDBox mb={3}>
                      <MDTypography variant="h5" color="text">
                        {t(
                          "ns1:TicketDetailPage.TicketDetailPage.TicketDetailHeaderProps.KayitVeBilgiSecenekleri"
                        )}
                      </MDTypography>
                    </MDBox>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Autocomplete
                          options={subjectHelp}
                          // disabled={isOpen}
                          disabled={isOpen ? !canEditTicket : false}
                          value={selectedSubject}
                          getOptionLabel={(option) => option.description}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          onChange={(event, newValue) => {
                            if (!newValue) return;
                            setTicketForm({ ...ticketForm, ticketSubject: newValue.id });
                            setSelectedSubject(newValue);
                          }}
                          renderInput={(params) => (
                            <MDInput
                              {...params}
                              variant="outlined"
                              // label="Yardım Konusu"
                              label={
                                <span>
                                  {t(
                                    "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.YardimKonusu"
                                  )}{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </span>
                              }
                              placeholder={t(
                                "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.YardimKonusu"
                              )}
                              inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Autocomplete
                          options={slaPlan}
                          // disabled={isOpen}
                          disabled={isOpen ? !canEditTicket : false}
                          getOptionLabel={(option) => option.description}
                          value={selectedTicketSLA}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          onChange={(event, newValue) => {
                            if (!newValue) return;
                            setTicketForm({ ...ticketForm, ticketSLA: newValue.id });
                            setSelectedTicketSLA(newValue);
                          }}
                          renderInput={(params) => (
                            <MDInput
                              {...params}
                              variant="outlined"
                              // label="SLA Planı"
                              label={
                                <span>
                                  {t(
                                    "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.SLAPlani"
                                  )}{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </span>
                              }
                              placeholder={t(
                                "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.SLAPlani"
                              )}
                              inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Autocomplete
                          options={ticketType}
                          // disabled={isOpen}
                          disabled={isOpen ? !canEditTicket : false}
                          getOptionLabel={(option) => option.description}
                          value={selectedTicketType}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          onChange={(event, newValue) => {
                            if (!newValue) return;
                            setTicketForm({ ...ticketForm, type: newValue.id });
                            setSelectedTicketType(newValue);
                          }}
                          renderInput={(params) => (
                            <MDInput
                              {...params}
                              size="large"
                              placeholder={t(
                                "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.TalepTipi"
                              )}
                              // label="Talep Tipi"
                              label={
                                <span>
                                  {t(
                                    "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.TalepTipi"
                                  )}{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </span>
                              }
                              inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Autocomplete
                          options={ticketPriority}
                          // disabled={isOpen}
                          disabled={isOpen ? !canEditTicket : false}
                          getOptionLabel={(option) => option.description}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          value={selectedTicketPriority}
                          onChange={(event, newValue) => {
                            if (!newValue) return;
                            setTicketForm({ ...ticketForm, priority: newValue.id });
                            setSelectedTicketPriority(newValue);
                          }}
                          renderInput={(params) => (
                            <MDInput
                              {...params}
                              size="large"
                              placeholder={t(
                                "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.TalepOnceligi"
                              )}
                              // label="Talep Önceliği"
                              label={
                                <span>
                                  {t(
                                    "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.TalepOnceligi"
                                  )}{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </span>
                              }
                              inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Autocomplete
                          options={companyData}
                          // disabled={isOpen}
                          disabled={isOpen ? !canEditTicket : false}
                          getOptionLabel={(option) => option.name}
                          sx={{ mb: 3.2 }}
                          value={selectedToCompany}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          onChange={(event, newValue) => {
                            if (!newValue) return;
                            setTicketForm({ ...ticketForm, customerRefId: newValue.id });
                            setselectedToCompany(newValue);
                            onChangeToCompany(newValue.id);
                          }}
                          renderInput={(params) => (
                            <MDInput
                              {...params}
                              size="large"
                              placeholder={t(
                                "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.Musteri"
                              )}
                              label={
                                <span>
                                  {t(
                                    "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.Musteri"
                                  )}{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </span>
                              }
                              inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Autocomplete
                          options={systemData}
                          // disabled={isOpen}
                          disabled={isOpen ? !canEditTicket : false}
                          getOptionLabel={(option) => option.name}
                          value={selectedSystem}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          onChange={(event, newValue) => {
                            if (!newValue) return;
                            setTicketForm({ ...ticketForm, workCompanySystemInfoId: newValue.id });
                            setSelectedSystem(newValue);
                          }}
                          noOptionsText={t(
                            "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.NoSystem"
                          )}
                          renderInput={(params) => (
                            <MDInput
                              {...params}
                              size="large"
                              placeholder={t(
                                "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.MusteriSistemBilgileri"
                              )}
                              label={t(
                                "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.MusteriSistemBilgileri"
                              )}
                              inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <MDBox mt={3}>
                  {!isLoading && id && (
                    <>
                      {id && isOpen ? (
                        <MDBox display="flex" alignItems="end" justifyContent="end" p={2}>
                          <MDButton
                            sx={{ mr: 2 }}
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              if (checkApr == true) {
                                navigate("/approve");
                              } else {
                                isSolveTicket ? navigate("/solveAllTicket/") : navigate("/tickets");
                              }
                            }}
                          >
                            {t(
                              "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.GeriDon"
                            )}
                          </MDButton>

                          <MDButton
                            hidden={!canEditTicket}
                            type="submit"
                            variant="gradient"
                            color="info"
                            onClick={() => handleUpdateTicket(true, true)}
                          >
                            {t(
                              "ns1:TicketDetailPage.TicketDetailPage.TicketDetailNavBarProps.TalepGuncelleme"
                            )}
                          </MDButton>
                        </MDBox>
                      ) : (
                        <MDBox display="flex" alignItems="end" justifyContent="end" p={2}>
                          <MDButton
                            sx={{ mr: 2 }}
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              isSolveTicket ? navigate("/solveAllTicket/") : navigate("/tickets");
                            }}
                          >
                            {t("ns1:TicketDetailPage.TicketDetailPage.Iptal")}
                          </MDButton>
                          <MDButton
                            sx={{ mr: 2 }}
                            type="submit"
                            variant="gradient"
                            color="secondary"
                            onClick={() => handleUpdateTicket(false)}
                          >
                            {t("ns1:TicketDetailPage.TicketDetailPage.TaslakGuncelle")}
                          </MDButton>
                          <MDButton
                            type="submit"
                            variant="gradient"
                            color="info"
                            onClick={() => handleUpdateTicket(true)}
                          >
                            {t("ns1:TicketDetailPage.TicketDetailPage.TalepGonder")}
                          </MDButton>
                        </MDBox>
                      )}
                    </>
                  )}

                  <MDTypography variant="h5" color="text">
                    {
                      <span>
                        {t(
                          "ns1:TicketDetailPage.TicketDetailPage.TicketDetailHeaderProps.TalepBasligi"
                        )}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                  </MDTypography>
                  <Grid item xs={12} sm={6}>
                    <MDInput
                      type="text"
                      disabled={isOpen}
                      sx={{ mb: 3.2 }}
                      value={ticketTitleText} // state'den alın
                      placeholder={t(
                        "ns1:TicketDetailPage.TicketDetailPage.TicketDetailHeaderProps.TalepBasligiPlaceholder"
                      )}
                      onChange={(e: any) => {
                        const trimText = e.target.value.trimStart();
                        setTicketTitleText(trimText); // Kullanıcının yazdığı değeri aynen sakla
                        setTicketForm({ ...ticketForm, title: trimText });
                      }}
                      onBlur={() => {
                        const trimmedValue = ticketTitleText.trim();
                        setTicketTitleText(trimmedValue);
                        setTicketForm({ ...ticketForm, title: trimmedValue });
                      }} // güncelle
                      fullWidth
                      inputProps={{ maxLength: 55 }}
                    />
                  </Grid>
                  <Grid container spacing={3}></Grid>
                  {renderOldTextAndFiles()}
                  {review == true ? null : (
                    <MDTypography variant="h5" color="text">
                      {" "}
                      {
                        <span>
                          {t(
                            "ns1:TicketDetailPage.TicketDetailPage.TicketDetailHeaderProps.Aciklama"
                          )}{" "}
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                    </MDTypography>
                  )}

                  {/* <MDTypography variant="subtitle2" color="text">
                  Üstteki sorun için isteğe bağlı yanıt.
                </MDTypography> */}
                  {review == true ? null : (
                    <Grid container spacing={3} mt={2} paddingBottom={4}>
                      <Grid item xs={12}>
                        <ReactQuill
                          ref={quillRef}
                          className="custom-quill"
                          style={{ minHeight: "200px" }}
                          modules={modules}
                          formats={formats}
                          value={newCommentBody || ""}
                          onChange={handleChangeText}
                          theme="snow"
                        />
                      </Grid>
                    </Grid>
                  )}
                </MDBox>
                <MDBox mt={0}>
                  {canEdit ? (
                    <MDBox display="flex" alignItems="center" mt={1}>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpeg,.png,.pptx"
                        style={{ display: "none" }}
                        id="file-select"
                        onChange={handleFileSelect}
                      />
                      <label htmlFor="file-select">
                        {review == true ? null : (
                          <MDButton
                            component="span"
                            variant="contained"
                            color="info"
                            startIcon={<AttachFileIcon />}
                            sx={{ mr: 2 }}
                            disabled={!canEdit}
                          >
                            {t(
                              "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.DosyaSec"
                            )}
                          </MDButton>
                        )}

                        {id ? (
                          review ? null : (
                            <MDButton
                              variant="outlined"
                              color="secondary"
                              onClick={() => sendComment()}
                              disabled={!canEdit}
                              vi
                            >
                              {t(
                                "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.AciklamaGonder"
                              )}
                            </MDButton>
                          )
                        ) : null}
                      </label>
                    </MDBox>
                  ) : null}

                  {newSelectedFiles.length > 0 &&
                    (review ? null : (
                      <MDTypography variant="h6" color="text">
                        {t(
                          "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.SecilenDosyalar"
                        )}
                      </MDTypography>
                    ))}

                  {newSelectedFiles.length > 0 && (
                    <MDBox mt={2}>
                      {newSelectedFiles.map((file, index) => (
                        <MDBox
                          key={`file-${index}`}
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{
                            backgroundColor: "rgba(255,255,255,0.65)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid",
                            borderColor: "#e2e8f0",
                            borderRadius: "12px",
                            padding: "10px 14px",
                            marginTop: index > 0 ? 1 : 0,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.85)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                            },
                          }}
                        >
                          <MDBox display="flex" alignItems="center" gap={1}>
                            <AttachFileIcon
                              sx={{
                                fontSize: "18px",
                                color: "text.secondary",
                                transform: "rotate(45deg)",
                              }}
                            />
                            <MDTypography
                              variant="button"
                              sx={{
                                fontSize: "0.8125rem",
                                color: "text.primary",
                                fontWeight: 400,
                              }}
                            >
                              {file.name}
                            </MDTypography>
                            <MDTypography variant="caption" color="text">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </MDTypography>
                          </MDBox>
                          <MDBox display="flex" gap={1}>
                            <MDButton
                              variant="text"
                              color="error"
                              size="small"
                              onClick={() => handleDeleteFile(file)}
                              startIcon={
                                <DeleteIcon
                                  sx={{ fontSize: "16px", transition: "all 0.2s ease" }}
                                />
                              }
                              sx={{
                                minWidth: "auto",
                                padding: "6px 12px",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                transition: "all 0.2s ease",
                                opacity: 0.85,
                                "&:hover": {
                                  opacity: 1,
                                  backgroundColor: "rgba(0,0,0,0.04)",
                                  "& .MuiSvgIcon-root": {
                                    transform: "translateY(1px)",
                                  },
                                },
                              }}
                            >
                              {t(
                                "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.Sil"
                              )}
                            </MDButton>
                            <MDButton
                              variant="text"
                              color="info"
                              size="small"
                              onClick={() => handleDownload(file)}
                              startIcon={
                                <GetAppIcon
                                  sx={{ fontSize: "16px", transition: "all 0.2s ease" }}
                                />
                              }
                              sx={{
                                minWidth: "auto",
                                padding: "6px 12px",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                transition: "all 0.2s ease",
                                opacity: 0.85,
                                "&:hover": {
                                  opacity: 1,
                                  backgroundColor: "rgba(0,0,0,0.04)",
                                  "& .MuiSvgIcon-root": {
                                    transform: "translateY(2px)",
                                  },
                                },
                              }}
                            >
                              {t(
                                "ns1:TicketDetailPage.TicketDetailPage.TicketDetailInputProps.Indir"
                              )}
                            </MDButton>
                          </MDBox>
                        </MDBox>
                      ))}
                    </MDBox>
                  )}
                </MDBox>
                {!isSolveTicket && (
                  <MDBox mt={5}>
                    <MDTypography variant="h5" color="text">
                      <span>Talep için bildirim gönderilecek e-posta adresleri</span>
                    </MDTypography>

                    <Grid item xs={12} sm={6}>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: "8px",
                          border: "1px solid #ccc",
                          padding: "8px",
                          borderRadius: "6px",
                          minHeight: "56px",
                        }}
                      >
                        {ccEmails.map((ccEmails, index) => (
                          <span
                            key={index}
                            style={{
                              backgroundColor: "#1976d2",
                              color: "#fff",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "14px",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            {ccEmails}
                            <MDButton
                              disabled={isOpen}
                              variant="text"
                              size="small"
                              onClick={() => removeCcEmail(index)}
                              style={{ minWidth: "unset", padding: 0, color: "#fff" }}
                            >
                              <i className="material-icons" style={{ fontSize: "16px" }}>
                                close
                              </i>
                            </MDButton>
                          </span>
                        ))}

                        <MDInput
                          disabled={isOpen}
                          type="text"
                          value={ccInputValue}
                          placeholder="Bildirim göndermek istediğiniz e-posta adreslerini boşluk bırakarak yazınız."
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setCcInputValue(e.target.value)
                          }
                          onKeyDown={handleAddCcEmail}
                          sx={{ minWidth: "250px", border: "none", boxShadow: "none" }}
                          fullWidth
                          inputProps={{ maxLength: 55 }}
                        />
                      </div>
                    </Grid>
                  </MDBox>
                )}
              </MDBox>
              {!id && (
                <MDBox display="flex" alignItems="end" justifyContent="end" p={2}>
                  <MDButton
                    sx={{ mr: 2 }}
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate("/tickets")}
                  >
                    {t("ns1:TicketDetailPage.TicketDetailPage.Iptal")}
                  </MDButton>
                  {isOpen ? null : (
                    <MDButton
                      sx={{ mr: 2 }}
                      type="submit"
                      variant="gradient"
                      color="secondary"
                      onClick={() => handleCreateTicket(false)}
                      disabled={isSubmitting}
                    >
                      {t("ns1:TicketDetailPage.TicketDetailPage.TaslakOlarakKaydet")}
                    </MDButton>
                  )}
                  {isOpen ? null : (
                    <MDButton
                      type="submit"
                      variant="gradient"
                      color="info"
                      onClick={() => handleCreateTicket(true)}
                      disabled={isSubmitting}
                    >
                      {t("ns1:TicketDetailPage.TicketDetailPage.TalepOlustur")}
                    </MDButton>
                  )}
                </MDBox>
              )}
            </MDBox>
          )}
          {activeIndex === 1 && createAssignTimeLine()}
          {activeIndex == 2 && (
            <MDBox p={3} pt={0}>
              <MDBox>
                <Grid paddingLeft={3} container spacing={3}>
                  <Grid item xs={12} sm={12} lg={11.9}></Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={0} lg={0.1} />
                  <Grid item xs={12} sm={12} lg={4.4}>
                    <MDBox mt={3} mb={3}>
                      <MDTypography variant="h5" color="text">
                        {t("ns1:TicketDetailPage.GenelAtalamalar.GenelAtalamalar")}
                      </MDTypography>
                    </MDBox>
                    <Autocomplete
                      options={departmentData}
                      disabled={!flagBoolean}
                      getOptionLabel={(option) => option.departmentText}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      value={selectedDepartment}
                      renderInput={(params) => (
                        <MDInput
                          {...params}
                          fullWidth
                          label={t("ns1:TicketDetailPage.GenelAtalamalar.InputProps.Departman")}
                          sx={{ mb: 3 }}
                          inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                        />
                      )}
                      onChange={(event, newValue) => {
                        setSelectedDepartment(newValue);
                      }}
                    />
                    <Autocomplete
                      options={statusData}
                      getOptionLabel={(option) => option.description}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      value={selectedStatus}
                      renderInput={(params) => (
                        <MDInput
                          {...params}
                          fullWidth
                          label={t("ns1:TicketDetailPage.GenelAtalamalar.InputProps.Status")}
                          sx={{ mb: 2 }}
                          inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                        />
                      )}
                      onChange={(event, newValue) => {
                        setSelectedStatus(newValue);
                      }}
                    />
                    <MDInput
                      type="date"
                      fullWidth
                      label="Tahmini Bitiş Tarihi"
                      InputLabelProps={{ shrink: true }}
                      value={formatDateForInput(selectedDate)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSelectedDate(e.target.value);
                      }}
                      sx={{ mb: 2 }}
                    />
                    <Autocomplete
                      options={projectData}
                      getOptionLabel={(option) =>
                        option.subProjectName
                          ? `${option.name} - ${option.subProjectName}`
                          : option.name
                      }
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      value={selectedProject}
                      renderInput={(params) => (
                        <MDInput
                          {...params}
                          fullWidth
                          label="Proje"
                          sx={{ mb: 2 }}
                          inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                        />
                      )}
                      onChange={(event, newValue) => {
                        setSelectedProject(newValue);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={0} lg={1.5} />
                  <Grid item xs={12} sm={12} lg={5.5}>
                    <MDBox mt={3} mb={2}>
                      <MDTypography variant="h5" color="text">
                        {t("ns1:TicketDetailPage.GenelAtalamalar.AtanilanKisiYadaTakim")} :{" "}
                        <span style={{ fontWeight: "bold", color: "black" }}>{nameOfAssigned}</span>
                      </MDTypography>
                    </MDBox>
                    <MDBox>
                      <FormControl>
                        <FormControlLabel
                          disabled={!flagBoolean}
                          control={<Checkbox id="showMenu" checked={checkBox} />}
                          label={
                            <MDTypography fontWeight="medium" variant="caption" color="text">
                              {t("ns1:TicketDetailPage.GenelAtalamalar.TakimAta")}
                            </MDTypography>
                          }
                          onChange={(event, newValue) => {
                            setCheckBox(newValue);
                          }}
                        />
                      </FormControl>
                      {!checkBox ? (
                        <Autocomplete
                          sx={{ mb: 3.2 }}
                          fullWidth
                          disabled={!flagBoolean}
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
                                setSelectionPerson(newValue.userAppName);
                              } else {
                                setSelectionPerson(`${newValue.firstName} ${newValue.lastName}`);
                              }
                            }
                            setSelectedPerson(newValue);
                          }}
                          onInputChange={(event, newInputValue) => {
                            handleSearchByName(newInputValue);
                          }}
                          renderInput={(params) => (
                            <MDInput
                              {...params}
                              size="large"
                              placeholder={t(
                                "ns1:TicketDetailPage.GenelAtalamalar.InputProps.KullaniciPlaceholder"
                              )}
                              label={t("ns1:TicketDetailPage.GenelAtalamalar.InputProps.Kullanici")}
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
                      ) : (
                        <Autocomplete
                          sx={{ mb: 3.2 }}
                          options={teamData}
                          fullWidth
                          getOptionLabel={(option) => option.name}
                          value={selectedTeam}
                          renderInput={(params) => (
                            <MDInput
                              {...params}
                              size="large"
                              placeholder={t(
                                "ns1:TicketDetailPage.GenelAtalamalar.InputProps.TakimPlaceholder"
                              )}
                              label={t("ns1:TicketDetailPage.GenelAtalamalar.InputProps.Takim")}
                              inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                            />
                          )}
                          onChange={(event, newValue) => {
                            setSelectedTeam(newValue);
                          }}
                        />
                      )}
                    </MDBox>
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={0} lg={0.1} />
                  <Grid item xs={12} sm={12} lg={11.4}>
                    <MDBox mt={3} mb={2}>
                      <MDInput
                        value={assingDesc}
                        placeholder={t(
                          "ns1:TicketDetailPage.GenelAtalamalar.InputProps.GuncellemeNedeniPlaceholder"
                        )}
                        label={t(
                          "ns1:TicketDetailPage.GenelAtalamalar.InputProps.GuncellemeNedeni"
                        )}
                        fullWidth
                        multiline
                        rows={8}
                        onChange={(e: any) => setassingDesc(e.target.value)}
                      />
                    </MDBox>
                    <MDBox mb={2}>
                      <MDTypography variant="h5" color="text">
                        {t(
                          "ns1:TicketDetailPage.GenelAtalamalar.InputProps.IlgiliKisilerTicketGuncellendigindeBilgilendirmeGidecektir"
                        )}
                      </MDTypography>
                    </MDBox>
                    <Autocomplete
                      sx={{ mb: 3.2 }}
                      multiple
                      options={searchByName}
                      getOptionLabel={(option: UserAppDto) =>
                        `${option.firstName} ${option.lastName}`
                      }
                      value={selectedIlgiliPerson}
                      isOptionEqualToValue={(option: UserAppDto, value: UserAppDto) =>
                        option?.id === value?.id
                      }
                      onChange={(event, newValues: UserAppDto[]) => {
                        setSelectedIlgiliPerson(newValues);
                        setSelectionIlgiliPerson(newValues.map((user) => user.id));
                      }}
                      onInputChange={(event, newInputValue) => {
                        handleSearchByName(newInputValue);
                      }}
                      renderInput={(params) => (
                        <MDInput
                          {...params}
                          size="large"
                          InputLabelProps={{ shrink: true }}
                          placeholder={t(
                            "ns1:TicketDetailPage.GenelAtalamalar.InputProps.KullancilarPlaceholder"
                          )}
                          label={t("ns1:TicketDetailPage.GenelAtalamalar.InputProps.Kullancilar")}
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

                  <Grid item xs={12} sm={0} lg={0.5} />
                </Grid>
                {canEdit ? (
                  <MDBox mt={2} mr={2} display="flex" justifyContent="end">
                    <MDButton
                      sx={{ mr: 2 }}
                      variant="outlined"
                      color="error"
                      onClick={() => navigate("/solveAllTicket/")}
                      disabled={!canEdit}
                    >
                      {t("ns1:TicketDetailPage.GenelAtalamalar.InputProps.Iptal")}
                    </MDButton>
                    <MDButton
                      disabled={!canEdit}
                      variant="gradient"
                      color="info"
                      onClick={() => handleAssignTicket()}
                    >
                      {t("ns1:TicketDetailPage.GenelAtalamalar.InputProps.Kaydet")}
                    </MDButton>
                  </MDBox>
                ) : null}
              </MDBox>
            </MDBox>
          )}
        </Card>
      </Grid>
      <Footer />
    </DashboardLayout>
  );
}

export default CreateRequest;
